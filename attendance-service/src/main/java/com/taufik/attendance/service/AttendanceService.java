package com.taufik.attendance.service;

import com.taufik.attendance.dto.request.AttendanceRequest;
import com.taufik.attendance.dto.response.AttendanceResponse;
import com.taufik.attendance.exception.ResourceNotFoundException;
import com.taufik.attendance.model.Attendance;
import com.taufik.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    @Transactional
    public AttendanceResponse createAttendance(AttendanceRequest request) {
        log.info("Creating attendance for student: {} schedule: {}", request.getStudentId(), request.getScheduleId());

        if (attendanceRepository.existsByStudentIdAndScheduleIdAndDate(
                request.getStudentId(), request.getScheduleId(), request.getDate())) {
            throw new RuntimeException("Attendance already exists for student " + request.getStudentId()
                    + " on schedule " + request.getScheduleId() + " date " + request.getDate());
        }

        Attendance attendance = new Attendance();
        attendance.setStudentId(request.getStudentId());
        attendance.setScheduleId(request.getScheduleId());
        attendance.setDate(request.getDate());
        attendance.setCheckInTime(request.getCheckInTime());
        attendance.setCheckOutTime(request.getCheckOutTime());
        attendance.setStatus(request.getStatus());
        attendance.setLocation(request.getLocation());
        attendance.setNotes(request.getNotes());

        Attendance saved = attendanceRepository.save(attendance);
        log.info("Attendance created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
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

    @Transactional(readOnly = true)
    public List<AttendanceResponse> getAttendancesByScheduleId(Long scheduleId) {
        return attendanceRepository.findByScheduleId(scheduleId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceResponse updateAttendance(Long id, AttendanceRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));

        attendance.setStudentId(request.getStudentId());
        attendance.setScheduleId(request.getScheduleId());
        attendance.setDate(request.getDate());
        attendance.setCheckInTime(request.getCheckInTime());
        attendance.setCheckOutTime(request.getCheckOutTime());
        attendance.setStatus(request.getStatus());
        attendance.setLocation(request.getLocation());
        attendance.setNotes(request.getNotes());

        Attendance updated = attendanceRepository.save(attendance);
        log.info("Attendance updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteAttendance(Long id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with id: " + id));
        attendance.setIsActive(false);
        attendanceRepository.save(attendance);
        log.info("Attendance deactivated successfully with id: {}", id);
    }

    private AttendanceResponse mapToResponse(Attendance attendance) {
        return AttendanceResponse.builder()
                .id(attendance.getId())
                .studentId(attendance.getStudentId())
                .scheduleId(attendance.getScheduleId())
                .date(attendance.getDate())
                .checkInTime(attendance.getCheckInTime())
                .checkOutTime(attendance.getCheckOutTime())
                .status(attendance.getStatus())
                .location(attendance.getLocation())
                .notes(attendance.getNotes())
                .isActive(attendance.getIsActive())
                .createdAt(attendance.getCreatedAt())
                .updatedAt(attendance.getUpdatedAt())
                .build();
    }
}
