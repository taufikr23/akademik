package com.taufik.grade.repository;

import com.taufik.grade.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findBySubjectId(Long subjectId);
    List<Grade> findByClassId(Long classId);
    List<Grade> findBySemesterId(Long semesterId);
    List<Grade> findByStudentIdAndSemesterId(Long studentId, Long semesterId);
}
