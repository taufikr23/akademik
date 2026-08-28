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

import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@RequiredArgsConstructor
@Slf4j
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<ApiResponse<AttendanceResponse>> createAttendance(
            @Valid @RequestBody AttendanceRequest request) {
        log.info("POST /api/v1/attendance - Create attendance for student: {}", request.getStudentId());
        AttendanceResponse response = attendanceService.createAttendance(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Attendance created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAllAttendances() {
        log.info("GET /api/v1/attendance - Get all attendances");
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getAllAttendances()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> getAttendanceById(
            @PathVariable Long id) {
        log.info("GET /api/v1/attendance/{} - Get attendance by id", id);
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getAttendanceById(id)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAttendancesByStudentId(
            @PathVariable Long studentId) {
        log.info("GET /api/v1/attendance/student/{} - Get attendances by student id", studentId);
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getAttendancesByStudentId(studentId)));
    }

    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<ApiResponse<List<AttendanceResponse>>> getAttendancesByScheduleId(
            @PathVariable Long scheduleId) {
        log.info("GET /api/v1/attendance/schedule/{} - Get attendances by schedule id", scheduleId);
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getAttendancesByScheduleId(scheduleId)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AttendanceResponse>> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRequest request) {
        log.info("PUT /api/v1/attendance/{} - Update attendance", id);
        AttendanceResponse response = attendanceService.updateAttendance(id, request);
        return ResponseEntity.ok(ApiResponse.success("Attendance updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAttendance(
            @PathVariable Long id) {
        log.info("DELETE /api/v1/attendance/{} - Delete attendance", id);
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok(ApiResponse.success("Attendance deleted successfully", null));
    }
}
