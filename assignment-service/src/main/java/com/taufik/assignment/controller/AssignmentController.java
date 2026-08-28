package com.taufik.assignment.controller;

import com.taufik.assignment.dto.request.AssignmentRequest;
import com.taufik.assignment.dto.response.ApiResponse;
import com.taufik.assignment.dto.response.AssignmentResponse;
import com.taufik.assignment.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assignment")
@RequiredArgsConstructor
@Slf4j
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AssignmentResponse>> createAssignment(
            @Valid @RequestBody AssignmentRequest request) {
        log.info("POST /api/v1/assignment - Create assignment: {}", request.getTitle());
        AssignmentResponse response = assignmentService.createAssignment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAllAssignments() {
        log.info("GET /api/v1/assignment - Get all assignments");
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAllAssignments()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssignmentResponse>> getAssignmentById(
            @PathVariable Long id) {
        log.info("GET /api/v1/assignment/{} - Get assignment by id", id);
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentById(id)));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignmentsBySubjectId(
            @PathVariable Long subjectId) {
        log.info("GET /api/v1/assignment/subject/{} - Get assignments by subject id", subjectId);
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsBySubjectId(subjectId)));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignmentsByTeacherId(
            @PathVariable Long teacherId) {
        log.info("GET /api/v1/assignment/teacher/{} - Get assignments by teacher id", teacherId);
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByTeacherId(teacherId)));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignmentsByClassId(
            @PathVariable Long classId) {
        log.info("GET /api/v1/assignment/class/{} - Get assignments by class id", classId);
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByClassId(classId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssignmentResponse>> updateAssignment(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentRequest request) {
        log.info("PUT /api/v1/assignment/{} - Update assignment", id);
        AssignmentResponse response = assignmentService.updateAssignment(id, request);
        return ResponseEntity.ok(ApiResponse.success("Assignment updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(
            @PathVariable Long id) {
        log.info("DELETE /api/v1/assignment/{} - Delete assignment", id);
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok(ApiResponse.success("Assignment deleted successfully", null));
    }
}
