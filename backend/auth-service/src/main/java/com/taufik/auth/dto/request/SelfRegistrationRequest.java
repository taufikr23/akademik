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
public class SelfRegistrationRequest {

    @NotBlank(message = "NIS/NIP wajib diisi")
    @Size(min = 2, max = 20, message = "NIS/NIP minimal 2 dan maksimal 20 karakter")
    private String username; // NIS untuk siswa, NIP untuk guru

    private String nisn; // NISN (khusus siswa)

    @NotBlank(message = "Nama lengkap wajib diisi")
    @Size(min = 2, max = 100, message = "Nama maksimal 100 karakter")
    private String fullName;

    @NotBlank(message = "Jenis kelamin wajib dipilih")
    private String gender; // LAKI_LAKI atau PEREMPUAN

    private String dateOfBirth; // yyyy-MM-dd

    private String phone;

    private String address;

    @NotBlank(message = "Email wajib diisi")
    @Email(message = "Format email tidak valid")
    private String email;

    private Long departmentId; // Jurusan (khusus siswa)

    private Long classId; // Kelas (khusus siswa)

    @NotBlank(message = "Role wajib dipilih")
    private String role; // SISWA atau GURU

    @NotBlank(message = "Password wajib diisi")
    @Size(min = 6, message = "Password minimal 6 karakter")
    private String password;
}
