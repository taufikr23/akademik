package com.taufik.student.service;

import com.taufik.student.dto.request.StudentEnrollmentRequest;
import com.taufik.student.dto.response.StudentEnrollmentResponse;
import com.taufik.student.exception.ResourceNotFoundException;
import com.taufik.student.model.Student;
import com.taufik.student.model.StudentEnrollment;
import com.taufik.student.repository.StudentEnrollmentRepository;
import com.taufik.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentEnrollmentService {

    private final StudentEnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public StudentEnrollmentResponse createEnrollment(StudentEnrollmentRequest request) {
        log.info("Creating enrollment for student: {}", request.getStudentId());

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        // Cek duplikat
        if (enrollmentRepository.existsByStudentIdAndClassIdAndAcademicYearId(
                request.getStudentId(), request.getClassId(), request.getAcademicYearId())) {
            throw new RuntimeException("Student already enrolled in this class for this academic year");
        }

        StudentEnrollment enrollment = new StudentEnrollment();
        enrollment.setStudent(student);
        enrollment.setClassId(request.getClassId());
        enrollment.setAcademicYearId(request.getAcademicYearId());
        enrollment.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        StudentEnrollment saved = enrollmentRepository.save(enrollment);
        log.info("Enrollment created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<StudentEnrollmentResponse> getAllEnrollments() {
        log.info("Fetching all enrollments");
        return enrollmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentEnrollmentResponse> getEnrollmentsByStudent(Long studentId) {
        log.info("Fetching enrollments for student: {}", studentId);
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentEnrollmentResponse> getEnrollmentsByClass(Long classId) {
        log.info("Fetching enrollments for class: {}", classId);
        return enrollmentRepository.findByClassId(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StudentEnrollmentResponse> getEnrollmentsByAcademicYear(Long academicYearId) {
        log.info("Fetching enrollments for academic year: {}", academicYearId);
        return enrollmentRepository.findByAcademicYearId(academicYearId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentEnrollmentResponse updateEnrollmentStatus(Long id, String status) {
        log.info("Updating enrollment status: {} -> {}", id, status);

        StudentEnrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with id: " + id));

        enrollment.setStatus(status);
        StudentEnrollment updated = enrollmentRepository.save(enrollment);

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteEnrollment(Long id) {
        log.info("Deleting enrollment with id: {}", id);
        enrollmentRepository.deleteById(id);
    }

    private StudentEnrollmentResponse mapToResponse(StudentEnrollment enrollment) {
        return StudentEnrollmentResponse.builder()
                .id(enrollment.getId())
                .studentId(enrollment.getStudent().getId())
                .studentName(enrollment.getStudent().getFullName())
                .studentNis(enrollment.getStudent().getNis())
                .classId(enrollment.getClassId())
                .academicYearId(enrollment.getAcademicYearId())
                .status(enrollment.getStatus())
                .createdAt(enrollment.getCreatedAt())
                .build();
    }
}