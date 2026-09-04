package com.taufik.grade.service;

import com.taufik.grade.dto.request.GradeRequest;
import com.taufik.grade.dto.response.GradeResponse;
import com.taufik.grade.exception.ResourceNotFoundException;
import com.taufik.grade.model.Grade;
import com.taufik.grade.repository.GradeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GradeService {

    private final GradeRepository gradeRepository;
    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public GradeResponse createGrade(GradeRequest request) {
        log.info("Creating grade for student: {} subject: {}", request.getStudentId(), request.getSubjectId());

        Grade grade = new Grade();
        grade.setStudentId(request.getStudentId());
        grade.setClassId(request.getClassId());
        grade.setSubjectId(request.getSubjectId());
        grade.setSemesterId(request.getSemesterId());
        grade.setTugasScore(request.getTugasScore());
        grade.setUtsScore(request.getUtsScore());
        grade.setUasScore(request.getUasScore());
        grade.setComments(request.getComments());
        grade.setGradeType(request.getGradeType());

        // Hitung final score
        calculateFinalScore(grade);

        Grade saved = gradeRepository.save(grade);
        log.info("Grade created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getAllGrades() {
        List<Grade> grades = gradeRepository.findAll();
        return grades.stream().map(this::mapToResponse).collect(Collectors.toList());
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
    public List<GradeResponse> getGradesByClassId(Long classId) {
        return gradeRepository.findByClassId(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeResponse> getGradesBySemesterId(Long semesterId) {
        return gradeRepository.findBySemesterId(semesterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public GradeResponse updateGrade(Long id, GradeRequest request) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));

        grade.setStudentId(request.getStudentId());
        grade.setClassId(request.getClassId());
        grade.setSubjectId(request.getSubjectId());
        grade.setSemesterId(request.getSemesterId());
        grade.setTugasScore(request.getTugasScore());
        grade.setUtsScore(request.getUtsScore());
        grade.setUasScore(request.getUasScore());
        grade.setComments(request.getComments());
        grade.setGradeType(request.getGradeType());

        calculateFinalScore(grade);

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

    private void calculateFinalScore(Grade grade) {
        double tugas = grade.getTugasScore() != null ? grade.getTugasScore() : 0;
        double uts = grade.getUtsScore() != null ? grade.getUtsScore() : 0;
        double uas = grade.getUasScore() != null ? grade.getUasScore() : 0;

        double finalScore = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4);
        grade.setFinalScore(Math.round(finalScore * 100.0) / 100.0);

        // Set predikat
        if (finalScore >= 85) grade.setPredikat("A");
        else if (finalScore >= 80) grade.setPredikat("B+");
        else if (finalScore >= 70) grade.setPredikat("B");
        else if (finalScore >= 65) grade.setPredikat("C+");
        else if (finalScore >= 50) grade.setPredikat("C");
        else if (finalScore >= 40) grade.setPredikat("D");
        else grade.setPredikat("E");
    }

    private GradeResponse mapToResponse(Grade grade) {
        String studentName = lookupName("students", "full_name", grade.getStudentId());
        String className = lookupName("classes", "name", grade.getClassId());
        String subjectName = lookupName("subjects", "name", grade.getSubjectId());

        String semesterName = null;
        if (grade.getSemesterId() != null) {
            try {
                semesterName = jdbcTemplate.queryForObject(
                    "SELECT CONCAT(ay.year_name, ' - ', s.semester_type) FROM semesters s JOIN academic_years ay ON s.academic_year_id = ay.id WHERE s.id = ?",
                    String.class, grade.getSemesterId());
            } catch (Exception e) { semesterName = null; }
        }

        return GradeResponse.builder()
                .id(grade.getId())
                .studentId(grade.getStudentId())
                .studentName(studentName)
                .classId(grade.getClassId())
                .className(className)
                .subjectId(grade.getSubjectId())
                .subjectName(subjectName)
                .semesterId(grade.getSemesterId())
                .semesterName(semesterName)
                .tugasScore(grade.getTugasScore())
                .utsScore(grade.getUtsScore())
                .uasScore(grade.getUasScore())
                .finalScore(grade.getFinalScore())
                .predikat(grade.getPredikat())
                .comments(grade.getComments())
                .gradeType(grade.getGradeType())
                .isActive(grade.getIsActive())
                .createdAt(grade.getCreatedAt())
                .updatedAt(grade.getUpdatedAt())
                .build();
    }

    private String lookupName(String table, String column, Long id) {
        try {
            return jdbcTemplate.queryForObject("SELECT " + column + " FROM " + table + " WHERE id = ?", String.class, id);
        } catch (Exception e) {
            return null;
        }
    }
}
