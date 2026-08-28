package com.taufik.akademik.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectRequest {

    @NotBlank(message = "Kode mata pelajaran wajib diisi")
    @Size(max = 20, message = "Kode maksimal 20 karakter")
    private String code;

    @NotBlank(message = "Nama mata pelajaran wajib diisi")
    @Size(max = 100, message = "Nama maksimal 100 karakter")
    private String name;

    private String description;

    private Integer creditHours;
}