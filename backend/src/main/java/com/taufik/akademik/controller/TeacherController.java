package com.taufik.akademik.controller;

import com.taufik.akademik.dto.request.TeacherRequest;
import com.taufik.akademik.dto.response.ApiResponse;
import com.taufik.akademik.dto.response.TeacherResponse;
import com.taufik.akademik.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
@Slf4j
public class TeacherController {

    private final TeacherService teacherService;

    @PostMapping
    public ResponseEntity<ApiResponse<TeacherResponse>> createTeacher(
            @Valid @RequestBody TeacherRequest request) {
        log.info("POST /api/v1/teachers - Create teacher: {}", request.getNip());
        TeacherResponse response = teacherService.createTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Teacher created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeacherResponse>>> getAllTeachers() {
        log.info("GET /api/v1/teachers - Get all teachers");
        List<TeacherResponse> responses = teacherService.getAllTeachers();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<TeacherResponse>>> getActiveTeachers() {
        log.info("GET /api/v1/teachers/active - Get active teachers");
        List<TeacherResponse> responses = teacherService.getActiveTeachers();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherResponse>> getTeacherById(
            @PathVariable Long id) {
        log.info("GET /api/v1/teachers/{} - Get teacher by id", id);
        TeacherResponse response = teacherService.getTeacherById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/nip/{nip}")
    public ResponseEntity<ApiResponse<TeacherResponse>> getTeacherByNip(
            @PathVariable String nip) {
        log.info("GET /api/v1/teachers/nip/{} - Get teacher by NIP", nip);
        TeacherResponse response = teacherService.getTeacherByNip(nip);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherResponse>> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody TeacherRequest request) {
        log.info("PUT /api/v1/teachers/{} - Update teacher", id);
        TeacherResponse response = teacherService.updateTeacher(id, request);
        return ResponseEntity.ok(ApiResponse.success("Teacher updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeacher(
            @PathVariable Long id) {
        log.info("DELETE /api/v1/teachers/{} - Delete teacher", id);
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok(ApiResponse.success("Teacher deleted successfully", null));
    }
}