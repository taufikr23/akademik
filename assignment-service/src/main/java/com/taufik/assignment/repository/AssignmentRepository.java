package com.taufik.assignment.repository;

import com.taufik.assignment.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findBySubjectId(Long subjectId);
    List<Assignment> findByTeacherId(Long teacherId);
    List<Assignment> findByClassId(Long classId);
    List<Assignment> findBySubjectIdAndClassId(Long subjectId, Long classId);
}
