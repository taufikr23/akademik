package com.taufik.schedule.service;

import com.taufik.schedule.dto.request.ScheduleRequest;
import com.taufik.schedule.dto.response.ScheduleResponse;
import com.taufik.schedule.exception.ResourceNotFoundException;
import com.taufik.schedule.model.Schedule;
import com.taufik.schedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final JdbcTemplate jdbcTemplate;

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
        List<Schedule> schedules = scheduleRepository.findAll();
        Map<Long, String> nameCache = buildNameCache(schedules);
        return schedules.stream()
                .map(s -> mapToResponse(s, nameCache))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getSchedulesByClass(Long classId) {
        log.info("Fetching schedules for class: {}", classId);
        List<Schedule> schedules = scheduleRepository.findByClassId(classId);
        Map<Long, String> nameCache = buildNameCache(schedules);
        return schedules.stream()
                .map(s -> mapToResponse(s, nameCache))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getSchedulesByTeacher(Long teacherId) {
        log.info("Fetching schedules for teacher: {}", teacherId);
        List<Schedule> schedules = scheduleRepository.findByTeacherId(teacherId);
        Map<Long, String> nameCache = buildNameCache(schedules);
        return schedules.stream()
                .map(s -> mapToResponse(s, nameCache))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduleResponse> getSchedulesByClassAndDay(Long classId, Integer dayOfWeek) {
        log.info("Fetching schedules for class: {}, day: {}", classId, dayOfWeek);
        List<Schedule> schedules = scheduleRepository.findByClassIdAndDayOfWeek(classId, dayOfWeek);
        Map<Long, String> nameCache = buildNameCache(schedules);
        return schedules.stream()
                .map(s -> mapToResponse(s, nameCache))
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

    // ========== NAME LOOKUP HELPERS ==========

    private Map<Long, String> buildNameCache(List<Schedule> schedules) {
        Map<Long, String> cache = new HashMap<>();
        var classIds = schedules.stream().map(Schedule::getClassId).distinct().collect(Collectors.toList());
        var teacherIds = schedules.stream().map(Schedule::getTeacherId).distinct().collect(Collectors.toList());
        var subjectIds = schedules.stream().map(Schedule::getSubjectId).distinct().collect(Collectors.toList());

        if (!classIds.isEmpty()) {
            String ph = classIds.stream().map(i -> "?").collect(Collectors.joining(","));
            try {
                jdbcTemplate.queryForList("SELECT id, name FROM classes WHERE id IN (" + ph + ")", classIds.toArray())
                    .forEach(row -> cache.put(-((Long)row.get("id")), (String)row.get("name")));
            } catch (Exception e) { log.warn("Could not fetch class names: {}", e.getMessage()); }
        }

        if (!teacherIds.isEmpty()) {
            String ph = teacherIds.stream().map(i -> "?").collect(Collectors.joining(","));
            try {
                jdbcTemplate.queryForList("SELECT id, full_name FROM teachers WHERE id IN (" + ph + ")", teacherIds.toArray())
                    .forEach(row -> cache.put(100000L + (Long)row.get("id"), (String)row.get("full_name")));
            } catch (Exception e) {
                log.warn("Could not fetch from teachers: {}", e.getMessage());
                try {
                    jdbcTemplate.queryForList("SELECT id, full_name FROM users WHERE id IN (" + ph + ")", teacherIds.toArray())
                        .forEach(row -> cache.put(100000L + (Long)row.get("id"), (String)row.get("full_name")));
                } catch (Exception e2) { log.warn("Could not fetch from users: {}", e2.getMessage()); }
            }
        }

        if (!subjectIds.isEmpty()) {
            String ph = subjectIds.stream().map(i -> "?").collect(Collectors.joining(","));
            try {
                jdbcTemplate.queryForList("SELECT id, name FROM subjects WHERE id IN (" + ph + ")", subjectIds.toArray())
                    .forEach(row -> cache.put(200000L + (Long)row.get("id"), (String)row.get("name")));
            } catch (Exception e) { log.warn("Could not fetch subject names: {}", e.getMessage()); }
        }

        return cache;
    }

    private ScheduleResponse mapToResponse(Schedule schedule) {
        return mapToResponse(schedule, buildNameCache(List.of(schedule)));
    }

    private ScheduleResponse mapToResponse(Schedule schedule, Map<Long, String> cache) {
        String className = cache.getOrDefault(-schedule.getClassId(), lookupName("classes", schedule.getClassId()));
        String teacherName = cache.getOrDefault(100000L + schedule.getTeacherId(), lookupTeacherName(schedule.getTeacherId()));
        String subjectName = cache.getOrDefault(200000L + schedule.getSubjectId(), lookupName("subjects", schedule.getSubjectId()));

        return ScheduleResponse.builder()
                .id(schedule.getId())
                .classId(schedule.getClassId())
                .className(className)
                .teacherId(schedule.getTeacherId())
                .teacherName(teacherName)
                .subjectId(schedule.getSubjectId())
                .subjectName(subjectName)
                .dayOfWeek(schedule.getDayOfWeek())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .room(schedule.getRoom())
                .isActive(schedule.getIsActive())
                .createdAt(schedule.getCreatedAt())
                .updatedAt(schedule.getUpdatedAt())
                .build();
    }

    private String lookupName(String table, Long id) {
        try { return jdbcTemplate.queryForObject("SELECT name FROM " + table + " WHERE id = ?", String.class, id); }
        catch (Exception e) { return null; }
    }

    private String lookupTeacherName(Long teacherId) {
        try { return jdbcTemplate.queryForObject("SELECT full_name FROM teachers WHERE id = ?", String.class, teacherId); }
        catch (Exception e) {
            try { return jdbcTemplate.queryForObject("SELECT full_name FROM users WHERE id = ?", String.class, teacherId); }
            catch (Exception e2) { return null; }
        }
    }
}