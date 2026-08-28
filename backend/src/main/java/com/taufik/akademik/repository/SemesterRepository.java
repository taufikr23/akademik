package com.taufik.akademik.repository;

import com.taufik.akademik.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SemesterRepository extends JpaRepository<Semester, Long> {
    List<Semester> findByAcademicYearId(Long academicYearId);
    List<Semester> findByIsActiveTrue();
    boolean existsByAcademicYearIdAndSemesterType(Long academicYearId, String semesterType);
}