package com.taufik.akademik.controller;

import com.taufik.akademik.dto.request.SemesterRequest;
import com.taufik.akademik.dto.response.ApiResponse;
import com.taufik.akademik.dto.response.SemesterResponse;
import com.taufik.akademik.service.SemesterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/semesters")
@RequiredArgsConstructor
@Slf4j
public class SemesterController {

    private final SemesterService semesterService;

    @PostMapping
    public ResponseEntity<ApiResponse<SemesterResponse>> createSemester(
            @Valid @RequestBody SemesterRequest request) {
        log.info("POST /api/v1/semesters - Create semester: {}", request.getSemesterType());
        SemesterResponse response = semesterService.createSemester(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Semester created", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SemesterResponse>>> getAllSemesters() {
        log.info("GET /api/v1/semesters - Get all semesters");
        return ResponseEntity.ok(ApiResponse.success(semesterService.getAllSemesters()));
    }

    @GetMapping("/academic-year/{academicYearId}")
    public ResponseEntity<ApiResponse<List<SemesterResponse>>> getSemestersByAcademicYear(
            @PathVariable Long academicYearId) {
        log.info("GET /api/v1/semesters/academic-year/{} - Get semesters by academic year", academicYearId);
        return ResponseEntity.ok(ApiResponse.success(semesterService.getSemestersByAcademicYear(academicYearId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SemesterResponse>> getSemesterById(
            @PathVariable Long id) {
        log.info("GET /api/v1/semesters/{} - Get semester by id", id);
        return ResponseEntity.ok(ApiResponse.success(semesterService.getSemesterById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SemesterResponse>> updateSemester(
            @PathVariable Long id,
            @Valid @RequestBody SemesterRequest request) {
        log.info("PUT /api/v1/semesters/{} - Update semester", id);
        SemesterResponse response = semesterService.updateSemester(id, request);
        return ResponseEntity.ok(ApiResponse.success("Semester updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSemester(
            @PathVariable Long id) {
        log.info("DELETE /api/v1/semesters/{} - Delete semester", id);
        semesterService.deleteSemester(id);
        return ResponseEntity.ok(ApiResponse.success("Semester deleted", null));
    }
}