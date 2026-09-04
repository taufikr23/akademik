import client from '../api/client';

// ============================================
// BACKWARD COMPATIBLE SERVICE
// ============================================
export const academicService = {
  // Academic Years
  getAcademicYears: () => academicYearService.getAll(),
  createAcademicYear: (data: any) => academicYearService.create(data),
  updateAcademicYear: (id: number, data: any) => academicYearService.update(id, data),
  deleteAcademicYear: (id: number) => academicYearService.delete(id),
  
  // Semesters
  getSemesters: () => semesterService.getAll(),
  createSemester: (data: any) => semesterService.create(data),
  updateSemester: (id: number, data: any) => semesterService.update(id, data),
  deleteSemester: (id: number) => semesterService.delete(id),
  
  // Departments
  getDepartments: () => departmentService.getAll(),
  createDepartment: (data: any) => departmentService.create(data),
  updateDepartment: (id: number, data: any) => departmentService.update(id, data),
  deleteDepartment: (id: number) => departmentService.delete(id),
  
  // Classes
  getClasses: () => classService.getAll(),
  createClass: (data: any) => classService.create(data),
  updateClass: (id: number, data: any) => classService.update(id, data),
  deleteClass: (id: number) => classService.delete(id),
  
  // Subjects
  getSubjects: () => subjectService.getAll(),
  createSubject: (data: any) => subjectService.create(data),
  updateSubject: (id: number, data: any) => subjectService.update(id, data),
  deleteSubject: (id: number) => subjectService.delete(id),
  
  // Teachers
  getTeachers: () => teacherService.getAll(),
  createTeacher: (data: any) => teacherService.create(data),
  updateTeacher: (id: number, data: any) => teacherService.update(id, data),
  deleteTeacher: (id: number) => teacherService.delete(id),
  
  // Students
  getStudents: () => studentService.getAll(),
  createStudent: (data: any) => studentService.create(data),
  updateStudent: (id: number, data: any) => studentService.update(id, data),
  deleteStudent: (id: number) => studentService.delete(id),
  
  // Teacher Subjects
  getTeacherSubjects: () => teacherSubjectService.getAll(),
  createTeacherSubject: (data: any) => teacherSubjectService.create(data),
  updateTeacherSubject: (id: number, data: any) => teacherSubjectService.update(id, data),
  deleteTeacherSubject: (id: number) => teacherSubjectService.delete(id),
  
  // Homeroom Teachers
  getHomeroomTeachers: () => homeroomTeacherService.getAll(),
  createHomeroomTeacher: (data: any) => homeroomTeacherService.create(data),
  updateHomeroomTeacher: (id: number, data: any) => homeroomTeacherService.update(id, data),
  deleteHomeroomTeacher: (id: number) => homeroomTeacherService.delete(id),
  
  // Enrollments
  getEnrollments: () => enrollmentService.getAll(),
  createEnrollment: (data: any) => enrollmentService.create(data),
  updateEnrollment: (id: number, data: any) => enrollmentService.update(id, data),
  deleteEnrollment: (id: number) => enrollmentService.delete(id),
  
  // Grades
  getGrades: () => gradeService.getAll(),
  createGrade: (data: any) => gradeService.create(data),
  updateGrade: (id: number, data: any) => gradeService.update(id, data),
  deleteGrade: (id: number) => gradeService.delete(id),
};

// ============================================
// MASTER DATA SERVICE
// ============================================

// Tahun Ajaran
export const academicYearService = {
  getAll: () => client.get('/api/academic-years'),
  getById: (id: number) => client.get(`/api/academic-years/${id}`),
  create: (data: any) => client.post('/api/academic-years', data),
  update: (id: number, data: any) => client.put(`/api/academic-years/${id}`, data),
  delete: (id: number) => client.delete(`/api/academic-years/${id}`),
};

// Semester
export const semesterService = {
  getAll: () => client.get('/api/semesters'),
  getById: (id: number) => client.get(`/api/semesters/${id}`),
  create: (data: any) => client.post('/api/semesters', data),
  update: (id: number, data: any) => client.put(`/api/semesters/${id}`, data),
  delete: (id: number) => client.delete(`/api/semesters/${id}`),
};

// Jurusan (Departments)
export const departmentService = {
  getAll: () => client.get('/api/departments'),
  getById: (id: number) => client.get(`/api/departments/${id}`),
  create: (data: any) => client.post('/api/departments', data),
  update: (id: number, data: any) => client.put(`/api/departments/${id}`, data),
  delete: (id: number) => client.delete(`/api/departments/${id}`),
};

// Kelas
export const classService = {
  getAll: () => client.get('/api/classes'),
  getById: (id: number) => client.get(`/api/classes/${id}`),
  create: (data: any) => client.post('/api/classes', data),
  update: (id: number, data: any) => client.put(`/api/classes/${id}`, data),
  delete: (id: number) => client.delete(`/api/classes/${id}`),
};

// Mata Pelajaran
export const subjectService = {
  getAll: () => client.get('/api/subjects'),
  getById: (id: number) => client.get(`/api/subjects/${id}`),
  create: (data: any) => client.post('/api/subjects', data),
  update: (id: number, data: any) => client.put(`/api/subjects/${id}`, data),
  delete: (id: number) => client.delete(`/api/subjects/${id}`),
};

// Guru
export const teacherService = {
  getAll: () => client.get('/api/teachers'),
  getById: (id: number) => client.get(`/api/teachers/${id}`),
  create: (data: any) => client.post('/api/teachers', data),
  update: (id: number, data: any) => client.put(`/api/teachers/${id}`, data),
  delete: (id: number) => client.delete(`/api/teachers/${id}`),
};

// Siswa
export const studentService = {
  getAll: () => client.get('/api/students'),
  getById: (id: number) => client.get(`/api/students/${id}`),
  create: (data: any) => client.post('/api/students', data),
  update: (id: number, data: any) => client.put(`/api/students/${id}`, data),
  delete: (id: number) => client.delete(`/api/students/${id}`),
};

// Guru & Mata Pelajaran (Penugasan)
export const teacherSubjectService = {
  getAll: () => client.get('/api/teacher-subjects'),
  getById: (id: number) => client.get(`/api/teacher-subjects/${id}`),
  getByClass: (classId: number) => client.get(`/api/teacher-subjects/class/${classId}`),
  getByTeacher: (teacherId: number) => client.get(`/api/teacher-subjects/teacher/${teacherId}`),
  create: (data: any) => client.post('/api/teacher-subjects', data),
  update: (id: number, data: any) => client.put(`/api/teacher-subjects/${id}`, data),
  delete: (id: number) => client.delete(`/api/teacher-subjects/${id}`),
};

// Wali Kelas
export const homeroomTeacherService = {
  getAll: () => client.get('/api/homeroom-teachers'),
  getById: (id: number) => client.get(`/api/homeroom-teachers/${id}`),
  create: (data: any) => client.post('/api/homeroom-teachers', data),
  update: (id: number, data: any) => client.put(`/api/homeroom-teachers/${id}`, data),
  delete: (id: number) => client.delete(`/api/homeroom-teachers/${id}`),
};

// Enrollment (Pendaftaran Siswa)
export const enrollmentService = {
  getAll: () => client.get('/api/enrollments'),
  getById: (id: number) => client.get(`/api/enrollments/${id}`),
  create: (data: any) => client.post('/api/enrollments', data),
  update: (id: number, data: any) => client.put(`/api/enrollments/${id}`, data),
  delete: (id: number) => client.delete(`/api/enrollments/${id}`),
};

// Nilai (Grade)
export const gradeService = {
  getAll: () => client.get('/api/grades'),
  getById: (id: number) => client.get(`/api/grades/${id}`),
  create: (data: any) => client.post('/api/grades', data),
  update: (id: number, data: any) => client.put(`/api/grades/${id}`, data),
  delete: (id: number) => client.delete(`/api/grades/${id}`),
  getByStudent: (studentId: number) => client.get(`/api/grades/student/${studentId}`),
  getByClass: (classId: number) => client.get(`/api/grades/class/${classId}`),
  getBySubject: (subjectId: number) => client.get(`/api/grades/subject/${subjectId}`),
  getBySemester: (semesterId: number) => client.get(`/api/grades/semester/${semesterId}`),
};
