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

    @NotNull(message = "Class ID wajib diisi")
    private Long classId;

    @NotNull(message = "Subject ID wajib diisi")
    private Long subjectId;

    @NotNull(message = "Semester ID wajib diisi")
    private Long semesterId;

    private Double tugasScore;

    private Double utsScore;

    private Double uasScore;

    private String comments;

    private String gradeType;
}
