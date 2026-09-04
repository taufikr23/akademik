package com.taufik.attendance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentNis;
    private Long teacherSubjectId;
    private String subjectName;
    private Long classId;
    private String className;
    private LocalDate date;
    private String status;
    private String room;
    private String notes;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // For batch response
    private Integer totalStudents;
    private Integer present;
    private Integer sick;
    private Integer leave;
    private Integer absent;
    private List<StudentAttendanceItem> studentAttendances;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentAttendanceItem {
        private Long studentId;
        private String studentName;
        private String studentNis;
        private Long attendanceId;
        private String status;
    }
}
