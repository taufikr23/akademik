package com.taufik.attendance.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {

    @NotNull(message = "Teacher Subject ID wajib diisi")
    private Long teacherSubjectId;

    @NotNull(message = "Class ID wajib diisi")
    private Long classId;

    @NotNull(message = "Tanggal wajib diisi")
    private LocalDate date;

    private String room;
    private String notes;

    // Batch: list of student attendance entries
    @NotNull(message = "Data absen siswa wajib diisi")
    private List<StudentAttendance> attendances;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentAttendance {
        @NotNull(message = "Student ID wajib diisi")
        private Long studentId;

        @NotNull(message = "Status wajib diisi")
        private String status; // HADIR, IZIN, SAKIT, ALPHA
    }
}
