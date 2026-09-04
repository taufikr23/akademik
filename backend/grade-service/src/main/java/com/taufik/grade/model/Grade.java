package com.taufik.grade.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "grades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "class_id", nullable = false)
    private Long classId;

    @Column(name = "subject_id", nullable = false)
    private Long subjectId;

    @Column(name = "semester_id", nullable = false)
    private Long semesterId;

    @Column(name = "tugas_score")
    private Double tugasScore; // Nilai Tugas (30%)

    @Column(name = "uts_score")
    private Double utsScore; // Nilai UTS (30%)

    @Column(name = "uas_score")
    private Double uasScore; // Nilai UAS (40%)

    @Column(name = "final_score")
    private Double finalScore; // Nilai Akhir

    @Column(name = "predikat", length = 5)
    private String predikat; // A, B+, B, C+, C, D, E

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Column(name = "grade_type", length = 50)
    private String gradeType; // HARIAN, UTS, UAS

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
