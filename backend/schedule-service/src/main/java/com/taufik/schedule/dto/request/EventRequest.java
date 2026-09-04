package com.taufik.schedule.dto.request;

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
public class EventRequest {

    @NotBlank(message = "Title wajib diisi")
    private String title;

    private String eventType; // EXAM, HOLIDAY, CEREMONY, DEADLINE

    private String description;

    @NotNull(message = "Start date wajib diisi")
    private LocalDate startDate;

    @NotNull(message = "End date wajib diisi")
    private LocalDate endDate;
}