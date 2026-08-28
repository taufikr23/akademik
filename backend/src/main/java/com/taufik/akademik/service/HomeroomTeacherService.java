package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.HomeroomTeacherRequest;
import com.taufik.akademik.dto.response.HomeroomTeacherResponse;
import com.taufik.akademik.exception.ResourceNotFoundException;
import com.taufik.akademik.model.AcademicYear;
import com.taufik.akademik.model.Class;
import com.taufik.akademik.model.HomeroomTeacher;
import com.taufik.akademik.model.Teacher;
import com.taufik.akademik.repository.AcademicYearRepository;
import com.taufik.akademik.repository.ClassRepository;
import com.taufik.akademik.repository.HomeroomTeacherRepository;
import com.taufik.akademik.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HomeroomTeacherService {

    private final HomeroomTeacherRepository homeroomTeacherRepository;
    private final TeacherRepository teacherRepository;
    private final ClassRepository classRepository;
    private final AcademicYearRepository academicYearRepository;

    @Transactional
    public HomeroomTeacherResponse assignHomeroomTeacher(HomeroomTeacherRequest request) {
        log.info("Assigning homeroom teacher {} to class {} for academic year {}",
                request.getTeacherId(), request.getClassId(), request.getAcademicYearId());

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + request.getTeacherId()));

        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));

        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic year not found with id: " + request.getAcademicYearId()));

        if (homeroomTeacherRepository.existsByClassEntityIdAndAcademicYearId(request.getClassId(), request.getAcademicYearId())) {
            throw new RuntimeException("This class already has a homeroom teacher for this academic year");
        }

        HomeroomTeacher homeroomTeacher = new HomeroomTeacher();
        homeroomTeacher.setTeacher(teacher);
        homeroomTeacher.setClassEntity(classEntity);
        homeroomTeacher.setAcademicYear(academicYear);

        HomeroomTeacher saved = homeroomTeacherRepository.save(homeroomTeacher);
        log.info("Homeroom teacher assigned with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<HomeroomTeacherResponse> getAllHomeroomTeachers() {
        return homeroomTeacherRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HomeroomTeacherResponse> getHomeroomTeachersByTeacher(Long teacherId) {
        return homeroomTeacherRepository.findByTeacherId(teacherId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HomeroomTeacherResponse> getHomeroomTeachersByClass(Long classId) {
        return homeroomTeacherRepository.findByClassEntityId(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HomeroomTeacherResponse> getHomeroomTeachersByAcademicYear(Long academicYearId) {
        return homeroomTeacherRepository.findByAcademicYearId(academicYearId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public HomeroomTeacherResponse getHomeroomTeacherById(Long id) {
        HomeroomTeacher homeroomTeacher = homeroomTeacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homeroom teacher not found with id: " + id));
        return mapToResponse(homeroomTeacher);
    }

    @Transactional
    public HomeroomTeacherResponse updateHomeroomTeacher(Long id, HomeroomTeacherRequest request) {
        log.info("Updating homeroom teacher with id: {}", id);

        HomeroomTeacher homeroomTeacher = homeroomTeacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homeroom teacher not found with id: " + id));

        Teacher teacher = teacherRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + request.getTeacherId()));

        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + request.getClassId()));

        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic year not found with id: " + request.getAcademicYearId()));

        homeroomTeacher.setTeacher(teacher);
        homeroomTeacher.setClassEntity(classEntity);
        homeroomTeacher.setAcademicYear(academicYear);

        HomeroomTeacher updated = homeroomTeacherRepository.save(homeroomTeacher);
        return mapToResponse(updated);
    }

    @Transactional
    public void removeHomeroomTeacher(Long id) {
        HomeroomTeacher homeroomTeacher = homeroomTeacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homeroom teacher not found with id: " + id));
        homeroomTeacher.setIsActive(false);
        homeroomTeacherRepository.save(homeroomTeacher);
        log.info("Homeroom teacher removed with id: {}", id);
    }

    private HomeroomTeacherResponse mapToResponse(HomeroomTeacher homeroomTeacher) {
        return HomeroomTeacherResponse.builder()
                .id(homeroomTeacher.getId())
                .teacherId(homeroomTeacher.getTeacher().getId())
                .teacherName(homeroomTeacher.getTeacher().getFullName())
                .classId(homeroomTeacher.getClassEntity().getId())
                .className(homeroomTeacher.getClassEntity().getName())
                .academicYearId(homeroomTeacher.getAcademicYear().getId())
                .academicYearName(homeroomTeacher.getAcademicYear().getYearName())
                .isActive(homeroomTeacher.getIsActive())
                .createdAt(homeroomTeacher.getCreatedAt())
                .updatedAt(homeroomTeacher.getUpdatedAt())
                .build();
    }
}