package com.taufik.auth.dto.request;

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
public class AdminCreateUserRequest {

    @NotBlank(message = "Username (NIS/NIP) wajib diisi")
    @Size(min = 2, max = 20, message = "Username minimal 2 dan maksimal 20 karakter")
    private String username; // NIS untuk siswa, NIP untuk guru

    @NotBlank(message = "Email wajib diisi")
    @Email(message = "Format email tidak valid")
    private String email;

    @NotBlank(message = "Role wajib dipilih")
    private String role; // ADMIN, GURU, SISWA

    @NotBlank(message = "Nama lengkap wajib diisi")
    @Size(min = 2, max = 100, message = "Nama maksimal 100 karakter")
    private String fullName;
}
