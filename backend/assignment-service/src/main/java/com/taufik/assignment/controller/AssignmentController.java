package com.taufik.assignment.controller;

import com.taufik.assignment.dto.request.AssignmentRequest;
import com.taufik.assignment.dto.response.ApiResponse;
import com.taufik.assignment.dto.response.AssignmentResponse;
import com.taufik.assignment.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/assignment")
@RequiredArgsConstructor
@Slf4j
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<AssignmentResponse>> createAssignment(
            @Valid @RequestBody AssignmentRequest request) {
        log.info("POST /api/assignment - Create assignment: {}", request.getTitle());
        AssignmentResponse response = assignmentService.createAssignment(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAllAssignments() {
        log.info("GET /api/assignment - Get all assignments");
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAllAssignments()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssignmentResponse>> getAssignmentById(
            @PathVariable Long id) {
        log.info("GET /api/assignment/{} - Get assignment by id", id);
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentById(id)));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignmentsBySubjectId(
            @PathVariable Long subjectId) {
        log.info("GET /api/assignment/subject/{} - Get assignments by subject id", subjectId);
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsBySubjectId(subjectId)));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignmentsByTeacherId(
            @PathVariable Long teacherId) {
        log.info("GET /api/assignment/teacher/{} - Get assignments by teacher id", teacherId);
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByTeacherId(teacherId)));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignmentsByClassId(
            @PathVariable Long classId) {
        log.info("GET /api/assignment/class/{} - Get assignments by class id", classId);
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByClassId(classId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AssignmentResponse>> updateAssignment(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentRequest request) {
        log.info("PUT /api/assignment/{} - Update assignment", id);
        AssignmentResponse response = assignmentService.updateAssignment(id, request);
        return ResponseEntity.ok(ApiResponse.success("Assignment updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(
            @PathVariable Long id) {
        log.info("DELETE /api/assignment/{} - Delete assignment", id);
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok(ApiResponse.success("Assignment deleted successfully", null));
    }


    // TEACHER: Get their classes by username (NIP)
    @GetMapping("/teacher/by-username/{username}/classes")
    public ResponseEntity<ApiResponse<java.util.List<java.util.Map<String, Object>>>> getTeacherClassesByUsername(
            @PathVariable String username) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getTeacherClassesByUsername(username)));
    }

    // TEACHER: Get assignments by username
    @GetMapping("/teacher/by-username/{username}")
    public ResponseEntity<ApiResponse<List<AssignmentResponse>>> getAssignmentsByUsername(
            @PathVariable String username) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByUsername(username)));
    }

    // TEACHER: Get their classes by user_id
    @GetMapping("/teacher/{teacherId}/classes")
    public ResponseEntity<ApiResponse<java.util.List<java.util.Map<String, Object>>>> getTeacherClasses(
            @PathVariable Long teacherId) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getTeacherClasses(teacherId)));
    }

    // STUDENT: Get assignments for their class by username (NIS)
    @GetMapping("/student/by-username/{username}")
    public ResponseEntity<ApiResponse<java.util.List<AssignmentResponse>>> getStudentAssignmentsByUsername(
            @PathVariable String username) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getStudentAssignmentsByUsername(username)));
    }

    // STUDENT: Get assignments for their class
    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<java.util.List<AssignmentResponse>>> getStudentAssignments(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getAssignmentsByStudentClass(studentId)));
    }

    // STUDENT: Submit assignment with file
    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<com.taufik.assignment.dto.response.SubmissionResponse>> submitAssignment(
            @PathVariable Long id,
            @RequestParam Long studentId,
            @RequestParam(required = false) String notes,
            @RequestParam(required = false) MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Tugas berhasil dikumpulkan",
                assignmentService.submitAssignment(id, studentId, notes, file)));
    }

    // TEACHER: Get submissions for an assignment
    @GetMapping("/{id}/submissions")
    public ResponseEntity<ApiResponse<java.util.List<com.taufik.assignment.dto.response.SubmissionResponse>>> getSubmissions(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(assignmentService.getSubmissions(id)));
    }

    // TEACHER: Grade a submission
    @PutMapping("/submissions/{id}/grade")
    public ResponseEntity<ApiResponse<com.taufik.assignment.dto.response.SubmissionResponse>> gradeSubmission(
            @PathVariable Long id,
            @RequestParam Double score,
            @RequestParam(required = false) String feedback) {
        return ResponseEntity.ok(ApiResponse.success("Penilaian berhasil",
            assignmentService.gradeSubmission(id, score, feedback)));
    }

    // FILE: Upload material file
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadFile(@RequestParam MultipartFile file) {
        String fileName = assignmentService.uploadFile(file);
        return ResponseEntity.ok(ApiResponse.success("File uploaded", fileName));
    }

    // FILE: Download/view file
    @GetMapping("/files/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            java.io.File file = assignmentService.getFile(fileName);
            Resource resource = new UrlResource(file.toURI());
            String encodedName = URLEncoder.encode(file.getName(), StandardCharsets.UTF_8).replace("+", "%20");
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename*=UTF-8''" + encodedName)
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
