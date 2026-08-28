package com.taufik.schedule.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequest {

    @NotNull(message = "Class ID wajib diisi")
    private Long classId;

    @NotNull(message = "Teacher ID wajib diisi")
    private Long teacherId;

    @NotNull(message = "Subject ID wajib diisi")
    private Long subjectId;

    @NotNull(message = "Day of week wajib diisi")
    private Integer dayOfWeek; // 1-7

    @NotNull(message = "Start time wajib diisi")
    private LocalTime startTime;

    @NotNull(message = "End time wajib diisi")
    private LocalTime endTime;

    private String room;
}