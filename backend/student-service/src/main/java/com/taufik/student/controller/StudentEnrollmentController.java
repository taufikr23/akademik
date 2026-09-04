package com.taufik.student.controller;

import com.taufik.student.dto.request.StudentEnrollmentRequest;
import com.taufik.student.dto.response.ApiResponse;
import com.taufik.student.dto.response.StudentEnrollmentResponse;
import com.taufik.student.service.StudentEnrollmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
@Slf4j
public class StudentEnrollmentController {

    private final StudentEnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentEnrollmentResponse>>> getAllEnrollments() {
        log.info("GET /api/enrollments - Get all enrollments");
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getAllEnrollments()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudentEnrollmentResponse>> createEnrollment(
            @Valid @RequestBody StudentEnrollmentRequest request) {
        log.info("POST /api/enrollments - Create enrollment for student: {}", request.getStudentId());
        StudentEnrollmentResponse response = enrollmentService.createEnrollment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Enrollment created successfully", response));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<StudentEnrollmentResponse>>> getEnrollmentsByStudent(
            @PathVariable Long studentId) {
        log.info("GET /api/enrollments/student/{} - Get enrollments by student", studentId);
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getEnrollmentsByStudent(studentId)));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<ApiResponse<List<StudentEnrollmentResponse>>> getEnrollmentsByClass(
            @PathVariable Long classId) {
        log.info("GET /api/enrollments/class/{} - Get enrollments by class", classId);
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getEnrollmentsByClass(classId)));
    }

    @GetMapping("/academic-year/{academicYearId}")
    public ResponseEntity<ApiResponse<List<StudentEnrollmentResponse>>> getEnrollmentsByAcademicYear(
            @PathVariable Long academicYearId) {
        log.info("GET /api/enrollments/academic-year/{} - Get enrollments by academic year", academicYearId);
        return ResponseEntity.ok(ApiResponse.success(enrollmentService.getEnrollmentsByAcademicYear(academicYearId)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<StudentEnrollmentResponse>> updateEnrollmentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        log.info("PUT /api/enrollments/{}/status - Update enrollment status to: {}", id, status);
        StudentEnrollmentResponse response = enrollmentService.updateEnrollmentStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Enrollment status updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEnrollment(
            @PathVariable Long id) {
        log.info("DELETE /api/enrollments/{} - Delete enrollment", id);
        enrollmentService.deleteEnrollment(id);
        return ResponseEntity.ok(ApiResponse.success("Enrollment deleted successfully", null));
    }
}