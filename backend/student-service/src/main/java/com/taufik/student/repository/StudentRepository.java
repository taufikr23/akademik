package com.taufik.student.repository;

import com.taufik.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByNis(String nis);
    Optional<Student> findByNisn(String nisn);
    Optional<Student> findByUserId(Long userId);
    List<Student> findByIsActiveTrue();
    boolean existsByNis(String nis);
    boolean existsByNisn(String nisn);
}