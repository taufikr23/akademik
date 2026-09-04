package com.taufik.auth.controller;

import com.taufik.auth.dto.request.AdminCreateUserRequest;
import com.taufik.auth.dto.response.ApiResponse;
import com.taufik.auth.dto.response.AuthResponse;
import com.taufik.auth.model.AccountActivation;
import com.taufik.auth.model.User;
import com.taufik.auth.service.AuthService;
import com.taufik.auth.service.EmailService;
import com.taufik.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminUserController {

    private final UserService userService;
    private final AuthService authService;
    private final EmailService emailService;

    @PostMapping("/create-user")
    public ResponseEntity<ApiResponse<AuthResponse>> createUser(
            @Valid @RequestBody AdminCreateUserRequest request) {
        log.info("POST /api/auth/admin/create-user - Admin creating user: {} (role: {})",
                request.getUsername(), request.getRole());

        // 1. Create inactive user account
        User user = userService.createInactiveUser(
                request.getUsername(),
                request.getEmail(),
                request.getRole()
        );

        // 2. Generate activation token
        AccountActivation activation = authService.createActivation(user, request.getEmail());

        // 3. Send activation email asynchronously
        try {
            emailService.sendActivationEmail(
                    request.getEmail(),
                    request.getFullName(),
                    request.getUsername(),
                    activation.getActivationCode()
            );
        } catch (Exception e) {
            log.error("Failed to send activation email, but user was created. Error: {}", e.getMessage());
            // User is created even if email fails — admin can retry or share link manually
        }

        AuthResponse response = AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .isActive(false)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Akun dibuat. Email aktivasi telah dikirim ke " + request.getEmail(),
                        response
                ));
    }

    @GetMapping("/validate-token")
    public ResponseEntity<ApiResponse<Boolean>> validateToken(@RequestParam String token) {
        log.info("GET /api/auth/admin/validate-token - Validating token");
        boolean valid = authService.isTokenValid(token);
        return ResponseEntity.ok(ApiResponse.success(valid));
    }
}
