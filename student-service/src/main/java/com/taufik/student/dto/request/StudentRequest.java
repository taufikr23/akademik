package com.taufik.student.dto.request;

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
public class StudentRequest {

    private Long userId;

    @NotBlank(message = "NIS wajib diisi")
    @Size(max = 20, message = "NIS maksimal 20 karakter")
    private String nis;

    @Size(max = 20, message = "NISN maksimal 20 karakter")
    private String nisn;

    @NotBlank(message = "Nama lengkap wajib diisi")
    @Size(max = 100, message = "Nama maksimal 100 karakter")
    private String fullName;

    private String gender;
    private String photoUrl;
    private String phone;
    private String address;
}