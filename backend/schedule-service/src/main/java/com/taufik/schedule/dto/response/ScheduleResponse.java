package com.taufik.schedule.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleResponse {
    private Long id;
    private Long classId;
    private String className;
    private Long teacherId;
    private String teacherName;
    private Long subjectId;
    private String subjectName;
    private Integer dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
    private String room;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}