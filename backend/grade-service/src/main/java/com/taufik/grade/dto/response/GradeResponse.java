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
    private String studentName;
    private Long classId;
    private String className;
    private Long subjectId;
    private String subjectName;
    private Long semesterId;
    private String semesterName;
    private Double tugasScore;
    private Double utsScore;
    private Double uasScore;
    private Double finalScore;
    private String predikat;
    private String comments;
    private String gradeType;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
