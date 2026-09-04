package com.taufik.attendance.controller;

import com.taufik.attendance.dto.request.AttendanceRequest;
import com.taufik.attendance.dto.response.ApiResponse;
import com.taufik.attendance.dto.response.AttendanceResponse;
import com.taufik.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@Slf4j
public class AttendanceController {

    private final AttendanceService attendanceService;

    // ==========================================
    // GURU: Get classes they teach
    // ==========================================
    @GetMapping("/teacher/{teacherId}/classes")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTeacherClasses(
            @PathVariable Long teacherId) {
        log.info("GET /api/attendance/teacher/{}/classes", teacherId);
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getTeacherClasses(teacherId)));
    }

    // ==========================================
    // GURU: Get students in a class
    // ==========================================
    @GetMapping("/class/{classId}/students")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getClassStudents(
            @PathVariable Long classId) {
        log.info("GET /api/attendance/class/{}/students", classId);
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getClassStudents(classId)));
    }

    // ==========================================
    // GURU: Get existing attendance for class on date
    // ==========================================
    @GetMapping("/class/{classId}/teacher-subject/{teacherSubjectId}/date/{date}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getAttendanceByClassAndDate(
            @PathVariable Long classId,
            @PathVariable Long teacherSubjectId,
            @PathVariable String date) {
        log.info("GET /api/attendance/class/{}/teacher-subject/{}/date/{}", classId, teacherSubjectId, date);
        LocalDate localDate = LocalDate.parse(date);
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.getAttendanceByClassAndDate(classId, teacherSubjectId, localDate)));
    }

    // ==========================================
    // GURU: Batch submit attendance
    // ==========================================
    @PostMapping("/batch")
    public ResponseEntity<ApiResponse<AttendanceResponse>> batchSubmitAttendance(
            @Valid @RequestBody AttendanceRequest request) {
        log.info("POST /api/attendance/batch - class={}, date={}, students={}",
                request.getClassId(), request.getDate(), request.getAttendances().size());
        AttendanceResponse response = attendanceService.batchSubmitAttendance(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Absen berhasil disimpan", response));
    }

    // ==========================================
    // GURU: Get attendance history for a class
    // ==========================================
    @GetMapping("/class/{classId}/teacher-subject/{teacherSubjectId}/history")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAttendanceHistory(
            @PathVariable Long classId,
            @PathVariable Long teacherSubjectId) {
        log.info("GET /api/attendance/class/{}/teacher-subject/{}/history", classId, teacherSubjectId);
        return ResponseEntity.ok(ApiResponse.success(
                attendanceService.getAttendanceHistory(classId, teacherSubjectId)));
    }


    // ==========================================
    // SISWA: Get attendance summary per subject
    // ==========================================
    @GetMapping("/student/{studentId}/summary")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStudentAttendanceSummary(
            @PathVariable Long studentId) {
        log.info("GET /api/attendance/student/{}/summary", studentId);
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentAttendanceSummary(studentId)));
    }

    // ==========================================
    // SISWA: Get attendance history for a subject
    // ==========================================
    @GetMapping("/student/{studentId}/subject/{teacherSubjectId}")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getStudentSubjectAttendance(
            @PathVariable Long studentId,
            @PathVariable Long teacherSubjectId) {
        log.info("GET /api/attendance/student/{}/subject/{}", studentId, teacherSubjectId);
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getStudentSubjectAttendance(studentId, teacherSubjectId)));
    }

    // ==========================================
    // EXISTING ENDPOINTS
    // ==========================================
    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAllAttendances() {
        log.info("GET /api/attendance");
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getAllAttendances()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getAttendanceById(@PathVariable Long id) {
        log.info("GET /api/attendance/{}", id);
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getAttendanceById(id)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getByStudentId(@PathVariable Long studentId) {
        log.info("GET /api/attendance/student/{}", studentId);
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getAttendancesByStudentId(studentId)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAttendance(@PathVariable Long id) {
        log.info("DELETE /api/attendance/{}", id);
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok(ApiResponse.success("Attendance deleted", null));
    }
}
