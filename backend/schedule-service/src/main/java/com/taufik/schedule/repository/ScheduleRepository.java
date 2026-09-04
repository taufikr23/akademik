package com.taufik.schedule.repository;

import com.taufik.schedule.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByClassId(Long classId);
    List<Schedule> findByTeacherId(Long teacherId);
    List<Schedule> findBySubjectId(Long subjectId);
    List<Schedule> findByClassIdAndDayOfWeek(Long classId, Integer dayOfWeek);
    List<Schedule> findByTeacherIdAndDayOfWeek(Long teacherId, Integer dayOfWeek);
    List<Schedule> findByIsActiveTrue();
    boolean existsByClassIdAndDayOfWeekAndStartTimeAndEndTime(
        Long classId, Integer dayOfWeek, LocalTime startTime, LocalTime endTime);
}