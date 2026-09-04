package com.taufik.student.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponse {
    private Long id;
    private Long userId;
    private String nis;
    private String nisn;
    private String fullName;
    private String gender;
    private String photoUrl;
    private String phone;
    private String address;
    private Long departmentId;
    private Long classId;
    private String className;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}