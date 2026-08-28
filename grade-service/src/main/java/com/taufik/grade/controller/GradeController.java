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
@RequestMapping("/api/v1/grade")
@RequiredArgsConstructor
@Slf4j
public class GradeController {

    private final GradeService gradeService;

    @PostMapping
    public ResponseEntity<ApiResponse<GradeResponse>> createGrade(
            @Valid @RequestBody GradeRequest request) {
        log.info("POST /api/v1/grade - Create grade for student: {}", request.getStudentId());
        GradeResponse response = gradeService.createGrade(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Grade created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getAllGrades() {
        log.info("GET /api/v1/grade - Get all grades");
        return ResponseEntity.ok(ApiResponse.success(gradeService.getAllGrades()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GradeResponse>> getGradeById(
            @PathVariable Long id) {
        log.info("GET /api/v1/grade/{} - Get grade by id", id);
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradeById(id)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getGradesByStudentId(
            @PathVariable Long studentId) {
        log.info("GET /api/v1/grade/student/{} - Get grades by student id", studentId);
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradesByStudentId(studentId)));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getGradesBySubjectId(
            @PathVariable Long subjectId) {
        log.info("GET /api/v1/grade/subject/{} - Get grades by subject id", subjectId);
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradesBySubjectId(subjectId)));
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getGradesByAssignmentId(
            @PathVariable Long assignmentId) {
        log.info("GET /api/v1/grade/assignment/{} - Get grades by assignment id", assignmentId);
        return ResponseEntity.ok(ApiResponse.success(gradeService.getGradesByAssignmentId(assignmentId)));
    }

    @GetMapping("/student/{studentId}/semester")
    public ResponseEntity<ApiResponse<List<GradeResponse>>> getGradesByStudentAndSemester(
            @PathVariable Long studentId,
            @RequestParam String semester,
            @RequestParam String academicYear) {
        log.info("GET /api/v1/grade/student/{}/semester - Get grades by student and semester", studentId);
        return ResponseEntity.ok(ApiResponse.success(
                gradeService.getGradesByStudentAndSemester(studentId, semester, academicYear)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GradeResponse>> updateGrade(
            @PathVariable Long id,
            @Valid @RequestBody GradeRequest request) {
        log.info("PUT /api/v1/grade/{} - Update grade", id);
        GradeResponse response = gradeService.updateGrade(id, request);
        return ResponseEntity.ok(ApiResponse.success("Grade updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGrade(
            @PathVariable Long id) {
        log.info("DELETE /api/v1/grade/{} - Delete grade", id);
        gradeService.deleteGrade(id);
        return ResponseEntity.ok(ApiResponse.success("Grade deleted successfully", null));
    }
}
