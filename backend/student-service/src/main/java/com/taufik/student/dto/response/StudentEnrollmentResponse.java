package com.taufik.student.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentEnrollmentResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentNis;
    private Long classId;
    private Long academicYearId;
    private String status;
    private LocalDateTime createdAt;
}