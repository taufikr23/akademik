import api from '../api/client';
import type { ApiResponse, Grade } from '../types';

export const gradeService = {
  getGrades: () => api.get<ApiResponse<Grade[]>>('/api/v1/grade').then(r => r.data),
  getGrade: (id: number) => api.get<ApiResponse<Grade>>(`/api/v1/grade/${id}`).then(r => r.data),
  getByStudent: (studentId: number) => api.get<ApiResponse<Grade[]>>(`/api/v1/grade/student/${studentId}`).then(r => r.data),
  getBySubject: (subjectId: number) => api.get<ApiResponse<Grade[]>>(`/api/v1/grade/subject/${subjectId}`).then(r => r.data),
  getByAssignment: (assignmentId: number) => api.get<ApiResponse<Grade[]>>(`/api/v1/grade/assignment/${assignmentId}`).then(r => r.data),
  create: (data: Omit<Grade, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.post<ApiResponse<Grade>>('/api/v1/grade', data).then(r => r.data),
  update: (id: number, data: Omit<Grade, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.put<ApiResponse<Grade>>(`/api/v1/grade/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/v1/grade/${id}`),
};
