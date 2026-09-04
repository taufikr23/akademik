package com.taufik.schedule.controller;

import com.taufik.schedule.dto.request.ScheduleRequest;
import com.taufik.schedule.dto.response.ApiResponse;
import com.taufik.schedule.dto.response.ScheduleResponse;
import com.taufik.schedule.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
@Slf4j
public class ScheduleController {

    private final ScheduleService scheduleService;

    @PostMapping
    public ResponseEntity<ApiResponse<ScheduleResponse>> createSchedule(
            @Valid @RequestBody ScheduleRequest request) {
        log.info("POST /api/schedules - Create schedule");
        ScheduleResponse response = scheduleService.createSchedule(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Schedule created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getAllSchedules() {
        log.info("GET /api/schedules - Get all schedules");
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getAllSchedules()));
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByClass(
            @PathVariable Long classId) {
        log.info("GET /api/schedules/class/{} - Get schedules by class", classId);
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getSchedulesByClass(classId)));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByTeacher(
            @PathVariable Long teacherId) {
        log.info("GET /api/schedules/teacher/{} - Get schedules by teacher", teacherId);
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getSchedulesByTeacher(teacherId)));
    }

    @GetMapping("/class/{classId}/day/{dayOfWeek}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByClassAndDay(
            @PathVariable Long classId,
            @PathVariable Integer dayOfWeek) {
        log.info("GET /api/schedules/class/{}/day/{} - Get schedules", classId, dayOfWeek);
        return ResponseEntity.ok(ApiResponse.success(
                scheduleService.getSchedulesByClassAndDay(classId, dayOfWeek)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> getScheduleById(
            @PathVariable Long id) {
        log.info("GET /api/schedules/{} - Get schedule by id", id);
        return ResponseEntity.ok(ApiResponse.success(scheduleService.getScheduleById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleRequest request) {
        log.info("PUT /api/schedules/{} - Update schedule", id);
        ScheduleResponse response = scheduleService.updateSchedule(id, request);
        return ResponseEntity.ok(ApiResponse.success("Schedule updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(
            @PathVariable Long id) {
        log.info("DELETE /api/schedules/{} - Delete schedule", id);
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("Schedule deleted successfully", null));
    }
}