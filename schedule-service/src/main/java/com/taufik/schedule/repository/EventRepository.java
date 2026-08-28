package com.taufik.schedule.repository;

import com.taufik.schedule.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByEventType(String eventType);
    List<Event> findByStartDateBetween(LocalDate start, LocalDate end);
    List<Event> findByIsActiveTrue();
    List<Event> findByStartDateAfter(LocalDate date);
}