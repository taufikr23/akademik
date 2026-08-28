package com.taufik.schedule.service;

import com.taufik.schedule.dto.request.ScheduleRequest;
import com.taufik.schedule.dto.response.ScheduleResponse;
import com.taufik.schedule.exception.ResourceNotFoundException;
import com.taufik.schedule.model.Schedule;
import com.taufik.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    @Transactional
    public ScheduleResponse createSchedule(ScheduleRequest request) {
        log.info("Creating schedule for class: {}, day: {}", request.getClassId(), request.getDayOfWeek());

        // Cek jadwal bentrok
        if (scheduleRepository.existsByClassIdAndDayOfWeekAndStartTimeAndEndTime(
                request.getClassId(), request.getDayOfWeek(), 
                request.getStartTime(), request.getEndTime())) {
            throw new RuntimeException("Schedule conflict: Class already has schedule at this time");
        }

        Schedule schedule = new Schedule();
        schedule.setClassId(request.getClassId());
        schedule.setTeacherId(request.getTeacherId());
        schedule.setSubjectId(request.getSubjectId());
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setRoom(request.getRoom());

        Schedule saved = scheduleRepository.save(schedule);
        log.info("Schedule created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getAllSchedules() {
        log.info("Fetching all schedules");
        return scheduleRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getSchedulesByClass(Long classId) {
        log.info("Fetching schedules for class: {}", classId);
        return scheduleRepository.findByClassId(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getSchedulesByTeacher(Long teacherId) {
        log.info("Fetching schedules for teacher: {}", teacherId);
        return scheduleRepository.findByTeacherId(teacherId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getSchedulesByClassAndDay(Long classId, Integer dayOfWeek) {
        log.info("Fetching schedules for class: {}, day: {}", classId, dayOfWeek);
        return scheduleRepository.findByClassIdAndDayOfWeek(classId, dayOfWeek).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ScheduleResponse getScheduleById(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        return mapToResponse(schedule);
    }

    @Transactional
    public ScheduleResponse updateSchedule(Long id, ScheduleRequest request) {
        log.info("Updating schedule with id: {}", id);

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));

        schedule.setClassId(request.getClassId());
        schedule.setTeacherId(request.getTeacherId());
        schedule.setSubjectId(request.getSubjectId());
        schedule.setDayOfWeek(request.getDayOfWeek());
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setRoom(request.getRoom());

        Schedule updated = scheduleRepository.save(schedule);
        log.info("Schedule updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        schedule.setIsActive(false);
        scheduleRepository.save(schedule);
        log.info("Schedule deactivated successfully with id: {}", id);
    }

    private ScheduleResponse mapToResponse(Schedule schedule) {
        return ScheduleResponse.builder()
                .id(schedule.getId())
                .classId(schedule.getClassId())
                .teacherId(schedule.getTeacherId())
                .subjectId(schedule.getSubjectId())
                .dayOfWeek(schedule.getDayOfWeek())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .room(schedule.getRoom())
                .isActive(schedule.getIsActive())
                .createdAt(schedule.getCreatedAt())
                .updatedAt(schedule.getUpdatedAt())
                .build();
    }
}