import api from '../api/client';
import type { ApiResponse, AcademicYear, Semester, Department, ClassRoom, Teacher, Subject, TeacherSubject, HomeroomTeacher } from '../types';

export const academicService = {
  getAcademicYears: () => api.get<ApiResponse<AcademicYear[]>>('/api/v1/academic-years').then(r => r.data),
  getActiveAcademicYears: () => api.get<ApiResponse<AcademicYear[]>>('/api/v1/academic-years/active').then(r => r.data),
  getAcademicYear: (id: number) => api.get<ApiResponse<AcademicYear>>(`/api/v1/academic-years/${id}`).then(r => r.data),
  createAcademicYear: (data: { yearName: string }) => api.post<ApiResponse<AcademicYear>>('/api/v1/academic-years', data).then(r => r.data),
  updateAcademicYear: (id: number, data: { yearName: string }) => api.put<ApiResponse<AcademicYear>>(`/api/v1/academic-years/${id}`, data).then(r => r.data),
  deleteAcademicYear: (id: number) => api.delete(`/api/v1/academic-years/${id}`),

  getSemesters: () => api.get<ApiResponse<Semester[]>>('/api/v1/semesters').then(r => r.data),
  getSemestersByYear: (yearId: number) => api.get<ApiResponse<Semester[]>>(`/api/v1/semesters/academic-year/${yearId}`).then(r => r.data),
  createSemester: (data: { academicYearId: number; semesterType: string }) => api.post<ApiResponse<Semester>>('/api/v1/semesters', data).then(r => r.data),
  updateSemester: (id: number, data: { academicYearId: number; semesterType: string }) => api.put<ApiResponse<Semester>>(`/api/v1/semesters/${id}`, data).then(r => r.data),
  deleteSemester: (id: number) => api.delete(`/api/v1/semesters/${id}`),

  getDepartments: () => api.get<ApiResponse<Department[]>>('/api/v1/departments').then(r => r.data),
  getActiveDepartments: () => api.get<ApiResponse<Department[]>>('/api/v1/departments/active').then(r => r.data),
  createDepartment: (data: { code: string; name: string; description?: string }) => api.post<ApiResponse<Department>>('/api/v1/departments', data).then(r => r.data),
  updateDepartment: (id: number, data: { code: string; name: string; description?: string }) => api.put<ApiResponse<Department>>(`/api/v1/departments/${id}`, data).then(r => r.data),
  deleteDepartment: (id: number) => api.delete(`/api/v1/departments/${id}`),

  getClasses: () => api.get<ApiResponse<ClassRoom[]>>('/api/v1/classes').then(r => r.data),
  getClassesByDept: (deptId: number) => api.get<ApiResponse<ClassRoom[]>>(`/api/v1/classes/department/${deptId}`).then(r => r.data),
  createClass: (data: { name: string; departmentId: number; gradeLevel: number; academicYearId?: number }) => api.post<ApiResponse<ClassRoom>>('/api/v1/classes', data).then(r => r.data),
  updateClass: (id: number, data: { name: string; departmentId: number; gradeLevel: number; academicYearId?: number }) => api.put<ApiResponse<ClassRoom>>(`/api/v1/classes/${id}`, data).then(r => r.data),
  deleteClass: (id: number) => api.delete(`/api/v1/classes/${id}`),

  getTeachers: () => api.get<ApiResponse<Teacher[]>>('/api/v1/teachers').then(r => r.data),
  getActiveTeachers: () => api.get<ApiResponse<Teacher[]>>('/api/v1/teachers/active').then(r => r.data),
  createTeacher: (data: Omit<Teacher, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.post<ApiResponse<Teacher>>('/api/v1/teachers', data).then(r => r.data),
  updateTeacher: (id: number, data: Omit<Teacher, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => api.put<ApiResponse<Teacher>>(`/api/v1/teachers/${id}`, data).then(r => r.data),
  deleteTeacher: (id: number) => api.delete(`/api/v1/teachers/${id}`),

  getSubjects: () => api.get<ApiResponse<Subject[]>>('/api/v1/subjects').then(r => r.data),
  getActiveSubjects: () => api.get<ApiResponse<Subject[]>>('/api/v1/subjects/active').then(r => r.data),
  createSubject: (data: { code: string; name: string; description?: string; creditHours?: number }) => api.post<ApiResponse<Subject>>('/api/v1/subjects', data).then(r => r.data),
  updateSubject: (id: number, data: { code: string; name: string; description?: string; creditHours?: number }) => api.put<ApiResponse<Subject>>(`/api/v1/subjects/${id}`, data).then(r => r.data),
  deleteSubject: (id: number) => api.delete(`/api/v1/subjects/${id}`),

  getTeacherSubjects: () => api.get<ApiResponse<TeacherSubject[]>>('/api/v1/teacher-subjects').then(r => r.data),
  createTeacherSubject: (data: { teacherId: number; subjectId: number; academicYearId: number }) => api.post<ApiResponse<TeacherSubject>>('/api/v1/teacher-subjects', data).then(r => r.data),
  deleteTeacherSubject: (id: number) => api.delete(`/api/v1/teacher-subjects/${id}`),

  getHomeroomTeachers: () => api.get<ApiResponse<HomeroomTeacher[]>>('/api/v1/homeroom-teachers').then(r => r.data),
  createHomeroomTeacher: (data: { teacherId: number; classId: number; academicYearId: number }) => api.post<ApiResponse<HomeroomTeacher>>('/api/v1/homeroom-teachers', data).then(r => r.data),
  updateHomeroomTeacher: (id: number, data: { teacherId: number; classId: number; academicYearId: number }) => api.put<ApiResponse<HomeroomTeacher>>(`/api/v1/homeroom-teachers/${id}`, data).then(r => r.data),
  deleteHomeroomTeacher: (id: number) => api.delete(`/api/v1/homeroom-teachers/${id}`),
};
