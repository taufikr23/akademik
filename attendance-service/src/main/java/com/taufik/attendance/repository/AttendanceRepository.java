package com.taufik.attendance.repository;

import com.taufik.attendance.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByScheduleId(Long scheduleId);
    List<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);
    Optional<Attendance> findByStudentIdAndScheduleIdAndDate(Long studentId, Long scheduleId, LocalDate date);
    boolean existsByStudentIdAndScheduleIdAndDate(Long studentId, Long scheduleId, LocalDate date);
}
