package com.taufik.assignment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmissionResponse {
    private Long id;
    private Long assignmentId;
    private Long studentId;
    private String studentName;
    private String studentNis;
    private String fileName;
    private String filePath;
    private String notes;
    private Double score;
    private String feedback;
    private String status;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
