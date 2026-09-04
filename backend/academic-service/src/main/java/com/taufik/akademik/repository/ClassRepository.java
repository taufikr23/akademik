package com.taufik.akademik.repository;

import com.taufik.akademik.model.Class;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassRepository extends JpaRepository<Class, Long> {
    List<Class> findByDepartmentId(Long departmentId);
    List<Class> findByAcademicYearId(Long academicYearId);
    List<Class> findByIsActiveTrue();
    boolean existsByNameAndDepartmentId(String name, Long departmentId);
}