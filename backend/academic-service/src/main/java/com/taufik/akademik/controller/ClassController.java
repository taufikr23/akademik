package com.taufik.akademik.controller;

import com.taufik.akademik.dto.request.ClassRequest;
import com.taufik.akademik.dto.response.ApiResponse;
import com.taufik.akademik.dto.response.ClassResponse;
import com.taufik.akademik.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
@Slf4j
public class ClassController {

    private final ClassService classService;

    @PostMapping
    public ResponseEntity<ApiResponse<ClassResponse>> createClass(
            @Valid @RequestBody ClassRequest request) {
        log.info("POST /api/classes - Create class: {}", request.getName());
        ClassResponse response = classService.createClass(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Class created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClassResponse>>> getAllClasses() {
        log.info("GET /api/classes - Get all classes");
        List<ClassResponse> responses = classService.getAllClasses();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<ClassResponse>>> getClassesByDepartment(
            @PathVariable Long departmentId) {
        log.info("GET /api/classes/department/{} - Get classes by department", departmentId);
        List<ClassResponse> responses = classService.getClassesByDepartment(departmentId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassResponse>> getClassById(
            @PathVariable Long id) {
        log.info("GET /api/classes/{} - Get class by id", id);
        ClassResponse response = classService.getClassById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClassResponse>> updateClass(
            @PathVariable Long id,
            @Valid @RequestBody ClassRequest request) {
        log.info("PUT /api/classes/{} - Update class", id);
        ClassResponse response = classService.updateClass(id, request);
        return ResponseEntity.ok(ApiResponse.success("Class updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteClass(
            @PathVariable Long id) {
        log.info("DELETE /api/classes/{} - Delete class", id);
        classService.deleteClass(id);
        return ResponseEntity.ok(ApiResponse.success("Class deleted successfully", null));
    }
}