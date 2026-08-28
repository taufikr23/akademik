package com.taufik.grade.service;

import com.taufik.grade.dto.request.GradeRequest;
import com.taufik.grade.dto.response.GradeResponse;
import com.taufik.grade.exception.ResourceNotFoundException;
import com.taufik.grade.model.Grade;
import com.taufik.grade.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GradeService {

    private final GradeRepository gradeRepository;

    @Transactional
    public GradeResponse createGrade(GradeRequest request) {
        log.info("Creating grade for student: {} subject: {}", request.getStudentId(), request.getSubjectId());

        Grade grade = new Grade();
        grade.setStudentId(request.getStudentId());
        grade.setAssignmentId(request.getAssignmentId());
        grade.setSubjectId(request.getSubjectId());
        grade.setScore(request.getScore());
        grade.setGrade(request.getGrade());
        grade.setComments(request.getComments());
        grade.setSemester(request.getSemester());
        grade.setAcademicYear(request.getAcademicYear());
        grade.setGradeType(request.getGradeType());

        Grade saved = gradeRepository.save(grade);
        log.info("Grade created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getAllGrades() {
        return gradeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GradeResponse getGradeById(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));
        return mapToResponse(grade);
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getGradesByStudentId(Long studentId) {
        return gradeRepository.findByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getGradesBySubjectId(Long subjectId) {
        return gradeRepository.findBySubjectId(subjectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getGradesByAssignmentId(Long assignmentId) {
        return gradeRepository.findByAssignmentId(assignmentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getGradesByStudentAndSemester(Long studentId, String semester, String academicYear) {
        return gradeRepository.findByStudentIdAndSemesterAndAcademicYear(studentId, semester, academicYear).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public GradeResponse updateGrade(Long id, GradeRequest request) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));

        grade.setStudentId(request.getStudentId());
        grade.setAssignmentId(request.getAssignmentId());
        grade.setSubjectId(request.getSubjectId());
        grade.setScore(request.getScore());
        grade.setGrade(request.getGrade());
        grade.setComments(request.getComments());
        grade.setSemester(request.getSemester());
        grade.setAcademicYear(request.getAcademicYear());
        grade.setGradeType(request.getGradeType());

        Grade updated = gradeRepository.save(grade);
        log.info("Grade updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteGrade(Long id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));
        grade.setIsActive(false);
        gradeRepository.save(grade);
        log.info("Grade deactivated successfully with id: {}", id);
    }

    private GradeResponse mapToResponse(Grade grade) {
        return GradeResponse.builder()
                .id(grade.getId())
                .studentId(grade.getStudentId())
                .assignmentId(grade.getAssignmentId())
                .subjectId(grade.getSubjectId())
                .score(grade.getScore())
                .grade(grade.getGrade())
                .comments(grade.getComments())
                .semester(grade.getSemester())
                .academicYear(grade.getAcademicYear())
                .gradeType(grade.getGradeType())
                .isActive(grade.getIsActive())
                .createdAt(grade.getCreatedAt())
                .updatedAt(grade.getUpdatedAt())
                .build();
    }
}
