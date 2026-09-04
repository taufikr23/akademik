package com.taufik.assignment.service;

import com.taufik.assignment.dto.request.AssignmentRequest;
import com.taufik.assignment.dto.response.AssignmentResponse;
import com.taufik.assignment.dto.response.SubmissionResponse;
import com.taufik.assignment.exception.ResourceNotFoundException;
import com.taufik.assignment.model.Assignment;
import com.taufik.assignment.repository.AssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.util.Map;
import java.util.UUID;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final com.taufik.assignment.repository.SubmissionRepository submissionRepository;
    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public AssignmentResponse createAssignment(AssignmentRequest request) {
        log.info("Creating assignment: {}", request.getTitle());

        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setSubjectId(request.getSubjectId());
        assignment.setTeacherId(request.getTeacherId());
        assignment.setClassId(request.getClassId());
        assignment.setDueDate(request.getDueDate());
        assignment.setMaxScore(request.getMaxScore());
        assignment.setAssignmentType(request.getAssignmentType());
        assignment.setMaterialFile(request.getMaterialFile());

        Assignment saved = assignmentRepository.save(assignment);
        log.info("Assignment created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        return mapToResponse(assignment);
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsBySubjectId(Long subjectId) {
        return assignmentRepository.findBySubjectId(subjectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByTeacherId(Long userId) {
        Long teacherId;
        try {
            teacherId = jdbcTemplate.queryForObject(
                "SELECT id FROM teachers WHERE user_id = ?", Long.class, userId);
        } catch (Exception e) {
            teacherId = userId;
        }
        return assignmentRepository.findByTeacherId(teacherId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByClassId(Long classId) {
        return assignmentRepository.findByClassId(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AssignmentResponse updateAssignment(Long id, AssignmentRequest request) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        assignment.setTitle(request.getTitle());
        assignment.setDescription(request.getDescription());
        assignment.setSubjectId(request.getSubjectId());
        assignment.setTeacherId(request.getTeacherId());
        assignment.setClassId(request.getClassId());
        assignment.setDueDate(request.getDueDate());
        assignment.setMaxScore(request.getMaxScore());
        assignment.setAssignmentType(request.getAssignmentType());
        assignment.setMaterialFile(request.getMaterialFile());

        Assignment updated = assignmentRepository.save(assignment);
        log.info("Assignment updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteAssignment(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        assignment.setIsActive(false);
        assignmentRepository.save(assignment);
        log.info("Assignment deactivated successfully with id: {}", id);
    }

    private AssignmentResponse mapToResponse(Assignment assignment) {
        String subjectName = lookupName("SELECT name FROM subjects WHERE id = " + assignment.getSubjectId());
        String className = assignment.getClassId() != null ? lookupName("SELECT name FROM classes WHERE id = " + assignment.getClassId()) : null;
        String teacherName = lookupName("SELECT full_name FROM teachers WHERE id = " + assignment.getTeacherId());

        return AssignmentResponse.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .subjectId(assignment.getSubjectId())
                .teacherId(assignment.getTeacherId())
                .classId(assignment.getClassId())
                .dueDate(assignment.getDueDate())
                .maxScore(assignment.getMaxScore())
                .assignmentType(assignment.getAssignmentType())
                .materialFile(assignment.getMaterialFile())
                .subjectName(subjectName)
                .className(className)
                .teacherName(teacherName)
                .isActive(assignment.getIsActive())
                .createdAt(assignment.getCreatedAt())
                .updatedAt(assignment.getUpdatedAt())
                .build();
    }

    // LOOKUP HELPER
    private String lookupName(String sql) {
        try { return jdbcTemplate.queryForObject(sql, String.class); }
        catch (Exception e) { return null; }
    }

    // TEACHER: Get classes they teach by username (NIP)
    public java.util.List<java.util.Map<String, Object>> getTeacherClassesByUsername(String username) {
        Long teacherId = resolveTeacherId(username);
        if (teacherId == null) return java.util.Collections.emptyList();
        String sql = "SELECT DISTINCT ts.id as teacher_subject_id, ts.teacher_id, ts.class_id, c.name as class_name, " +
                "s.id as subject_id, s.name as subject_name, ts.day_of_week, ts.start_time, ts.end_time, ts.room " +
                "FROM teacher_subjects ts JOIN classes c ON ts.class_id = c.id JOIN subjects s ON ts.subject_id = s.id " +
                "WHERE ts.teacher_id = ? AND ts.is_active = 1 AND ts.day_of_week IS NOT NULL ORDER BY ts.class_id, ts.day_of_week";
        return jdbcTemplate.queryForList(sql, teacherId);
    }

    // TEACHER: Get assignments by username
    public java.util.List<AssignmentResponse> getAssignmentsByUsername(String username) {
        Long teacherId = resolveTeacherId(username);
        if (teacherId == null) return java.util.Collections.emptyList();
        return assignmentRepository.findByTeacherId(teacherId).stream()
                .filter(Assignment::getIsActive)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // STUDENT: Get assignments by username (NIS)
    public java.util.List<AssignmentResponse> getStudentAssignmentsByUsername(String username) {
        try {
            Long classId = jdbcTemplate.queryForObject(
                "SELECT s.class_id FROM students s JOIN users u ON s.user_id = u.id WHERE u.username = ?",
                Long.class, username);
            if (classId == null) return java.util.Collections.emptyList();
            return assignmentRepository.findByClassId(classId).stream()
                .filter(a -> a.getIsActive())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    // RESOLVE: username -> teacher_id
    private Long resolveTeacherId(String username) {
        try {
            // Try via user_id first
            return jdbcTemplate.queryForObject(
                "SELECT t.id FROM teachers t JOIN users u ON t.user_id = u.id WHERE u.username = ?",
                Long.class, username);
        } catch (Exception e) {
            try {
                // Try via NIP directly
                return jdbcTemplate.queryForObject(
                    "SELECT id FROM teachers WHERE nip = ?", Long.class, username);
            } catch (Exception e2) {
                return null;
            }
        }
    }

    // TEACHER: Get classes they teach (accepts user_id, resolves to teacher_id)
    public java.util.List<java.util.Map<String, Object>> getTeacherClasses(Long userId) {
        Long teacherId;
        try {
            teacherId = jdbcTemplate.queryForObject(
                "SELECT id FROM teachers WHERE user_id = ?", Long.class, userId);
        } catch (Exception e) {
            teacherId = userId;
        }
        String sql = "SELECT DISTINCT ts.id as teacher_subject_id, ts.class_id, c.name as class_name, " +
                "s.id as subject_id, s.name as subject_name, ts.day_of_week, ts.start_time, ts.end_time, ts.room " +
                "FROM teacher_subjects ts JOIN classes c ON ts.class_id = c.id JOIN subjects s ON ts.subject_id = s.id " +
                "WHERE ts.teacher_id = ? AND ts.is_active = 1 AND ts.day_of_week IS NOT NULL ORDER BY ts.class_id, ts.day_of_week";
        return jdbcTemplate.queryForList(sql, teacherId);
    }

    // FILE UPLOAD
    private String getUploadDir() {
        String dir = System.getenv("UPLOAD_DIR");
        if (dir == null || dir.isEmpty()) {
            dir = System.getProperty("java.io.tmpdir") + "/assignments";
        }
        return dir;
    }

    public String uploadFile(MultipartFile file) {
        try {
            String uploadDir = getUploadDir();
            new File(uploadDir).mkdirs();
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            java.nio.file.Path target = java.nio.file.Paths.get(uploadDir, fileName);
            java.nio.file.Files.copy(file.getInputStream(), target, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            log.info("File uploaded to: {} ({} bytes)", target, file.getSize());
            return fileName;
        } catch (Exception e) {
            log.error("Gagal upload file: {}", e.getMessage());
            throw new RuntimeException("Gagal upload file: " + e.getMessage());
        }
    }

    public java.io.File getFile(String fileName) {
        String uploadDir = getUploadDir();
        java.io.File file = new java.io.File(uploadDir + "/" + fileName);
        if (!file.exists()) throw new RuntimeException("File tidak ditemukan: " + fileName);
        return file;
    }

    // STUDENT: Get assignments for their class
    public java.util.List<AssignmentResponse> getAssignmentsByStudentClass(Long studentId) {
        try {
            Long classId = jdbcTemplate.queryForObject(
                "SELECT class_id FROM students WHERE id = ?", Long.class, studentId);
            if (classId == null) return java.util.Collections.emptyList();
            return assignmentRepository.findByClassId(classId).stream()
                .filter(a -> a.getIsActive())
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    // STUDENT: Submit assignment
    public SubmissionResponse submitAssignment(Long assignmentId, Long studentId, String notes, MultipartFile file) {
        var existing = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
        if (existing.isPresent()) {
            throw new RuntimeException("Anda sudah mengumpulkan tugas ini");
        }
        com.taufik.assignment.model.AssignmentSubmission sub = new com.taufik.assignment.model.AssignmentSubmission();
        sub.setAssignmentId(assignmentId);
        sub.setStudentId(studentId);
        sub.setNotes(notes);
        sub.setStatus("SUBMITTED");
        if (file != null && !file.isEmpty()) {
            sub.setFileName(file.getOriginalFilename());
            sub.setFilePath(uploadFile(file));
        }
        var saved = submissionRepository.save(sub);
        return mapSubToResponse(saved);
    }

    // TEACHER: Get submissions for an assignment
    public java.util.List<SubmissionResponse> getSubmissions(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId).stream()
            .map(this::mapSubToResponse)
            .collect(Collectors.toList());
    }

    // TEACHER: Grade a submission
    public SubmissionResponse gradeSubmission(Long submissionId, Double score, String feedback) {
        var sub = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        sub.setScore(score);
        sub.setFeedback(feedback);
        sub.setStatus("GRADED");
        var saved = submissionRepository.save(sub);

        // Auto-sync to grades table
        syncGradeToGradesTable(saved);

        return mapSubToResponse(saved);
    }

    // Sync graded submission to grades table (tugas_score = average of all graded submissions)
    private void syncGradeToGradesTable(com.taufik.assignment.model.AssignmentSubmission sub) {
        try {
            // Get assignment info (subjectId, classId)
            Long assignmentId = sub.getAssignmentId();
            Long subjectId = jdbcTemplate.queryForObject(
                "SELECT subject_id FROM assignments WHERE id = ?", Long.class, assignmentId);
            Long classId = jdbcTemplate.queryForObject(
                "SELECT class_id FROM assignments WHERE id = ?", Long.class, assignmentId);
            if (subjectId == null || classId == null) return;

            // Get student's actual student_id (not user_id)
            Long studentId = null;
            try {
                studentId = jdbcTemplate.queryForObject(
                    "SELECT s.id FROM students s WHERE s.user_id = ?", Long.class, sub.getStudentId());
            } catch (Exception e) {
                studentId = sub.getStudentId();
            }
            if (studentId == null) return;

            // Calculate average tugas score from all graded submissions for this student+subject+class
            Double avgTugas = jdbcTemplate.queryForObject(
                "SELECT AVG(sub.score) FROM assignment_submissions sub " +
                "JOIN assignments a ON sub.assignment_id = a.id " +
                "WHERE sub.student_id = ? AND a.subject_id = ? AND a.class_id = ? AND sub.status = 'GRADED' AND sub.score IS NOT NULL",
                Double.class, sub.getStudentId(), subjectId, classId);
            if (avgTugas == null) avgTugas = 0.0;
            avgTugas = Math.round(avgTugas * 100.0) / 100.0;

            // Get current semester
            Long semesterId = 1L;
            try {
                semesterId = jdbcTemplate.queryForObject(
                    "SELECT id FROM semesters ORDER BY id DESC LIMIT 1", Long.class);
            } catch (Exception ignored) {}

            // Check if grade already exists
            Long existingGradeId = null;
            try {
                existingGradeId = jdbcTemplate.queryForObject(
                    "SELECT id FROM grades WHERE student_id = ? AND subject_id = ? AND class_id = ? AND is_active = 1",
                    Long.class, studentId, subjectId, classId);
            } catch (Exception ignored) {}

            if (existingGradeId != null) {
                // Update existing grade
                jdbcTemplate.update(
                    "UPDATE grades SET tugas_score = ?, score = ?, final_score = ROUND(? * 0.3 + COALESCE(uts_score, 0) * 0.3 + COALESCE(uas_score, 0) * 0.4, 2), updated_at = NOW() WHERE id = ?",
                    avgTugas, avgTugas, avgTugas, existingGradeId);
            } else {
                // Insert new grade
                jdbcTemplate.update(
                    "INSERT INTO grades (student_id, class_id, subject_id, semester_id, score, tugas_score, uts_score, uas_score, final_score, predikat, is_active, created_at, updated_at) " +
                    "VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, 'E', 1, NOW(), NOW())",
                    studentId, classId, subjectId, semesterId, avgTugas, avgTugas, avgTugas);
            }
            log.info("Synced grade to grades table: student={} subject={} tugas={}"
                , studentId, subjectId, avgTugas);
        } catch (Exception e) {
            log.error("Failed to sync grade to grades table: {}", e.getMessage());
        }
    }

    private SubmissionResponse mapSubToResponse(com.taufik.assignment.model.AssignmentSubmission sub) {
        // studentId in submission is user_id, need to find students via user_id
        String studentName = lookupName("SELECT s.full_name FROM students s WHERE s.user_id = " + sub.getStudentId());
        String studentNis = lookupName("SELECT s.nis FROM students s WHERE s.user_id = " + sub.getStudentId());
        return SubmissionResponse.builder()
            .id(sub.getId())
            .assignmentId(sub.getAssignmentId())
            .studentId(sub.getStudentId())
            .studentName(studentName)
            .studentNis(studentNis)
            .fileName(sub.getFileName())
            .filePath(sub.getFilePath())
            .notes(sub.getNotes())
            .score(sub.getScore())
            .feedback(sub.getFeedback())
            .status(sub.getStatus())
            .isActive(sub.getIsActive())
            .createdAt(sub.getCreatedAt())
            .build();
    }
}
