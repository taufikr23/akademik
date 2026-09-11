package com.taufik.akademik.service;

import com.taufik.akademik.dto.request.TeacherRequest;
import com.taufik.akademik.dto.response.TeacherResponse;

import java.util.List;

/**
 * Interface for TeacherService.
 * Demonstrates interface concept in OOP.
 */
public interface TeacherServiceInterface {

    TeacherResponse createTeacher(TeacherRequest request);

    List<TeacherResponse> getAllTeachers();

    List<TeacherResponse> getActiveTeachers();

    TeacherResponse getTeacherById(Long id);

    TeacherResponse getTeacherByNip(String nip);

    TeacherResponse updateTeacher(Long id, TeacherRequest request);

    void deleteTeacher(Long id);

    /**
     * Search teachers by keyword (name or NIP).
     * Case-insensitive search.
     */
    List<TeacherResponse> searchTeachers(String keyword);

    /**
     * Search and sort teachers.
     * @param keyword search term (null for all)
     * @param sortBy field to sort by (name, nip, createdAt)
     * @param order asc or desc
     */
    List<TeacherResponse> searchAndSortTeachers(String keyword, String sortBy, String order);

    /**
     * Method overloading #1: get teachers by department
     */
    List<TeacherResponse> getTeachersByDepartment(Long departmentId);

    /**
     * Method overloading #2: get teachers by department and active status
     * Same method name, different parameters
     */
    List<TeacherResponse> getTeachersByDepartment(Long departmentId, boolean activeOnly);
}
