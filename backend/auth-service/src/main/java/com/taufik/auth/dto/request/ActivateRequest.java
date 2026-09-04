package com.taufik.auth.dto.request;

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
public class ActivateRequest {

    @NotBlank(message = "Token aktivasi wajib diisi")
    private String token;

    @NotBlank(message = "Username (NIS/NIP) wajib diisi")
    private String username;

    @NotBlank(message = "Password baru wajib diisi")
    @Size(min = 6, message = "Password minimal 6 karakter")
    private String newPassword;
}