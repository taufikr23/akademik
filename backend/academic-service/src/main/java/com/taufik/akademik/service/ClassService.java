package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.ClassRequest;
import com.taufik.akademik.dto.response.ClassResponse;
import com.taufik.akademik.exception.ResourceNotFoundException;
import com.taufik.akademik.model.Class;
import com.taufik.akademik.model.Department;
import com.taufik.akademik.repository.ClassRepository;
import com.taufik.akademik.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassService {

    private final ClassRepository classRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional
    public ClassResponse createClass(ClassRequest request) {
        log.info("Creating new class with name: {}", request.getName());

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        if (classRepository.existsByNameAndDepartmentId(request.getName(), request.getDepartmentId())) {
            throw new RuntimeException("Class with name " + request.getName() + " already exists in this department");
        }

        Class classEntity = new Class();
        classEntity.setName(request.getName());
        classEntity.setDepartment(department);
        classEntity.setGradeLevel(request.getGradeLevel());
        classEntity.setAcademicYearId(request.getAcademicYearId());

        Class saved = classRepository.save(classEntity);
        log.info("Class created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ClassResponse> getAllClasses() {
        log.info("Fetching all classes");
        return classRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClassResponse> getClassesByDepartment(Long departmentId) {
        log.info("Fetching classes for department id: {}", departmentId);
        return classRepository.findByDepartmentId(departmentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClassResponse getClassById(Long id) {
        log.info("Fetching class with id: {}", id);
        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));
        return mapToResponse(classEntity);
    }

    @Transactional
    public ClassResponse updateClass(Long id, ClassRequest request) {
        log.info("Updating class with id: {}", id);

        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        classEntity.setName(request.getName());
        classEntity.setDepartment(department);
        classEntity.setGradeLevel(request.getGradeLevel());
        classEntity.setAcademicYearId(request.getAcademicYearId());

        Class updated = classRepository.save(classEntity);
        log.info("Class updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteClass(Long id) {
        log.info("Deleting class with id: {}", id);

        Class classEntity = classRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + id));

        classEntity.setIsActive(false);
        classRepository.save(classEntity);
        log.info("Class deactivated successfully with id: {}", id);
    }

    private ClassResponse mapToResponse(Class classEntity) {
        return ClassResponse.builder()
                .id(classEntity.getId())
                .name(classEntity.getName())
                .departmentId(classEntity.getDepartment().getId())
                .departmentName(classEntity.getDepartment().getName())
                .gradeLevel(classEntity.getGradeLevel())
                .academicYearId(classEntity.getAcademicYearId())
                .isActive(classEntity.getIsActive())
                .createdAt(classEntity.getCreatedAt())
                .updatedAt(classEntity.getUpdatedAt())
                .build();
    }
}