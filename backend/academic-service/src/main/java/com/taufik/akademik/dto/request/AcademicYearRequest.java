package com.taufik.akademik.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicYearRequest {

    @NotBlank(message = "Nama tahun ajaran wajib diisi")
    private String yearName; // "2026/2027"
}