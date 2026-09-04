package com.taufik.akademik.controller;

import com.taufik.akademik.dto.request.HomeroomTeacherRequest;
import com.taufik.akademik.dto.response.ApiResponse;
import com.taufik.akademik.dto.response.HomeroomTeacherResponse;
import com.taufik.akademik.service.HomeroomTeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homeroom-teachers")
@RequiredArgsConstructor
@Slf4j
public class HomeroomTeacherController {

    private final HomeroomTeacherService homeroomTeacherService;

    @PostMapping
    public ResponseEntity<ApiResponse<HomeroomTeacherResponse>> assignHomeroomTeacher(
            @Valid @RequestBody HomeroomTeacherRequest request) {
        log.info("POST /api/homeroom-teachers - Assign homeroom teacher");
        HomeroomTeacherResponse response = homeroomTeacherService.assignHomeroomTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Homeroom teacher assigned", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HomeroomTeacherResponse>>> getAllHomeroomTeachers() {
        log.info("GET /api/homeroom-teachers - Get all homeroom teachers");
        return ResponseEntity.ok(ApiResponse.success(homeroomTeacherService.getAllHomeroomTeachers()));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<List<HomeroomTeacherResponse>>> getHomeroomTeachersByTeacher(
            @PathVariable Long teacherId) {
        log.info("GET /api/homeroom-teachers/teacher/{} - Get homeroom teachers by teacher", teacherId);
        return ResponseEntity.ok(ApiResponse.success(homeroomTeacherService.getHomeroomTeachersByTeacher(teacherId)));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<ApiResponse<List<HomeroomTeacherResponse>>> getHomeroomTeachersByClass(
            @PathVariable Long classId) {
        log.info("GET /api/homeroom-teachers/class/{} - Get homeroom teachers by class", classId);
        return ResponseEntity.ok(ApiResponse.success(homeroomTeacherService.getHomeroomTeachersByClass(classId)));
    }

    @GetMapping("/academic-year/{academicYearId}")
    public ResponseEntity<ApiResponse<List<HomeroomTeacherResponse>>> getHomeroomTeachersByAcademicYear(
            @PathVariable Long academicYearId) {
        log.info("GET /api/homeroom-teachers/academic-year/{} - Get homeroom teachers by academic year", academicYearId);
        return ResponseEntity.ok(ApiResponse.success(homeroomTeacherService.getHomeroomTeachersByAcademicYear(academicYearId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeroomTeacherResponse>> getHomeroomTeacherById(
            @PathVariable Long id) {
        log.info("GET /api/homeroom-teachers/{} - Get homeroom teacher by id", id);
        return ResponseEntity.ok(ApiResponse.success(homeroomTeacherService.getHomeroomTeacherById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HomeroomTeacherResponse>> updateHomeroomTeacher(
            @PathVariable Long id,
            @Valid @RequestBody HomeroomTeacherRequest request) {
        log.info("PUT /api/homeroom-teachers/{} - Update homeroom teacher", id);
        HomeroomTeacherResponse response = homeroomTeacherService.updateHomeroomTeacher(id, request);
        return ResponseEntity.ok(ApiResponse.success("Homeroom teacher updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeHomeroomTeacher(
            @PathVariable Long id) {
        log.info("DELETE /api/homeroom-teachers/{} - Remove homeroom teacher", id);
        homeroomTeacherService.removeHomeroomTeacher(id);
        return ResponseEntity.ok(ApiResponse.success("Homeroom teacher removed", null));
    }
}