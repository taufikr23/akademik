package com.taufik.akademik.repository;

import com.taufik.akademik.model.HomeroomTeacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HomeroomTeacherRepository extends JpaRepository<HomeroomTeacher, Long> {
    List<HomeroomTeacher> findByTeacherId(Long teacherId);
    List<HomeroomTeacher> findByClassEntityId(Long classId);
    List<HomeroomTeacher> findByAcademicYearId(Long academicYearId);
    Optional<HomeroomTeacher> findByClassEntityIdAndAcademicYearId(Long classId, Long academicYearId);
    boolean existsByClassEntityIdAndAcademicYearId(Long classId, Long academicYearId);
}