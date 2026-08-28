package com.taufik.schedule.controller;

import com.taufik.schedule.dto.request.EventRequest;
import com.taufik.schedule.dto.response.ApiResponse;
import com.taufik.schedule.dto.response.EventResponse;
import com.taufik.schedule.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
@Slf4j
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @Valid @RequestBody EventRequest request) {
        log.info("POST /api/v1/events - Create event: {}", request.getTitle());
        EventResponse response = eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Event created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents() {
        log.info("GET /api/v1/events - Get all events");
        return ResponseEntity.ok(ApiResponse.success(eventService.getAllEvents()));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getActiveEvents() {
        log.info("GET /api/v1/events/active - Get active events");
        return ResponseEntity.ok(ApiResponse.success(eventService.getActiveEvents()));
    }

    @GetMapping("/type/{eventType}")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getEventsByType(
            @PathVariable String eventType) {
        log.info("GET /api/v1/events/type/{} - Get events by type", eventType);
        return ResponseEntity.ok(ApiResponse.success(eventService.getEventsByType(eventType)));
    }

    @GetMapping("/range")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getEventsInDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        log.info("GET /api/v1/events/range - Get events between {} and {}", start, end);
        return ResponseEntity.ok(ApiResponse.success(eventService.getEventsInDateRange(start, end)));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getUpcomingEvents() {
        log.info("GET /api/v1/events/upcoming - Get upcoming events");
        return ResponseEntity.ok(ApiResponse.success(eventService.getUpcomingEvents()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEventById(
            @PathVariable Long id) {
        log.info("GET /api/v1/events/{} - Get event by id", id);
        return ResponseEntity.ok(ApiResponse.success(eventService.getEventById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request) {
        log.info("PUT /api/v1/events/{} - Update event", id);
        EventResponse response = eventService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Event updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id) {
        log.info("DELETE /api/v1/events/{} - Delete event", id);
        eventService.deleteEvent(id);
        return ResponseEntity.ok(ApiResponse.success("Event deleted successfully", null));
    }
}