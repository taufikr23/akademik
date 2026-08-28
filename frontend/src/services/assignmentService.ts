import api from '../api/client';
import type { ApiResponse, Assignment } from '../types';

export const assignmentService = {
  getAssignments: () => api.get<ApiResponse<Assignment[]>>('/api/v1/assignment').then(r => r.data),
  getAssignment: (id: number) => api.get<ApiResponse<Assignment>>(`/api/v1/assignment/${id}`).then(r => r.data),
  getBySubject: (subjectId: number) => api.get<ApiResponse<Assignment[]>>(`/api/v1/assignment/subject/${subjectId}`).then(r => r.data),
  getByTeacher: (teacherId: number) => api.get<ApiResponse<Assignment[]>>(`/api/v1/assignment/teacher/${teacherId}`).then(r => r.data),
  getByClass: (classId: number) => api.get<ApiResponse<Assignment[]>>(`/api/v1/assignment/class/${classId}`).then(r => r.data),
  create: (data: Omit<Assignment, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.post<ApiResponse<Assignment>>('/api/v1/assignment', data).then(r => r.data),
  update: (id: number, data: Omit<Assignment, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.put<ApiResponse<Assignment>>(`/api/v1/assignment/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/v1/assignment/${id}`),
};
