package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.SemesterRequest;
import com.taufik.akademik.dto.response.SemesterResponse;
import com.taufik.akademik.exception.ResourceNotFoundException;
import com.taufik.akademik.model.AcademicYear;
import com.taufik.akademik.model.Semester;
import com.taufik.akademik.repository.AcademicYearRepository;
import com.taufik.akademik.repository.SemesterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SemesterService {

    private final SemesterRepository semesterRepository;
    private final AcademicYearRepository academicYearRepository;

    @Transactional
    public SemesterResponse createSemester(SemesterRequest request) {
        log.info("Creating semester: {} for academic year: {}", request.getSemesterType(), request.getAcademicYearId());

        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic year not found with id: " + request.getAcademicYearId()));

        if (semesterRepository.existsByAcademicYearIdAndSemesterType(request.getAcademicYearId(), request.getSemesterType())) {
            throw new RuntimeException("Semester " + request.getSemesterType() + " already exists for this academic year");
        }

        Semester semester = new Semester();
        semester.setAcademicYear(academicYear);
        semester.setSemesterType(request.getSemesterType().toUpperCase());

        Semester saved = semesterRepository.save(semester);
        log.info("Semester created with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SemesterResponse> getAllSemesters() {
        return semesterRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SemesterResponse> getSemestersByAcademicYear(Long academicYearId) {
        return semesterRepository.findByAcademicYearId(academicYearId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SemesterResponse getSemesterById(Long id) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found with id: " + id));
        return mapToResponse(semester);
    }

    @Transactional
    public SemesterResponse updateSemester(Long id, SemesterRequest request) {
        log.info("Updating semester with id: {}", id);

        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found with id: " + id));

        AcademicYear academicYear = academicYearRepository.findById(request.getAcademicYearId())
                .orElseThrow(() -> new ResourceNotFoundException("Academic year not found with id: " + request.getAcademicYearId()));

        semester.setAcademicYear(academicYear);
        semester.setSemesterType(request.getSemesterType().toUpperCase());

        Semester updated = semesterRepository.save(semester);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteSemester(Long id) {
        Semester semester = semesterRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Semester not found with id: " + id));
        semester.setIsActive(false);
        semesterRepository.save(semester);
    }

    private SemesterResponse mapToResponse(Semester semester) {
        return SemesterResponse.builder()
                .id(semester.getId())
                .academicYearId(semester.getAcademicYear().getId())
                .academicYearName(semester.getAcademicYear().getYearName())
                .semesterType(semester.getSemesterType())
                .isActive(semester.getIsActive())
                .createdAt(semester.getCreatedAt())
                .updatedAt(semester.getUpdatedAt())
                .build();
    }
}