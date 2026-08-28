package com.taufik.grade.repository;

import com.taufik.grade.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findBySubjectId(Long subjectId);
    List<Grade> findByAssignmentId(Long assignmentId);
    List<Grade> findByStudentIdAndSemesterAndAcademicYear(Long studentId, String semester, String academicYear);
    List<Grade> findBySubjectIdAndSemesterAndAcademicYear(Long subjectId, String semester, String academicYear);
}
