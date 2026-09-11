package com.taufik.student.repository;

import com.taufik.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByNis(String nis);
    Optional<Student> findByNisn(String nisn);
    Optional<Student> findByUserId(Long userId);
    List<Student> findByIsActiveTrue();
    boolean existsByNis(String nis);
    boolean existsByNisn(String nisn);

    @Query("SELECT s FROM Student s WHERE LOWER(s.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.nis) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.nisn) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Student> searchByKeyword(@Param("keyword") String keyword);
}