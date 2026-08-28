package com.taufik.attendance.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {

    @NotNull(message = "Student ID wajib diisi")
    private Long studentId;

    @NotNull(message = "Schedule ID wajib diisi")
    private Long scheduleId;

    @NotNull(message = "Tanggal wajib diisi")
    private LocalDate date;

    private LocalTime checkInTime;

    private LocalTime checkOutTime;

    @NotBlank(message = "Status wajib diisi")
    private String status;

    private String location;
    private String notes;
}
