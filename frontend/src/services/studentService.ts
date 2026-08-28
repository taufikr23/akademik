import api from '../api/client';
import type { ApiResponse, Student, StudentEnrollment } from '../types';

export const studentService = {
  getStudents: () => api.get<ApiResponse<Student[]>>('/api/v1/students').then(r => r.data),
  getActiveStudents: () => api.get<ApiResponse<Student[]>>('/api/v1/students/active').then(r => r.data),
  getStudent: (id: number) => api.get<ApiResponse<Student>>(`/api/v1/students/${id}`).then(r => r.data),
  createStudent: (data: Omit<Student, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.post<ApiResponse<Student>>('/api/v1/students', data).then(r => r.data),
  updateStudent: (id: number, data: Omit<Student, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.put<ApiResponse<Student>>(`/api/v1/students/${id}`, data).then(r => r.data),
  deleteStudent: (id: number) => api.delete(`/api/v1/students/${id}`),

  getEnrollments: () => api.get<ApiResponse<StudentEnrollment[]>>('/api/v1/enrollments').then(r => r.data),
  getEnrollmentsByStudent: (studentId: number) => api.get<ApiResponse<StudentEnrollment[]>>(`/api/v1/enrollments/student/${studentId}`).then(r => r.data),
  getEnrollmentsByClass: (classId: number) => api.get<ApiResponse<StudentEnrollment[]>>(`/api/v1/enrollments/class/${classId}`).then(r => r.data),
  createEnrollment: (data: { studentId: number; classId: number; academicYearId: number; status?: string }) => api.post<ApiResponse<StudentEnrollment>>('/api/v1/enrollments', data).then(r => r.data),
  updateEnrollmentStatus: (id: number, status: string) => api.put<ApiResponse<StudentEnrollment>>(`/api/v1/enrollments/${id}/status?status=${status}`).then(r => r.data),
  deleteEnrollment: (id: number) => api.delete(`/api/v1/enrollments/${id}`),
};
