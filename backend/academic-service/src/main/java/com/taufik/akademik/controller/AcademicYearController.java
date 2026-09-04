package com.taufik.akademik.controller;

import com.taufik.akademik.dto.request.AcademicYearRequest;
import com.taufik.akademik.dto.response.ApiResponse;
import com.taufik.akademik.dto.response.AcademicYearResponse;
import com.taufik.akademik.service.AcademicYearService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic-years")
@RequiredArgsConstructor
@Slf4j
public class AcademicYearController {

    private final AcademicYearService academicYearService;

    @PostMapping
    public ResponseEntity<ApiResponse<AcademicYearResponse>> createAcademicYear(
            @Valid @RequestBody AcademicYearRequest request) {
        log.info("POST /api/academic-years - Create academic year: {}", request.getYearName());
        AcademicYearResponse response = academicYearService.createAcademicYear(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Academic year created", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AcademicYearResponse>>> getAllAcademicYears() {
        log.info("GET /api/academic-years - Get all academic years");
        return ResponseEntity.ok(ApiResponse.success(academicYearService.getAllAcademicYears()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<AcademicYearResponse>>> getActiveAcademicYears() {
        log.info("GET /api/academic-years/active - Get active academic years");
        return ResponseEntity.ok(ApiResponse.success(academicYearService.getActiveAcademicYears()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicYearResponse>> getAcademicYearById(
            @PathVariable Long id) {
        log.info("GET /api/academic-years/{} - Get academic year by id", id);
        return ResponseEntity.ok(ApiResponse.success(academicYearService.getAcademicYearById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AcademicYearResponse>> updateAcademicYear(
            @PathVariable Long id,
            @Valid @RequestBody AcademicYearRequest request) {
        log.info("PUT /api/academic-years/{} - Update academic year", id);
        AcademicYearResponse response = academicYearService.updateAcademicYear(id, request);
        return ResponseEntity.ok(ApiResponse.success("Academic year updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAcademicYear(
            @PathVariable Long id) {
        log.info("DELETE /api/academic-years/{} - Delete academic year", id);
        academicYearService.deleteAcademicYear(id);
        return ResponseEntity.ok(ApiResponse.success("Academic year deleted", null));
    }
}