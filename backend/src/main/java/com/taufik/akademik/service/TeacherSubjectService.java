package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.TeacherSubjectRequest;
import com.taufik.akademik.dto.response.TeacherSubjectResponse;
import com.taufik.akademik.exception.ResourceNotFoundException;
import com.taufik.akademik.model.AcademicYear;
import com.taufik.akademik.model.Subject;
import com.taufik.akademik.model.Teacher;
import com.taufik.akademik.model.TeacherSubject;
import com.taufik.akademik.repository.AcademicYearRepository;
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
                .isActive(teacherSubject.getIsActive())
                .createdAt(teacherSubject.getCreatedAt())
                .updatedAt(teacherSubject.getUpdatedAt())
                .build();
    }
}