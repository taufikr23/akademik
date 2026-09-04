package com.taufik.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String nisn;
    private String gender;
    private String dateOfBirth;
    private String phone;
    private String address;
    private Long departmentId;
    private Long classId;
    private String className;
    private String role;
    private String accountStatus;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
