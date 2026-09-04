package com.taufik.assignment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentRequest {

    @NotBlank(message = "Title wajib diisi")
    private String title;

    private String description;

    @NotNull(message = "Subject ID wajib diisi")
    private Long subjectId;

    @NotNull(message = "Teacher ID wajib diisi")
    private Long teacherId;

    private Long classId;

    private LocalDate dueDate;

    private Double maxScore;

    private String assignmentType;
    private String materialFile;
}
