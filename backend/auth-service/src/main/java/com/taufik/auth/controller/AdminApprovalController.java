package com.taufik.auth.controller;

import com.taufik.auth.dto.response.ApiResponse;
import com.taufik.auth.dto.response.UserResponse;
import com.taufik.auth.model.User;
import com.taufik.auth.service.EmailService;
import com.taufik.auth.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/admin/approvals")
@RequiredArgsConstructor
@Slf4j
public class AdminApprovalController {

    private final RegistrationService registrationService;
    private final EmailService emailService;
    private final RestTemplate restTemplate;
    private final JdbcTemplate jdbcTemplate;

    @Value("${app.student-service.url:http://localhost:8083}")
    private String studentServiceUrl;

    @Value("${app.teacher-service.url:http://localhost:8081}")
    private String teacherServiceUrl;

    @GetMapping("/pending")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getPendingRegistrations() {
        log.info("GET /api/auth/admin/approvals/pending - Get pending registrations");

        List<User> pendingUsers = registrationService.getPendingUsers();
        List<UserResponse> responses = pendingUsers.stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @PostMapping("/{userId}/approve")
    public ResponseEntity<ApiResponse<UserResponse>> approveUser(@PathVariable Long userId) {
        log.info("POST /api/auth/admin/approvals/{}/approve", userId);

        User user = registrationService.approveUser(userId);

        // Create Student or Teacher record in the respective service
        String roleName = user.getRole().getName();
        if ("SISWA".equals(roleName)) {
            createStudentRecord(user);
        } else if ("GURU".equals(roleName)) {
            createTeacherRecord(user);
        }

        // Send approval notification email
        try {
            emailService.sendApprovalEmail(
                    user.getEmail(),
                    user.getUsername(),
                    user.getRole().getName()
            );
        } catch (Exception e) {
            log.error("Failed to send approval email to {}: {}", user.getEmail(), e.getMessage());
        }

        return ResponseEntity.ok(ApiResponse.success(
                "Pendaftaran disetujui. Email notifikasi telah dikirim.",
                toResponse(user)
        ));
    }

    private void createStudentRecord(User user) {
        try {
            Long classId = user.getClassId();
            Map<String, Object> body = new java.util.HashMap<>();
            body.put("userId", user.getId());
            body.put("nis", user.getUsername());
            body.put("nisn", user.getNisn() != null ? user.getNisn() : "");
            body.put("fullName", user.getFullName() != null ? user.getFullName() : user.getUsername());
            body.put("gender", user.getGender() != null ? user.getGender() : "");
            body.put("phone", user.getPhone() != null ? user.getPhone() : "");
            body.put("address", user.getAddress() != null ? user.getAddress() : "");
            body.put("departmentId", user.getDepartmentId());
            body.put("classId", classId);
            body.put("photoUrl", "");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<?> resp = restTemplate.postForEntity(
                    studentServiceUrl + "/api/students", request, Object.class);
            log.info("Created student record for user: {} (status: {})", user.getUsername(), resp.getStatusCode());
        } catch (Exception e) {
            log.error("Failed to create student record for {}: {}", user.getUsername(), e.getMessage());
        }
    }

    private void createTeacherRecord(User user) {
        try {
            Map<String, Object> body = Map.of(
                    "nip", user.getUsername(),
                    "fullName", user.getFullName() != null ? user.getFullName() : user.getUsername(),
                    "gender", user.getGender() != null ? user.getGender() : "",
                    "phone", user.getPhone() != null ? user.getPhone() : "",
                    "email", user.getEmail() != null ? user.getEmail() : "",
                    "photoUrl", ""
            );
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<?> resp = restTemplate.postForEntity(
                    teacherServiceUrl + "/api/teachers", request, Object.class);
            log.info("Created teacher record for user: {} (status: {})", user.getUsername(), resp.getStatusCode());
        } catch (Exception e) {
            log.error("Failed to create teacher record for {}: {}", user.getUsername(), e.getMessage());
        }
    }

    @PostMapping("/{userId}/reject")
    public ResponseEntity<ApiResponse<UserResponse>> rejectUser(@PathVariable Long userId) {
        log.info("POST /api/auth/admin/approvals/{}/reject", userId);

        User user = registrationService.rejectUser(userId);

        return ResponseEntity.ok(ApiResponse.success(
                "Pendaftaran ditolak.",
                toResponse(user)
        ));
    }

    private UserResponse toResponse(User user) {
        String className = null;
        if (user.getClassId() != null) {
            try {
                className = jdbcTemplate.queryForObject(
                        "SELECT name FROM classes WHERE id = ?", String.class, user.getClassId());
            } catch (Exception e) { log.warn("Could not fetch class name: {}", e.getMessage()); }
        }
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .nisn(user.getNisn())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .phone(user.getPhone())
                .address(user.getAddress())
                .departmentId(user.getDepartmentId())
                .classId(user.getClassId())
                .className(className)
                .role(user.getRole().getName())
                .accountStatus(user.getAccountStatus().name())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
