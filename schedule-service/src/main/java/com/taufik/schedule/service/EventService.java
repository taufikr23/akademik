package com.taufik.schedule.service;

import com.taufik.schedule.dto.request.EventRequest;
import com.taufik.schedule.dto.response.EventResponse;
import com.taufik.schedule.exception.ResourceNotFoundException;
import com.taufik.schedule.model.Event;
import com.taufik.schedule.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventService {

    private final EventRepository eventRepository;

    @Transactional
    public EventResponse createEvent(EventRequest request) {
        log.info("Creating event: {}", request.getTitle());

        Event event = new Event();
        event.setTitle(request.getTitle());
        event.setEventType(request.getEventType());
        event.setDescription(request.getDescription());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());

        Event saved = eventRepository.save(event);
        log.info("Event created successfully with id: {}", saved.getId());

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getAllEvents() {
        log.info("Fetching all events");
        return eventRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getActiveEvents() {
        log.info("Fetching active events");
        return eventRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsByType(String eventType) {
        log.info("Fetching events by type: {}", eventType);
        return eventRepository.findByEventType(eventType).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getEventsInDateRange(LocalDate start, LocalDate end) {
        log.info("Fetching events between: {} and {}", start, end);
        return eventRepository.findByStartDateBetween(start, end).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getUpcomingEvents() {
        log.info("Fetching upcoming events");
        return eventRepository.findByStartDateAfter(LocalDate.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        return mapToResponse(event);
    }

    @Transactional
    public EventResponse updateEvent(Long id, EventRequest request) {
        log.info("Updating event with id: {}", id);

        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));

        event.setTitle(request.getTitle());
        event.setEventType(request.getEventType());
        event.setDescription(request.getDescription());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());

        Event updated = eventRepository.save(event);
        log.info("Event updated successfully with id: {}", updated.getId());

        return mapToResponse(updated);
    }

    @Transactional
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
        event.setIsActive(false);
        eventRepository.save(event);
        log.info("Event deactivated successfully with id: {}", id);
    }

    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .eventType(event.getEventType())
                .description(event.getDescription())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .isActive(event.getIsActive())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
}