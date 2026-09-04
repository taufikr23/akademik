package com.taufik.akademik.dto.request;

import jakarta.validation.constraints.Email;
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
public class TeacherRequest {

    @NotBlank(message = "NIP wajib diisi")
    @Size(max = 20, message = "NIP maksimal 20 karakter")
    private String nip;

    @NotBlank(message = "Nama lengkap wajib diisi")
    @Size(max = 100, message = "Nama maksimal 100 karakter")
    private String fullName;

    private String gender;

    private String photoUrl;

    @Size(max = 20)
    private String phone;

    @Email(message = "Format email tidak valid")
    private String email;
}