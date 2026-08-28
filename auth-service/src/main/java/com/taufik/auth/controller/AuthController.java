package com.taufik.auth.controller;

import com.taufik.auth.dto.request.ActivateRequest;
import com.taufik.auth.dto.request.LoginRequest;
import com.taufik.auth.dto.request.RegisterRequest;
import com.taufik.auth.dto.response.ApiResponse;
import com.taufik.auth.dto.response.AuthResponse;
import com.taufik.auth.model.User;
import com.taufik.auth.service.AuthService;
import com.taufik.auth.service.JwtService;
import com.taufik.auth.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        log.info("POST /api/v1/auth/register - Register user: {}", request.getUsername());

        User user = userService.createUser(
                request.getUsername(),
                request.getPassword(),
                request.getRole()
        );

        // Generate activation code
        authService.createActivation(user);
        String activationCode = authService.getActivationCode(user);

        AuthResponse response = AuthResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().getName())
                .isActive(false)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered. Activation code: " + activationCode, response));
    }

    @PostMapping("/activate")
    public ResponseEntity<ApiResponse<AuthResponse>> activate(
            @Valid @RequestBody ActivateRequest request) {
        log.info("POST /api/v1/auth/activate - Activate user: {}", request.getUsername());

        User user = authService.activateAccount(
                request.getUsername(),
                request.getActivationCode(),
                request.getNewPassword()
        );

        AuthResponse response = AuthResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().getName())
                .isActive(true)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Account activated successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        log.info("POST /api/v1/auth/login - Login user: {}", request.getUsername());

        User user = userService.validateUser(request.getUsername(), request.getPassword());

        String token = jwtService.generateToken(user.getUsername(), user.getRole().getName());

        AuthResponse response = AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole().getName())
                .isActive(user.getIsActive())
                .build();

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {
        log.info("GET /api/v1/auth/me - Get current user");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid token"));
        }

        String token = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        User user = userService.findByUsername(username);

        AuthResponse response = AuthResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().getName())
                .isActive(user.getIsActive())
                .build();

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
