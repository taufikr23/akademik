package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.SubjectRequest;
import com.taufik.akademik.dto.response.SubjectResponse;
import com.taufik.akademik.exception.ResourceNotFoundException;
import com.taufik.akademik.model.Subject;
import com.taufik.akademik.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubjectService {

    private final SubjectRepository subjectRepository;

    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        log.info("Creating new subject with code: {}", request.getCode());

        if (subjectRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Subject with code " + request.getCode() + " already exists");
        }

        Subject subject = new Subject();
        subject.setCode(request.getCode().toUpperCase());
        subject.setName(request.getName());
        subject.setDescription(request.getDescription());
        subject.setCreditHours(request.getCreditHours());

        Subject saved = subjectRepository.save(subject);
        log.info("Subject created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects() {
        log.info("Fetching all subjects");
        return subjectRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SubjectResponse> getActiveSubjects() {
        log.info("Fetching active subjects");
        return subjectRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubjectResponse getSubjectById(Long id) {
        log.info("Fetching subject with id: {}", id);
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        return mapToResponse(subject);
    }

    @Transactional(readOnly = true)
    public SubjectResponse getSubjectByCode(String code) {
        log.info("Fetching subject with code: {}", code);
        Subject subject = subjectRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with code: " + code));
        return mapToResponse(subject);
    }

    @Transactional
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        log.info("Updating subject with id: {}", id);

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));

        if (!subject.getCode().equals(request.getCode()) &&
                subjectRepository.existsByCode(request.getCode())) {
            throw new RuntimeException("Subject with code " + request.getCode() + " already exists");
        }

        subject.setCode(request.getCode().toUpperCase());
        subject.setName(request.getName());
        subject.setDescription(request.getDescription());
        subject.setCreditHours(request.getCreditHours());

        Subject updated = subjectRepository.save(subject);
        log.info("Subject updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteSubject(Long id) {
        log.info("Deleting subject with id: {}", id);

        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));

        subject.setIsActive(false);
        subjectRepository.save(subject);
        log.info("Subject deactivated successfully with id: {}", id);
    }

    private SubjectResponse mapToResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .code(subject.getCode())
                .name(subject.getName())
                .description(subject.getDescription())
                .creditHours(subject.getCreditHours())
                .isActive(subject.getIsActive())
                .createdAt(subject.getCreatedAt())
                .updatedAt(subject.getUpdatedAt())
                .build();
    }
}