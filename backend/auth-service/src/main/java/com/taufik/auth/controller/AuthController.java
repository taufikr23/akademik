package com.taufik.auth.controller;

import com.taufik.auth.dto.request.ActivateRequest;
import com.taufik.auth.dto.request.LoginRequest;
import com.taufik.auth.dto.request.SelfRegistrationRequest;
import com.taufik.auth.dto.response.ApiResponse;
import com.taufik.auth.dto.response.AuthResponse;
import com.taufik.auth.model.AccountStatus;
import com.taufik.auth.model.User;
import com.taufik.auth.service.AuthService;
import com.taufik.auth.service.JwtService;
import com.taufik.auth.service.RegistrationService;
import com.taufik.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final AuthService authService;
    private final JwtService jwtService;
    private final RegistrationService registrationService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody SelfRegistrationRequest request) {
        log.info("POST /api/auth/register - Self registration: {} (role: {})",
                request.getUsername(), request.getRole());

        User user = registrationService.register(request);

        AuthResponse response = AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .isActive(false)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Pendaftaran berhasil! Menunggu persetujuan administrator. " +
                        "Anda akan menerima email notifikasi setelah akun disetujui.",
                        response
                ));
    }

    @PostMapping("/activate")
    public ResponseEntity<ApiResponse<AuthResponse>> activate(
            @Valid @RequestBody ActivateRequest request) {
        log.info("POST /api/auth/activate - Activate user: {}", request.getUsername());

        User user = authService.activateAccount(
                request.getToken(),
                request.getUsername(),
                request.getNewPassword()
        );

        AuthResponse response = AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .isActive(true)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Akun berhasil diaktifkan! Silakan login.", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        log.info("POST /api/auth/login - Login user: {}", request.getUsername());

        User user = userService.validateUser(request.getUsername(), request.getPassword());

        // Check if account is still pending
        if (user.getAccountStatus() == AccountStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(
                            "Akun Anda masih dalam proses persetujuan admin. " +
                            "Silakan tunggu notifikasi email."
                    ));
        }

        if (user.getAccountStatus() == AccountStatus.REJECTED) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(
                            "Akun Anda ditolak oleh administrator. " +
                            "Silakan hubungi administrator untuk informasi lebih lanjut."
                    ));
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole().getName());

        AuthResponse response = AuthResponse.builder()
                .id(user.getId())
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .isActive(user.getIsActive())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {
        log.info("GET /api/auth/me - Get current user");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid token"));
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        User user = userService.findByUsername(username);

        AuthResponse response = AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .isActive(user.getIsActive())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
