package com.taufik.grade.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GradeRequest {

    @NotNull(message = "Student ID wajib diisi")
    private Long studentId;

    private Long assignmentId;

    @NotNull(message = "Subject ID wajib diisi")
    private Long subjectId;

    @NotNull(message = "Score wajib diisi")
    private Double score;

    private String grade;

    private String comments;

    private String semester;

    private String academicYear;

    private String gradeType;
}
