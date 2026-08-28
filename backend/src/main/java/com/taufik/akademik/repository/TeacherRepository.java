package com.taufik.akademik.repository;

import com.taufik.akademik.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByNip(String nip);
    Optional<Teacher> findByUserId(Long userId);
    List<Teacher> findByIsActiveTrue();
}