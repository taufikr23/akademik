package com.taufik.attendance.service;

import com.taufik.attendance.dto.request.AttendanceRequest;
import com.taufik.attendance.dto.response.AttendanceResponse;
import com.taufik.attendance.exception.ResourceNotFoundException;
import com.taufik.attendance.model.Attendance;
import com.taufik.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final JdbcTemplate jdbcTemplate;

    // ==========================================
    // BATCH SUBMIT ATTENDANCE
    // ==========================================
    @Transactional
    public AttendanceResponse batchSubmitAttendance(AttendanceRequest request) {
        log.info("Batch submit attendance: class={}, date={}, total students={}",
                request.getClassId(), request.getDate(), request.getAttendances().size());

        List<AttendanceResponse.StudentAttendanceItem> items = new ArrayList<>();

        // VALIDATION: Check if date matches teacher schedule day
        try {
            var tsData = jdbcTemplate.queryForMap(
                "SELECT ts.day_of_week, s.name as subject_name, c.name as class_name " +
                "FROM teacher_subjects ts JOIN subjects s ON ts.subject_id = s.id JOIN classes c ON ts.class_id = c.id " +
                "WHERE ts.id = ?", request.getTeacherSubjectId());
            int dayOfWeek = request.getDate().getDayOfWeek().getValue(); // 1=Mon,7=Sun
            int scheduledDay = ((Number) tsData.get("day_of_week")).intValue();
            if (dayOfWeek != scheduledDay) {
                String[] dayNames = {"","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"};
                throw new RuntimeException(
                    "Tidak bisa absen hari " + dayNames[dayOfWeek] + ". Jadwal mengajar " +
                    tsData.get("subject_name") + " adalah hari " + dayNames[scheduledDay]);
            }
        } catch (RuntimeException e) {
            if (e.getMessage().startsWith("Tidak bisa absen")) throw e;
            // If query fails, continue (fallback)
        }
        int present = 0, sick = 0, leave = 0, absent = 0;

        for (AttendanceRequest.StudentAttendance sa : request.getAttendances()) {
            // Check if already exists
            Optional<Attendance> existing = attendanceRepository
                    .findByStudentIdAndTeacherSubjectIdAndDate(
                            sa.getStudentId(), request.getTeacherSubjectId(), request.getDate());

            Attendance attendance;
            if (existing.isPresent()) {
                // Update existing
                attendance = existing.get();
                attendance.setStatus(sa.getStatus());
                attendance.setRoom(request.getRoom());
                attendance.setNotes(request.getNotes());
            } else {
                // Create new
                attendance = new Attendance();
                attendance.setStudentId(sa.getStudentId());
                attendance.setTeacherSubjectId(request.getTeacherSubjectId());
                attendance.setClassId(request.getClassId());
                attendance.setDate(request.getDate());
                attendance.setRoom(request.getRoom());
                attendance.setNotes(request.getNotes());
                attendance.setStatus(sa.getStatus());
            }

            Attendance saved = attendanceRepository.save(attendance);

            // Count by status
            switch (sa.getStatus()) {
                case "HADIR" -> present++;
                case "SAKIT" -> sick++;
                case "IZIN" -> leave++;
                case "ALPHA" -> absent++;
            }

            // Lookup student name
            String studentName = lookupStudentName(sa.getStudentId());
            String studentNis = lookupStudentNis(sa.getStudentId());

            items.add(AttendanceResponse.StudentAttendanceItem.builder()
                    .studentId(sa.getStudentId())
                    .studentName(studentName)
                    .studentNis(studentNis)
                    .attendanceId(saved.getId())
                    .status(sa.getStatus())
                    .build());
        }

        String subjectName = lookupSubjectName(request.getTeacherSubjectId());
        String className = lookupClassName(request.getClassId());

        return AttendanceResponse.builder()
                .classId(request.getClassId())
                .className(className)
                .teacherSubjectId(request.getTeacherSubjectId())
                .subjectName(subjectName)
                .date(request.getDate())
                .totalStudents(request.getAttendances().size())
                .present(present)
                .sick(sick)
                .leave(leave)
                .absent(absent)
                .studentAttendances(items)
                .build();
    }

    // ==========================================
    // GET TEACHER'S CLASSES (accepts user_id, resolves to teacher_id)
    // ==========================================
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTeacherClasses(Long userId) {
        Long teacherId;
        try {
            teacherId = jdbcTemplate.queryForObject(
                "SELECT id FROM teachers WHERE user_id = ?", Long.class, userId);
        } catch (Exception e) {
            teacherId = userId;
        }
        String sql = """
            SELECT DISTINCT ts.id as teacher_subject_id, ts.class_id, c.name as class_name,
                   s.id as subject_id, s.name as subject_name,
                   ts.day_of_week, ts.start_time, ts.end_time, ts.room
            FROM teacher_subjects ts
            JOIN classes c ON ts.class_id = c.id
            JOIN subjects s ON ts.subject_id = s.id
            WHERE ts.teacher_id = ? AND ts.is_active = 1 AND ts.day_of_week IS NOT NULL
            ORDER BY ts.class_id, ts.day_of_week
            """;
        return jdbcTemplate.queryForList(sql, teacherId);
    }

    // ==========================================
    // GET STUDENTS IN A CLASS
    // ==========================================
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getClassStudents(Long classId) {
        String sql = """
            SELECT st.id, st.nis, st.nisn, st.full_name, st.gender, st.phone
            FROM students st
            WHERE st.class_id = ? AND st.is_active = 1
            ORDER BY st.full_name
            """;
        return jdbcTemplate.queryForList(sql, classId);
    }

    // ==========================================
    // GET EXISTING ATTENDANCE FOR CLASS ON DATE
    // ==========================================
    @Transactional(readOnly = true)
    public AttendanceResponse getAttendanceByClassAndDate(Long classId, Long teacherSubjectId, LocalDate date) {
        List<Attendance> attendances = attendanceRepository
                .findByClassIdAndTeacherSubjectIdAndDate(classId, teacherSubjectId, date);

        // Get all students in the class
        List<Map<String, Object>> students = getClassStudents(classId);

        String subjectName = lookupSubjectName(teacherSubjectId);
        String className = lookupClassName(classId);

        List<AttendanceResponse.StudentAttendanceItem> items = new ArrayList<>();
        int present = 0, sick = 0, leave = 0, absent = 0;

        // Create map of existing attendance
        Map<Long, Attendance> attendanceMap = attendances.stream()
                .collect(Collectors.toMap(Attendance::getStudentId, a -> a, (a, b) -> a));

        for (Map<String, Object> student : students) {
            Long studentId = ((Number) student.get("id")).longValue();
            String status = "ALPHA"; // default
            Long attendanceId = null;

            Attendance existing = attendanceMap.get(studentId);
            if (existing != null) {
                status = existing.getStatus();
                attendanceId = existing.getId();
            }

            switch (status) {
                case "HADIR" -> present++;
                case "SAKIT" -> sick++;
                case "IZIN" -> leave++;
                case "ALPHA" -> absent++;
            }

            items.add(AttendanceResponse.StudentAttendanceItem.builder()
                    .studentId(studentId)
                    .studentName((String) student.get("full_name"))
                    .studentNis((String) student.get("nis"))
                    .attendanceId(attendanceId)
                    .status(status)
                    .build());
        }

        return AttendanceResponse.builder()
                .classId(classId)
                .className(className)
                .teacherSubjectId(teacherSubjectId)
                .subjectName(subjectName)
                .date(date)
                .totalStudents(students.size())
                .present(present)
                .sick(sick)
                .leave(leave)
                .absent(absent)
                .studentAttendances(items)
                .build();
    }

    // ==========================================
    // GET ATTENDANCE HISTORY FOR CLASS
    // ==========================================
    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendanceHistory(Long classId, Long teacherSubjectId) {
        String sql = """
            SELECT a.* FROM attendances a
            WHERE a.class_id = ? AND a.teacher_subject_id = ? AND a.is_active = 1
            ORDER BY a.date DESC, a.student_id
            """;
        List<Attendance> attendances = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Attendance a = new Attendance();
            a.setId(rs.getLong("id"));
            a.setStudentId(rs.getLong("student_id"));
            a.setTeacherSubjectId(rs.getLong("teacher_subject_id"));
            a.setClassId(rs.getLong("class_id"));
            a.setDate(rs.getDate("date").toLocalDate());
            a.setStatus(rs.getString("status"));
            a.setRoom(rs.getString("room"));
            a.setNotes(rs.getString("notes"));
            a.setIsActive(rs.getBoolean("is_active"));
            return a;
        }, classId, teacherSubjectId);

        return attendances.stream()
                .map(a -> {
                    String studentName = lookupStudentName(a.getStudentId());
                    String studentNis = lookupStudentNis(a.getStudentId());
                    String subjectName = lookupSubjectName(a.getTeacherSubjectId());
                    String className = lookupClassName(a.getClassId());

                    return AttendanceResponse.builder()
                            .id(a.getId())
                            .studentId(a.getStudentId())
                            .studentName(studentName)
                            .studentNis(studentNis)
                            .teacherSubjectId(a.getTeacherSubjectId())
                            .subjectName(subjectName)
                            .classId(a.getClassId())
                            .className(className)
                            .date(a.getDate())
                            .status(a.getStatus())
                            .room(a.getRoom())
                            .notes(a.getNotes())
                            .isActive(a.getIsActive())
                            .build();
                })
                .collect(Collectors.toList());
    }


    // ==========================================
    // SISWA: Get attendance summary per subject
    // ==========================================
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getStudentAttendanceSummary(Long studentId) {
        String sql = "SELECT ts.id as teacher_subject_id, s.name as subject_name, c.name as class_name, ts.teacher_id, t.full_name as teacher_name, COUNT(CASE WHEN a.status = 'HADIR' THEN 1 END) as hadir, COUNT(CASE WHEN a.status = 'IZIN' THEN 1 END) as izin, COUNT(CASE WHEN a.status = 'SAKIT' THEN 1 END) as sakit, COUNT(CASE WHEN a.status = 'ALPHA' THEN 1 END) as alpha, COUNT(a.id) as total_records FROM teacher_subjects ts JOIN subjects s ON ts.subject_id = s.id JOIN classes c ON ts.class_id = c.id JOIN teachers t ON ts.teacher_id = t.id LEFT JOIN attendances a ON a.teacher_subject_id = ts.id AND a.student_id = ? AND a.is_active = 1 WHERE ts.class_id = (SELECT class_id FROM students WHERE id = ?) AND ts.is_active = 1 AND ts.day_of_week IS NOT NULL GROUP BY ts.id, s.name, c.name, ts.teacher_id, t.full_name ORDER BY s.name";
        return jdbcTemplate.queryForList(sql, studentId, studentId);
    }

    // ==========================================
    // SISWA: Get attendance history for a subject
    // ==========================================
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getStudentSubjectAttendance(Long studentId, Long teacherSubjectId) {
        String sql = "SELECT a.id, a.date, a.status, a.notes, a.room, s.name as subject_name, c.name as class_name, t.full_name as teacher_name FROM attendances a JOIN teacher_subjects ts ON a.teacher_subject_id = ts.id JOIN subjects s ON ts.subject_id = s.id JOIN classes c ON ts.class_id = c.id JOIN teachers t ON ts.teacher_id = t.id WHERE a.student_id = ? AND a.teacher_subject_id = ? AND a.is_active = 1 ORDER BY a.date DESC";
        return jdbcTemplate.queryForList(sql, studentId, teacherSubjectId);
    }

    // ==========================================
    // CRUD (existing)
    // ==========================================
    @Transactional
    public AttendanceResponse createAttendance(AttendanceRequest request) {
        // Delegate to batch with single student
        if (request.getAttendances() != null && !request.getAttendances().isEmpty()) {
            return batchSubmitAttendance(request);
        }
        throw new RuntimeException("No attendance data provided");
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAllAttendances() {
        return attendanceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AttendanceResponse getAttendanceById(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));
        return mapToResponse(attendance);
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendancesByStudentId(Long studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceResponse updateAttendance(Long id, AttendanceRequest request) {
        throw new RuntimeException("Use batch submit to update attendance");
    }

    @Transactional
    public void deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));
        attendanceRepository.delete(attendance);
        log.info("Attendance deleted with id: {}", id);
    }

    // ==========================================
    // LOOKUP HELPERS (via JdbcTemplate)
    // ==========================================
    private String lookupStudentName(Long studentId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT full_name FROM students WHERE id = ?", String.class, studentId);
        } catch (Exception e) {
            return "Unknown";
        }
    }

    private String lookupStudentNis(Long studentId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT nis FROM students WHERE id = ?", String.class, studentId);
        } catch (Exception e) {
            return "-";
        }
    }

    private String lookupSubjectName(Long teacherSubjectId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT s.name FROM teacher_subjects ts JOIN subjects s ON ts.subject_id = s.id WHERE ts.id = ?",
                    String.class, teacherSubjectId);
        } catch (Exception e) {
            return "Unknown";
        }
    }

    private String lookupClassName(Long classId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT name FROM classes WHERE id = ?", String.class, classId);
        } catch (Exception e) {
            return "Unknown";
        }
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        String studentName = lookupStudentName(attendance.getStudentId());
        String studentNis = lookupStudentNis(attendance.getStudentId());
        String subjectName = lookupSubjectName(attendance.getTeacherSubjectId());
        String className = lookupClassName(attendance.getClassId());

        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudentId())
                .studentName(studentName)
                .studentNis(studentNis)
                .teacherSubjectId(attendance.getTeacherSubjectId())
                .subjectName(subjectName)
                .classId(attendance.getClassId())
                .className(className)
                .date(attendance.getDate())
                .status(attendance.getStatus())
                .room(attendance.getRoom())
                .notes(attendance.getNotes())
                .isActive(attendance.getIsActive())
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }
}
