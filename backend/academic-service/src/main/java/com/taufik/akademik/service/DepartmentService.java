package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.DepartmentRequest;
import com.taufik.akademik.dto.response.DepartmentResponse;
import com.taufik.akademik.exception.ResourceNotFoundException;
import com.taufik.akademik.model.Department;
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
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        log.info("Creating new department with code: {}", request.getCode());

        if (departmentRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Department with code " + request.getCode() + " already exists");
        }

        Department department = new Department();
        department.setCode(request.getCode().toUpperCase());
        department.setName(request.getName());
        department.setDescription(request.getDescription());

        Department saved = departmentRepository.save(department);
        log.info("Department created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        log.info("Fetching all departments");
        return departmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getActiveDepartments() {
        log.info("Fetching active departments");
        return departmentRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(Long id) {
        log.info("Fetching department with id: {}", id);
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return mapToResponse(department);
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentByCode(String code) {
        log.info("Fetching department with code: {}", code);
        Department department = departmentRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with code: " + code));
        return mapToResponse(department);
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        log.info("Updating department with id: {}", id);

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        if (!department.getCode().equals(request.getCode()) &&
                departmentRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Department with code " + request.getCode() + " already exists");
        }

        department.setCode(request.getCode().toUpperCase());
        department.setName(request.getName());
        department.setDescription(request.getDescription());

        Department updated = departmentRepository.save(department);
        log.info("Department updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        log.info("Deleting department with id: {}", id);

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        department.setIsActive(false);
        departmentRepository.save(department);
        log.info("Department deactivated successfully with id: {}", id);
    }

    private DepartmentResponse mapToResponse(Department department) {
        return DepartmentResponse.builder()
                .id(department.getId())
                .code(department.getCode())
                .name(department.getName())
                .description(department.getDescription())
                .isActive(department.getIsActive())
                .classCount(department.getClasses() != null ? department.getClasses().size() : 0)
                .createdAt(department.getCreatedAt())
                .updatedAt(department.getUpdatedAt())
                .build();
    }
}