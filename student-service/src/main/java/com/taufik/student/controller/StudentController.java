package com.taufik.student.controller;

import com.taufik.student.dto.request.StudentRequest;
import com.taufik.student.dto.response.ApiResponse;
import com.taufik.student.dto.response.StudentResponse;
import com.taufik.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Slf4j
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<ApiResponse<StudentResponse>> createStudent(
            @Valid @RequestBody StudentRequest request) {
        log.info("POST /api/v1/students - Create student: {}", request.getNis());
        StudentResponse response = studentService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getAllStudents() {
        log.info("GET /api/v1/students - Get all students");
        return ResponseEntity.ok(ApiResponse.success(studentService.getAllStudents()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<StudentResponse>>> getActiveStudents() {
        log.info("GET /api/v1/students/active - Get active students");
        return ResponseEntity.ok(ApiResponse.success(studentService.getActiveStudents()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentById(
            @PathVariable Long id) {
        log.info("GET /api/v1/students/{} - Get student by id", id);
        return ResponseEntity.ok(ApiResponse.success(studentService.getStudentById(id)));
    }

    @GetMapping("/nis/{nis}")
    public ResponseEntity<ApiResponse<StudentResponse>> getStudentByNis(
            @PathVariable String nis) {
        log.info("GET /api/v1/students/nis/{} - Get student by NIS", nis);
        return ResponseEntity.ok(ApiResponse.success(studentService.getStudentByNis(nis)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StudentResponse>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentRequest request) {
        log.info("PUT /api/v1/students/{} - Update student", id);
        StudentResponse response = studentService.updateStudent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(
            @PathVariable Long id) {
        log.info("DELETE /api/v1/students/{} - Delete student", id);
        studentService.deleteStudent(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }
}