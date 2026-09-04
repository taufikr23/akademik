package com.taufik.student.repository;

import com.taufik.student.model.StudentEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentEnrollmentRepository extends JpaRepository<StudentEnrollment, Long> {
    List<StudentEnrollment> findByStudentId(Long studentId);
    List<StudentEnrollment> findByClassId(Long classId);
    List<StudentEnrollment> findByAcademicYearId(Long academicYearId);
    List<StudentEnrollment> findByStudentIdAndStatus(Long studentId, String status);
    boolean existsByStudentIdAndClassIdAndAcademicYearId(Long studentId, Long classId, Long academicYearId);
}