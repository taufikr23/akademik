package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.AcademicYearRequest;
import com.taufik.akademik.dto.response.AcademicYearResponse;
import com.taufik.akademik.exception.ResourceNotFoundException;
import com.taufik.akademik.model.AcademicYear;
import com.taufik.akademik.repository.AcademicYearRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AcademicYearService {

    private final AcademicYearRepository academicYearRepository;

    @Transactional
    public AcademicYearResponse createAcademicYear(AcademicYearRequest request) {
        log.info("Creating academic year: {}", request.getYearName());

        if (academicYearRepository.existsByYearName(request.getYearName())) {
            throw new RuntimeException("Academic year " + request.getYearName() + " already exists");
        }

        AcademicYear academicYear = new AcademicYear();
        academicYear.setYearName(request.getYearName());

        AcademicYear saved = academicYearRepository.save(academicYear);
        log.info("Academic year created with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AcademicYearResponse> getAllAcademicYears() {
        return academicYearRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AcademicYearResponse> getActiveAcademicYears() {
        return academicYearRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AcademicYearResponse getAcademicYearById(Long id) {
        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Academic year not found with id: " + id));
        return mapToResponse(academicYear);
    }

    @Transactional
    public AcademicYearResponse updateAcademicYear(Long id, AcademicYearRequest request) {
        log.info("Updating academic year with id: {}", id);

        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Academic year not found with id: " + id));

        if (!academicYear.getYearName().equals(request.getYearName()) &&
                academicYearRepository.existsByYearName(request.getYearName())) {
            throw new RuntimeException("Academic year " + request.getYearName() + " already exists");
        }

        academicYear.setYearName(request.getYearName());
        AcademicYear updated = academicYearRepository.save(academicYear);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteAcademicYear(Long id) {
        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Academic year not found with id: " + id));
        academicYear.setIsActive(false);
        academicYearRepository.save(academicYear);
    }

    private AcademicYearResponse mapToResponse(AcademicYear academicYear) {
        return AcademicYearResponse.builder()
                .id(academicYear.getId())
                .yearName(academicYear.getYearName())
                .isActive(academicYear.getIsActive())
                .semesterCount(academicYear.getSemesters() != null ? academicYear.getSemesters().size() : 0)
                .createdAt(academicYear.getCreatedAt())
                .updatedAt(academicYear.getUpdatedAt())
                .build();
    }
}