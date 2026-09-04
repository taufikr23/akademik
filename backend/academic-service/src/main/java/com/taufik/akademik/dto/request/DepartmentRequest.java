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
public class DepartmentRequest {

    @NotBlank(message = "Kode jurusan wajib diisi")
    @Size(max = 10, message = "Kode jurusan maksimal 10 karakter")
    private String code;

    @NotBlank(message = "Nama jurusan wajib diisi")
    @Size(max = 100, message = "Nama jurusan maksimal 100 karakter")
    private String name;

    private String description;
}