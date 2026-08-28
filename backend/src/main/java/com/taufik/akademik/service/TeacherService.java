package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.TeacherRequest;
import com.taufik.akademik.dto.response.TeacherResponse;
import com.taufik.akademik.exception.ResourceNotFoundException;
import com.taufik.akademik.model.Teacher;
import com.taufik.akademik.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherService {

    private final TeacherRepository teacherRepository;

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
        log.info("Teacher created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TeacherResponse> getAllTeachers() {
        log.info("Fetching all teachers");
        return teacherRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TeacherResponse> getActiveTeachers() {
        log.info("Fetching active teachers");
        return teacherRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TeacherResponse getTeacherById(Long id) {
        log.info("Fetching teacher with id: {}", id);
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));
        return mapToResponse(teacher);
    }

    @Transactional(readOnly = true)
    public TeacherResponse getTeacherByNip(String nip) {
        log.info("Fetching teacher with NIP: {}", nip);
        Teacher teacher = teacherRepository.findByNip(nip)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with NIP: " + nip));
        return mapToResponse(teacher);
    }

    @Transactional(readOnly = true)
    public TeacherResponse getTeacherByUserId(Long userId) {
        log.info("Fetching teacher with User ID: {}", userId);
        Teacher teacher = teacherRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with User ID: " + userId));
        return mapToResponse(teacher);
    }

    @Transactional
    public TeacherResponse updateTeacher(Long id, TeacherRequest request) {
        log.info("Updating teacher with id: {}", id);

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        teacher.setNip(request.getNip());
        teacher.setFullName(request.getFullName());
        teacher.setGender(request.getGender());
        teacher.setPhotoUrl(request.getPhotoUrl());
        teacher.setPhone(request.getPhone());
        teacher.setEmail(request.getEmail());

        Teacher updated = teacherRepository.save(teacher);
        log.info("Teacher updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteTeacher(Long id) {
        log.info("Deleting teacher with id: {}", id);

        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with id: " + id));

        teacher.setIsActive(false);
        teacherRepository.save(teacher);
        log.info("Teacher deactivated successfully with id: {}", id);
    }

    private TeacherResponse mapToResponse(Teacher teacher) {
        return TeacherResponse.builder()
                .id(teacher.getId())
                .userId(teacher.getUserId())
                .nip(teacher.getNip())
                .fullName(teacher.getFullName())
                .gender(teacher.getGender())
                .photoUrl(teacher.getPhotoUrl())
                .phone(teacher.getPhone())
                .email(teacher.getEmail())
                .isActive(teacher.getIsActive())
                .createdAt(teacher.getCreatedAt())
                .updatedAt(teacher.getUpdatedAt())
                .build();
    }
}