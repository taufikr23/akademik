package com.taufik.grade.controller;

import com.taufik.grade.dto.request.GradeRequest;
import com.taufik.grade.dto.response.ApiResponse;
import com.taufik.grade.dto.response.GradeResponse;
import com.taufik.grade.service.GradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
@Slf4j
public class GradeController {

    private final GradeService gradeService;

    @PostMapping
    public ResponseEntity<ApiResponse<GradeResponse>> createGrade(
            @Valid @RequestBody GradeRequest request) {
        log.info("POST /api/grades - Create grade for student: {}", request.getStudentId());
        GradeResponse response = gradeService.createGrade(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Grade created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getAllGrades() {
        log.info("GET /api/grades - Get all grades");
        return ResponseEntity.ok(ApiResponse.success(gradeService.getAllGrades()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GradeResponse>> getGradeById(@PathVariable Long id) {
        log.info("GET /api/grades/{} - Get grade by id", id);
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradeById(id)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getGradesByStudentId(@PathVariable Long studentId) {
        log.info("GET /api/grades/student/{} - Get grades by student", studentId);
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradesByStudentId(studentId)));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getGradesByClassId(@PathVariable Long classId) {
        log.info("GET /api/grades/class/{} - Get grades by class", classId);
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradesByClassId(classId)));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getGradesBySubjectId(@PathVariable Long subjectId) {
        log.info("GET /api/grades/subject/{} - Get grades by subject", subjectId);
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradesBySubjectId(subjectId)));
    }

    @GetMapping("/semester/{semesterId}")
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getGradesBySemesterId(@PathVariable Long semesterId) {
        log.info("GET /api/grades/semester/{} - Get grades by semester", semesterId);
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradesBySemesterId(semesterId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GradeResponse>> updateGrade(
            @PathVariable Long id, @Valid @RequestBody GradeRequest request) {
        log.info("PUT /api/grades/{} - Update grade", id);
        GradeResponse response = gradeService.updateGrade(id, request);
        return ResponseEntity.ok(ApiResponse.success("Grade updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGrade(@PathVariable Long id) {
        log.info("DELETE /api/grades/{} - Delete grade", id);
        gradeService.deleteGrade(id);
        return ResponseEntity.ok(ApiResponse.success("Grade deleted successfully", null));
    }
}
