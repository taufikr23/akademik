package com.taufik.akademik.controller;

import com.taufik.akademik.dto.request.TeacherSubjectRequest;
import com.taufik.akademik.dto.response.ApiResponse;
import com.taufik.akademik.dto.response.TeacherSubjectResponse;
import com.taufik.akademik.service.TeacherSubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teacher-subjects")
@RequiredArgsConstructor
@Slf4j
public class TeacherSubjectController {

    private final TeacherSubjectService teacherSubjectService;

    @PostMapping
    public ResponseEntity<ApiResponse<TeacherSubjectResponse>> assignTeacherToSubject(
            @Valid @RequestBody TeacherSubjectRequest request) {
        log.info("POST /api/v1/teacher-subjects - Assign teacher to subject");
        TeacherSubjectResponse response = teacherSubjectService.assignTeacherToSubject(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Teacher assigned to subject", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeacherSubjectResponse>>> getAllAssignments() {
        log.info("GET /api/v1/teacher-subjects - Get all assignments");
        return ResponseEntity.ok(ApiResponse.success(teacherSubjectService.getAllAssignments()));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<List<TeacherSubjectResponse>>> getAssignmentsByTeacher(
            @PathVariable Long teacherId) {
        log.info("GET /api/v1/teacher-subjects/teacher/{} - Get assignments by teacher", teacherId);
        return ResponseEntity.ok(ApiResponse.success(teacherSubjectService.getAssignmentsByTeacher(teacherId)));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<ApiResponse<List<TeacherSubjectResponse>>> getAssignmentsBySubject(
            @PathVariable Long subjectId) {
        log.info("GET /api/v1/teacher-subjects/subject/{} - Get assignments by subject", subjectId);
        return ResponseEntity.ok(ApiResponse.success(teacherSubjectService.getAssignmentsBySubject(subjectId)));
    }

    @GetMapping("/academic-year/{academicYearId}")
    public ResponseEntity<ApiResponse<List<TeacherSubjectResponse>>> getAssignmentsByAcademicYear(
            @PathVariable Long academicYearId) {
        log.info("GET /api/v1/teacher-subjects/academic-year/{} - Get assignments by academic year", academicYearId);
        return ResponseEntity.ok(ApiResponse.success(teacherSubjectService.getAssignmentsByAcademicYear(academicYearId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TeacherSubjectResponse>> getAssignmentById(
            @PathVariable Long id) {
        log.info("GET /api/v1/teacher-subjects/{} - Get assignment by id", id);
        return ResponseEntity.ok(ApiResponse.success(teacherSubjectService.getAssignmentById(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> removeAssignment(
            @PathVariable Long id) {
        log.info("DELETE /api/v1/teacher-subjects/{} - Remove assignment", id);
        teacherSubjectService.removeAssignment(id);
        return ResponseEntity.ok(ApiResponse.success("Assignment removed", null));
    }
}