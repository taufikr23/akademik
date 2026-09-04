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
public class HomeroomTeacherResponse {
    private Long id;
    private Long teacherId;
    private String teacherName;
    private Long classId;
    private String className;
    private Long academicYearId;
    private String academicYearName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}