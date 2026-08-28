package com.taufik.assignment.service;

import com.taufik.assignment.dto.request.AssignmentRequest;
import com.taufik.assignment.dto.response.AssignmentResponse;
import com.taufik.assignment.exception.ResourceNotFoundException;
import com.taufik.assignment.model.Assignment;
import com.taufik.assignment.repository.AssignmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

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
    public List<AssignmentResponse> getAssignmentsByTeacherId(Long teacherId) {
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
                .isActive(assignment.getIsActive())
                .createdAt(assignment.getCreatedAt())
                .updatedAt(assignment.getUpdatedAt())
                .build();
    }
}
