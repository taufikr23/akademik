package com.taufik.akademik.repository;

import com.taufik.akademik.model.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {
    Optional<AcademicYear> findByYearName(String yearName);
    List<AcademicYear> findByIsActiveTrue();
    boolean existsByYearName(String yearName);
}