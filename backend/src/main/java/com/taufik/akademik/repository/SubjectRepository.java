package com.taufik.akademik.repository;

import com.taufik.akademik.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findByCode(String code);
    List<Subject> findByIsActiveTrue();
    boolean existsByCode(String code);
}