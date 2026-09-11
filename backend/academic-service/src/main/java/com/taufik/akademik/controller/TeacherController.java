package com.taufik.akademik.controller;

import com.taufik.akademik.dto.request.TeacherRequest;
import com.taufik.akademik.dto.response.ApiResponse;
import com.taufik.akademik.dto.response.TeacherResponse;
import com.taufik.akademik.service.TeacherServiceInterface;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
@Slf4j
public class TeacherController {

    private final TeacherServiceInterface teacherService;

    @PostMapping
    public ResponseEntity<ApiResponse<TeacherResponse>> createTeacher(
            @Valid @RequestBody TeacherRequest request) {
        TeacherResponse response = teacherService.createTeacher(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Teacher created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeacherResponse>>> getAllTeachers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false, defaultValue = "asc") String order) {
        log.info("GET /api/teachers - search={}, sort={}, order={}", search, sort, order);
        List<TeacherResponse> responses = teacherService.searchAndSortTeachers(search, sort, order);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<TeacherResponse>>> getActiveTeachers() {
        List<TeacherResponse> responses = teacherService.getActiveTeachers();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherResponse>> getTeacherById(@PathVariable Long id) {
        TeacherResponse response = teacherService.getTeacherById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/nip/{nip}")
    public ResponseEntity<ApiResponse<TeacherResponse>> getTeacherByNip(@PathVariable String nip) {
        TeacherResponse response = teacherService.getTeacherByNip(nip);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherResponse>> updateTeacher(
            @PathVariable Long id,
            @Valid @RequestBody TeacherRequest request) {
        TeacherResponse response = teacherService.updateTeacher(id, request);
        return ResponseEntity.ok(ApiResponse.success("Teacher updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok(ApiResponse.success("Teacher deleted successfully", null));
    }
}