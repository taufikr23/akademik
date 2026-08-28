package com.taufik.akademik.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SemesterRequest {

    @NotNull(message = "Academic Year ID wajib diisi")
    private Long academicYearId;

    @NotBlank(message = "Tipe semester wajib diisi (GANJIL/GENAP)")
    private String semesterType;
}