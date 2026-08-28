package com.taufik.grade.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeResponse {
    private Long id;
    private Long studentId;
    private Long assignmentId;
    private Long subjectId;
    private Double score;
    private String grade;
    private String comments;
    private String semester;
    private String academicYear;
    private String gradeType;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
