package com.taufik.akademik.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Abstract base entity class for all academic entities.
 * Provides common fields: id, isActive, createdAt, updatedAt.
 * Demonstrates abstract class concept in OOP.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Abstract method to be implemented by subclasses.
     * Returns the display name of the entity.
     */
    public abstract String getDisplayName();

    /**
     * Method overloading #1: check if entity is active
     */
    public boolean isActive() {
        return Boolean.TRUE.equals(this.isActive);
    }

    /**
     * Method overloading #2: set active status with boolean parameter
     * Same method name, different parameter type
     */
    public void setActive(boolean active) {
        this.isActive = active;
    }

    /**
     * Method overloading #3: toggle active status (no parameter)
     * Same method name, different parameter count
     */
    public void setActive() {
        this.isActive = !Boolean.TRUE.equals(this.isActive);
    }
}
