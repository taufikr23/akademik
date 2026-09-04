package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.TeacherSubjectRequest;
import com.taufik.akademik.dto.response.TeacherSubjectResponse;
import com.taufik.akademik.exception.ResourceNotFoundException;
import com.taufik.akademik.model.AcademicYear;
import com.taufik.akademik.model.Subject;
import com.taufik.akademik.model.Teacher;
import com.taufik.akademik.model.TeacherSubject;
import com.taufik.akademik.repository.AcademicYearRepository;
import com.taufik.akademik.repository.ClassRepository;
import com.taufik.akademik.repository.SubjectRepository;
import com.taufik.akademik.repository.TeacherRepository;
import com.taufik.akademik.repository.TeacherSubjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherSubjectService {

    private final TeacherSubjectRepository teacherSubjectRepository;
    private final TeacherRepository teacherRepository;
    private final SubjectRepository subjectRepository;
    private final AcademicYearRepository academicYearRepository;
    private final ClassRepository classRepository;


    @Transactional
    public TeacherSubjectResponse assignTeacherToSubject(TeacherSubjectRequest request) {
        log.info("Assigning teacher {} to subject {} for academic year {}",
                request.getTeacherId(), request.getSubjectId(), request.getAcademicYearId());

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + request.getTeacherId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));

        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic year not found with id: " + request.getAcademicYearId()));

        if (teacherSubjectRepository.existsByTeacherIdAndSubjectIdAndAcademicYearId(
                request.getTeacherId(), request.getSubjectId(), request.getAcademicYearId())) {
            throw new RuntimeException("Teacher is already assigned to this subject for this academic year");
        }

        TeacherSubject teacherSubject = new TeacherSubject();
        teacherSubject.setTeacher(teacher);
        teacherSubject.setSubject(subject);
        teacherSubject.setAcademicYear(academicYear);

        if (request.getClassId() != null) {
            com.taufik.akademik.model.Class classRoom = classRepository.findById(request.getClassId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));
            teacherSubject.setClassRoom(classRoom);
        }

        if (request.getDayOfWeek() != null) {
            // Validasi slot waktu hanya boleh salah satu dari 3 slot tetap
            String[] validStarts = {"08:00", "10:30", "13:00"};
            String[] validEnds = {"10:00", "11:30", "15:00"};
            boolean validSlot = false;
            for (int i = 0; i < validStarts.length; i++) {
                if (validStarts[i].equals(request.getStartTime()) && validEnds[i].equals(request.getEndTime())) {
                    validSlot = true;
                    break;
                }
            }
            if (!validSlot) {
                throw new RuntimeException("Slot waktu tidak valid! Pilih: 08:00-10:00, 10:30-11:30, atau 13:00-15:00");
            }

            teacherSubject.setDayOfWeek(request.getDayOfWeek());
            teacherSubject.setStartTime(request.getStartTime());
            teacherSubject.setEndTime(request.getEndTime());
            teacherSubject.setRoom(request.getRoom());

            // Validasi guru tidak bentrok (sama guru, sama hari, sama slot)
            List<TeacherSubject> existingTeacher = teacherSubjectRepository.findByTeacherId(request.getTeacherId());
            for (TeacherSubject ts : existingTeacher) {
                if (ts.getIsActive() && ts.getDayOfWeek() != null && ts.getDayOfWeek().equals(request.getDayOfWeek())
                        && request.getStartTime().equals(ts.getStartTime())) {
                    throw new RuntimeException("Jadwal bentrok! Guru ini sudah mengajar hari " + request.getDayOfWeek() + " jam " + ts.getStartTime() + "-" + ts.getEndTime());
                }
            }

            // Validasi kelas tidak lebih dari 3 matpel per hari
            if (request.getClassId() != null) {
                List<TeacherSubject> existingClass = teacherSubjectRepository.findByClassRoom_Id(request.getClassId());
                long countSameDay = existingClass.stream()
                        .filter(ts -> ts.getIsActive() && ts.getDayOfWeek() != null && ts.getDayOfWeek().equals(request.getDayOfWeek()))
                        .count();
                if (countSameDay >= 3) {
                    throw new RuntimeException("Kelas sudah penuh hari " + request.getDayOfWeek() + "! Maksimal 3 mata pelajaran per hari.");
                }
            }
        }

        TeacherSubject saved = teacherSubjectRepository.save(teacherSubject);
        log.info("Teacher assigned to subject with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TeacherSubjectResponse> getAllAssignments() {
        return teacherSubjectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeacherSubjectResponse> getAssignmentsByTeacher(Long teacherId) {
        return teacherSubjectRepository.findByTeacherId(teacherId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeacherSubjectResponse> getAssignmentsBySubject(Long subjectId) {
        return teacherSubjectRepository.findBySubjectId(subjectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeacherSubjectResponse> getAssignmentsByClass(Long classId) {
        return teacherSubjectRepository.findByClassRoom_Id(classId).stream()
                .filter(ts -> ts.getIsActive() && ts.getDayOfWeek() != null)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeacherSubjectResponse> getAssignmentsByAcademicYear(Long academicYearId) {
        return teacherSubjectRepository.findByAcademicYearId(academicYearId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeacherSubjectResponse getAssignmentById(Long id) {
        TeacherSubject teacherSubject = teacherSubjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        return mapToResponse(teacherSubject);
    }

    @Transactional
    public void removeAssignment(Long id) {
        TeacherSubject teacherSubject = teacherSubjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        teacherSubject.setIsActive(false);
        teacherSubjectRepository.save(teacherSubject);
        log.info("Assignment removed with id: {}", id);
    }

    private TeacherSubjectResponse mapToResponse(TeacherSubject teacherSubject) {
        return TeacherSubjectResponse.builder()
                .id(teacherSubject.getId())
                .teacherId(teacherSubject.getTeacher().getId())
                .teacherName(teacherSubject.getTeacher().getFullName())
                .subjectId(teacherSubject.getSubject().getId())
                .subjectName(teacherSubject.getSubject().getName())
                .academicYearId(teacherSubject.getAcademicYear().getId())
                .academicYearName(teacherSubject.getAcademicYear().getYearName())
                .classId(teacherSubject.getClassRoom() != null ? teacherSubject.getClassRoom().getId() : null)
                .className(teacherSubject.getClassRoom() != null ? teacherSubject.getClassRoom().getName() : null)
                .departmentName(teacherSubject.getClassRoom() != null && teacherSubject.getClassRoom().getDepartment() != null ? teacherSubject.getClassRoom().getDepartment().getName() : null)
                .dayOfWeek(teacherSubject.getDayOfWeek())
                .startTime(teacherSubject.getStartTime())
                .endTime(teacherSubject.getEndTime())
                .room(teacherSubject.getRoom())
                .isActive(teacherSubject.getIsActive())
                .createdAt(teacherSubject.getCreatedAt())
                .updatedAt(teacherSubject.getUpdatedAt())
                .build();
    }
}