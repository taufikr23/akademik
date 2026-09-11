package com.taufik.akademik.repository;

import com.taufik.akademik.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByNip(String nip);
    Optional<Teacher> findByUserId(Long userId);
    List<Teacher> findByIsActiveTrue();

    /**
     * Search teachers by name or NIP (case-insensitive).
     */
    @Query("SELECT t FROM Teacher t WHERE LOWER(t.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.nip) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Teacher> searchByKeyword(@Param("keyword") String keyword);

    /**
     * Search teachers by keyword and filter active status.
     */
    @Query("SELECT t FROM Teacher t WHERE (LOWER(t.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.nip) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND t.isActive = :active")
    List<Teacher> searchByKeywordAndActive(@Param("keyword") String keyword, @Param("active") Boolean active);
}