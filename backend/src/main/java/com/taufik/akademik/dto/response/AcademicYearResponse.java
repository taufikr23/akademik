package com.taufik.akademik.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicYearResponse {
    private Long id;
    private String yearName;
    private Boolean isActive;
    private Integer semesterCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}