package com.taufik.attendance.repository;

import com.taufik.attendance.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByStudentId(Long studentId);

    List<Attendance> findByClassIdAndDate(Long classId, LocalDate date);

    List<Attendance> findByClassIdAndTeacherSubjectIdAndDate(Long classId, Long teacherSubjectId, LocalDate date);

    List<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);

    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate startDate, LocalDate endDate);

    Optional<Attendance> findByStudentIdAndTeacherSubjectIdAndDate(Long studentId, Long teacherSubjectId, LocalDate date);

    boolean existsByStudentIdAndTeacherSubjectIdAndDate(Long studentId, Long teacherSubjectId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.classId = :classId AND a.date BETWEEN :startDate AND :endDate")
    List<Attendance> findByClassIdAndDateRange(@Param("classId") Long classId,
                                                @Param("startDate") LocalDate startDate,
                                                @Param("endDate") LocalDate endDate);

    @Query("SELECT a.status, COUNT(a) FROM Attendance a WHERE a.classId = :classId AND a.date = :date GROUP BY a.status")
    List<Object[]> countByClassIdAndDateGroupByStatus(@Param("classId") Long classId,
                                                       @Param("date") LocalDate date);
}
