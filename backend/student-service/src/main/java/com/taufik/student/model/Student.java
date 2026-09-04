package com.taufik.student.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(unique = true, nullable = false, length = 20)
    private String nis;

    @Column(unique = true, length = 20)
    private String nisn;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(length = 10)
    private String gender;

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    @Column(length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "department_id")
    private Long departmentId;

    @Column(name = "class_id")
    private Long classId;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<StudentEnrollment> enrollments;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}