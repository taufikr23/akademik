import api from '../api/client';
import type { ApiResponse, Attendance } from '../types';

export const attendanceService = {
  getAttendances: () => api.get<ApiResponse<Attendance[]>>('/api/v1/attendance').then(r => r.data),
  getAttendance: (id: number) => api.get<ApiResponse<Attendance>>(`/api/v1/attendance/${id}`).then(r => r.data),
  getByStudent: (studentId: number) => api.get<ApiResponse<Attendance[]>>(`/api/v1/attendance/student/${studentId}`).then(r => r.data),
  getBySchedule: (scheduleId: number) => api.get<ApiResponse<Attendance[]>>(`/api/v1/attendance/schedule/${scheduleId}`).then(r => r.data),
  create: (data: Omit<Attendance, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.post<ApiResponse<Attendance>>('/api/v1/attendance', data).then(r => r.data),
  update: (id: number, data: Omit<Attendance, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.put<ApiResponse<Attendance>>(`/api/v1/attendance/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/v1/attendance/${id}`),
};
