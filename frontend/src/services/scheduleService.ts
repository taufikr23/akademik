import api from '../api/client';
import type { ApiResponse, Schedule, Event } from '../types';

export const scheduleService = {
  getSchedules: () => api.get<ApiResponse<Schedule[]>>('/api/v1/schedules').then(r => r.data),
  getSchedulesByClass: (classId: number) => api.get<ApiResponse<Schedule[]>>(`/api/v1/schedules/class/${classId}`).then(r => r.data),
  getSchedulesByTeacher: (teacherId: number) => api.get<ApiResponse<Schedule[]>>(`/api/v1/schedules/teacher/${teacherId}`).then(r => r.data),
  createSchedule: (data: Omit<Schedule, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.post<ApiResponse<Schedule>>('/api/v1/schedules', data).then(r => r.data),
  updateSchedule: (id: number, data: Omit<Schedule, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.put<ApiResponse<Schedule>>(`/api/v1/schedules/${id}`, data).then(r => r.data),
  deleteSchedule: (id: number) => api.delete(`/api/v1/schedules/${id}`),

  getEvents: () => api.get<ApiResponse<Event[]>>('/api/v1/events').then(r => r.data),
  getActiveEvents: () => api.get<ApiResponse<Event[]>>('/api/v1/events/active').then(r => r.data),
  getUpcomingEvents: () => api.get<ApiResponse<Event[]>>('/api/v1/events/upcoming').then(r => r.data),
  createEvent: (data: Omit<Event, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.post<ApiResponse<Event>>('/api/v1/events', data).then(r => r.data),
  updateEvent: (id: number, data: Omit<Event, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.put<ApiResponse<Event>>(`/api/v1/events/${id}`, data).then(r => r.data),
  deleteEvent: (id: number) => api.delete(`/api/v1/events/${id}`),
};
