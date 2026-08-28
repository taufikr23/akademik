package com.taufik.student.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentEnrollmentRequest {

    @NotNull(message = "Student ID wajib diisi")
    private Long studentId;

    @NotNull(message = "Class ID wajib diisi")
    private Long classId;

    @NotNull(message = "Academic Year ID wajib diisi")
    private Long academicYearId;

    private String status; // ACTIVE, GRADUATED, DROPPED
}