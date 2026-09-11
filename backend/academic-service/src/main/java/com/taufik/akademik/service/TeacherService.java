package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.TeacherRequest;
import com.taufik.akademik.dto.response.TeacherResponse;
import com.taufik.akademik.exception.ResourceNotFoundException;
import com.taufik.akademik.model.Teacher;
import com.taufik.akademik.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherService implements TeacherServiceInterface {

    private final TeacherRepository teacherRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public TeacherResponse createTeacher(TeacherRequest request) {
        log.info("Creating new teacher with NIP: {}", request.getNip());
        Teacher teacher = new Teacher();
        teacher.setNip(request.getNip());
        teacher.setFullName(request.getFullName());
        teacher.setGender(request.getGender());
        teacher.setPhotoUrl(request.getPhotoUrl());
        teacher.setPhone(request.getPhone());
        teacher.setEmail(request.getEmail());
        Teacher saved = teacherRepository.save(teacher);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> getActiveTeachers() {
        return teacherRepository.findByIsActiveTrue().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherResponse getTeacherById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        return mapToResponse(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherResponse getTeacherByNip(String nip) {
        Teacher teacher = teacherRepository.findByNip(nip)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with NIP: " + nip));
        return mapToResponse(teacher);
    }

    @Transactional(readOnly = true)
    public TeacherResponse getTeacherByUserId(Long userId) {
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with User ID: " + userId));
        return mapToResponse(teacher);
    }

    @Override
    @Transactional
    public TeacherResponse updateTeacher(Long id, TeacherRequest request) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        teacher.setNip(request.getNip());
        teacher.setFullName(request.getFullName());
        teacher.setGender(request.getGender());
        teacher.setPhotoUrl(request.getPhotoUrl());
        teacher.setPhone(request.getPhone());
        teacher.setEmail(request.getEmail());
        return mapToResponse(teacherRepository.save(teacher));
    }

    @Override
    @Transactional
    public void deleteTeacher(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        jdbcTemplate.update("DELETE FROM teacher_subjects WHERE teacher_id = ?", id);
        jdbcTemplate.update("DELETE FROM homeroom_teachers WHERE teacher_id = ?", id);
        teacherRepository.delete(teacher);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> searchTeachers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllTeachers();
        }
        return teacherRepository.searchByKeyword(keyword.trim()).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> searchAndSortTeachers(String keyword, String sortBy, String order) {
        List<Teacher> teachers;
        if (keyword != null && !keyword.trim().isEmpty()) {
            teachers = teacherRepository.searchByKeyword(keyword.trim());
        } else {
            teachers = teacherRepository.findAll();
        }
        String sortField = (sortBy != null && !sortBy.trim().isEmpty()) ? sortBy.trim() : "fullName";
        boolean ascending = !"desc".equalsIgnoreCase(order);
        Comparator<Teacher> comparator;
        switch (sortField.toLowerCase()) {
            case "nip": comparator = Comparator.comparing(Teacher::getNip, Comparator.nullsLast(String::compareTo)); break;
            case "createdat": comparator = Comparator.comparing(Teacher::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())); break;
            default: comparator = Comparator.comparing(Teacher::getFullName, Comparator.nullsLast(String::compareTo)); break;
        }
        if (!ascending) comparator = comparator.reversed();
        return teachers.stream().sorted(comparator).map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> getTeachersByDepartment(Long departmentId) {
        return teacherRepository.findByIsActiveTrue().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponse> getTeachersByDepartment(Long departmentId, boolean activeOnly) {
        List<Teacher> teachers = activeOnly ? teacherRepository.findByIsActiveTrue() : teacherRepository.findAll();
        return teachers.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private TeacherResponse mapToResponse(Teacher teacher) {
        return TeacherResponse.builder()
                .id(teacher.getId()).userId(teacher.getUserId()).nip(teacher.getNip())
                .fullName(teacher.getFullName()).gender(teacher.getGender())
                .photoUrl(teacher.getPhotoUrl()).phone(teacher.getPhone()).email(teacher.getEmail())
                .isActive(teacher.getIsActive()).createdAt(teacher.getCreatedAt()).updatedAt(teacher.getUpdatedAt())
                .build();
    }
}