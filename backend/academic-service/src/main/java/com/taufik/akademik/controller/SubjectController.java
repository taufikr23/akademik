package com.taufik.akademik.controller;

import com.taufik.akademik.dto.request.SubjectRequest;
import com.taufik.akademik.dto.response.ApiResponse;
import com.taufik.akademik.dto.response.SubjectResponse;
import com.taufik.akademik.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@Slf4j
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectResponse>> createSubject(
            @Valid @RequestBody SubjectRequest request) {
        log.info("POST /api/subjects - Create subject: {}", request.getCode());
        SubjectResponse response = subjectService.createSubject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subject created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getAllSubjects() {
        log.info("GET /api/subjects - Get all subjects");
        List<SubjectResponse> responses = subjectService.getAllSubjects();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<SubjectResponse>>> getActiveSubjects() {
        log.info("GET /api/subjects/active - Get active subjects");
        List<SubjectResponse> responses = subjectService.getActiveSubjects();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectById(
            @PathVariable Long id) {
        log.info("GET /api/subjects/{} - Get subject by id", id);
        SubjectResponse response = subjectService.getSubjectById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<SubjectResponse>> getSubjectByCode(
            @PathVariable String code) {
        log.info("GET /api/subjects/code/{} - Get subject by code", code);
        SubjectResponse response = subjectService.getSubjectByCode(code);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectResponse>> updateSubject(
            @PathVariable Long id,
            @Valid @RequestBody SubjectRequest request) {
        log.info("PUT /api/subjects/{} - Update subject", id);
        SubjectResponse response = subjectService.updateSubject(id, request);
        return ResponseEntity.ok(ApiResponse.success("Subject updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSubject(
            @PathVariable Long id) {
        log.info("DELETE /api/subjects/{} - Delete subject", id);
        subjectService.deleteSubject(id);
        return ResponseEntity.ok(ApiResponse.success("Subject deleted successfully", null));
    }
}