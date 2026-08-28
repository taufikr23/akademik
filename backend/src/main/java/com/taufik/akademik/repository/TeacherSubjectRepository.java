package com.taufik.akademik.repository;

import com.taufik.akademik.model.TeacherSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, Long> {
    List<TeacherSubject> findByTeacherId(Long teacherId);
    List<TeacherSubject> findBySubjectId(Long subjectId);
    List<TeacherSubject> findByAcademicYearId(Long academicYearId);
    List<TeacherSubject> findByTeacherIdAndAcademicYearId(Long teacherId, Long academicYearId);
    boolean existsByTeacherIdAndSubjectIdAndAcademicYearId(Long teacherId, Long subjectId, Long academicYearId);
}