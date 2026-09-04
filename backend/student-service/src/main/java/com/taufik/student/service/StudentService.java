package com.taufik.student.service;

import com.taufik.student.dto.request.StudentRequest;
import com.taufik.student.dto.response.StudentResponse;
import com.taufik.student.exception.ResourceNotFoundException;
import com.taufik.student.model.Student;
import com.taufik.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {

    private final StudentRepository studentRepository;
    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        log.info("Creating new student with NIS: {}", request.getNis());

        if (studentRepository.existsByNis(request.getNis())) {
            throw new RuntimeException("Student with NIS " + request.getNis() + " already exists");
        }

        Student student = new Student();
        student.setUserId(request.getUserId());
        student.setNis(request.getNis());
        student.setNisn(request.getNisn());
        student.setFullName(request.getFullName());
        student.setGender(request.getGender());
        student.setPhotoUrl(request.getPhotoUrl());
        student.setPhone(request.getPhone());
        student.setAddress(request.getAddress());
        student.setDepartmentId(request.getDepartmentId());
        student.setClassId(request.getClassId());

        Student saved = studentRepository.save(student);
        log.info("Student created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getActiveStudents() {
        return studentRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToResponse(student);
    }

    @Transactional(readOnly = true)
    public StudentResponse getStudentByNis(String nis) {
        Student student = studentRepository.findByNis(nis)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with NIS: " + nis));
        return mapToResponse(student);
    }

    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        student.setUserId(request.getUserId());
        student.setNis(request.getNis());
        student.setNisn(request.getNisn());
        student.setFullName(request.getFullName());
        student.setGender(request.getGender());
        student.setPhotoUrl(request.getPhotoUrl());
        student.setPhone(request.getPhone());
        student.setAddress(request.getAddress());
        student.setDepartmentId(request.getDepartmentId());
        student.setClassId(request.getClassId());

        Student updated = studentRepository.save(student);
        log.info("Student updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
        log.info("Student deleted successfully with id: {}", id);
    }

    private StudentResponse mapToResponse(Student student) {
        String className = null;
        if (student.getClassId() != null) {
            try {
                className = jdbcTemplate.queryForObject(
                    "SELECT name FROM classes WHERE id = ?", String.class, student.getClassId());
            } catch (Exception e) { log.warn("Could not fetch class name: {}", e.getMessage()); }
        }
        return StudentResponse.builder()
                .id(student.getId())
                .userId(student.getUserId())
                .nis(student.getNis())
                .nisn(student.getNisn())
                .fullName(student.getFullName())
                .gender(student.getGender())
                .photoUrl(student.getPhotoUrl())
                .phone(student.getPhone())
                .address(student.getAddress())
                .departmentId(student.getDepartmentId())
                .classId(student.getClassId())
                .className(className)
                .isActive(student.getIsActive())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }
}