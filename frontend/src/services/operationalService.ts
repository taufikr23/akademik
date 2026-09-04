import client from '../api/client';

// ============================================
// OPERASIONAL SERVICE
// ============================================

// Jadwal Pelajaran
export const scheduleService = {
  getAll: () => client.get('/api/schedules'),
  getById: (id: number) => client.get(`/api/schedules/${id}`),
  create: (data: any) => client.post('/api/schedules', data),
  update: (id: number, data: any) => client.put(`/api/schedules/${id}`, data),
  delete: (id: number) => client.delete(`/api/schedules/${id}`),
  getByClass: (classId: number) => client.get(`/api/schedules/class/${classId}`),
  getByTeacher: (teacherId: number) => client.get(`/api/schedules/teacher/${teacherId}`),
};

// Presensi
export const attendanceService = {
  getAll: () => client.get('/api/attendance'),
  getById: (id: number) => client.get(`/api/attendance/${id}`),
  create: (data: any) => client.post('/api/attendance', data),
  update: (id: number, data: any) => client.put(`/api/attendance/${id}`, data),
  delete: (id: number) => client.delete(`/api/attendance/${id}`),
  getByStudent: (studentId: number) => client.get(`/api/attendance/student/${studentId}`),
  // Guru: get their classes
  getTeacherClasses: (teacherId: number) => client.get(`/api/attendance/teacher/${teacherId}/classes`),
  // Guru: get students in a class
  getClassStudents: (classId: number) => client.get(`/api/attendance/class/${classId}/students`),
  // Guru: get existing attendance for class on date
  getClassAttendance: (classId: number, teacherSubjectId: number, date: string) =>
    client.get(`/api/attendance/class/${classId}/teacher-subject/${teacherSubjectId}/date/${date}`),
  // Guru: batch submit attendance
  batchSubmit: (data: any) => client.post('/api/attendance/batch', data),
  // Guru: get attendance history
  getHistory: (classId: number, teacherSubjectId: number) =>
    client.get(`/api/attendance/class/${classId}/teacher-subject/${teacherSubjectId}/history`),
  // Siswa: get attendance summary per subject
  getStudentSummary: (studentId: number) =>
    client.get(`/api/attendance/student/${studentId}/summary`),
  // Siswa: get attendance history for a subject
  getStudentSubjectAttendance: (studentId: number, teacherSubjectId: number) =>
    client.get(`/api/attendance/student/${studentId}/subject/${teacherSubjectId}`),
};

// Tugas
export const assignmentService = {
  getAll: () => client.get('/api/assignment'),
  getById: (id: number) => client.get(`/api/assignment/${id}`),
  create: (data: any) => client.post('/api/assignment', data),
  update: (id: number, data: any) => client.put(`/api/assignment/${id}`, data),
  delete: (id: number) => client.delete(`/api/assignment/${id}`),
  getByClass: (classId: number) => client.get(`/api/assignment/class/${classId}`),
  getBySubject: (subjectId: number) => client.get(`/api/assignment/subject/${subjectId}`),
  getByTeacher: (teacherId: number) => client.get(`/api/assignment/teacher/${teacherId}`),
  getByUsername: (username: string) => client.get(`/api/assignment/teacher/by-username/${username}`),
  getTeacherClasses: (teacherId: number) => client.get(`/api/assignment/teacher/${teacherId}/classes`),
  getTeacherClassesByUsername: (username: string) => client.get(`/api/assignment/teacher/by-username/${username}/classes`),
  getStudentAssignments: (studentId: number) => client.get(`/api/assignment/student/${studentId}`),
  getStudentAssignmentsByUsername: (username: string) => client.get(`/api/assignment/student/by-username/${username}`),
  submit: (assignmentId: number, data: any) =>
    client.post(`/api/assignment/${assignmentId}/submit`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getSubmissions: (assignmentId: number) => client.get(`/api/assignment/${assignmentId}/submissions`),
  gradeSubmission: (submissionId: number, score: number, feedback?: string) =>
    client.put(`/api/assignment/submissions/${submissionId}/grade`, null, { params: { score, feedback } }),
};

// Nilai
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

// Event (Kalender Sekolah)
export const eventService = {
  getAll: () => client.get('/api/events'),
  getById: (id: number) => client.get(`/api/events/${id}`),
  create: (data: any) => client.post('/api/events', data),
  update: (id: number, data: any) => client.put(`/api/events/${id}`, data),
  delete: (id: number) => client.delete(`/api/events/${id}`),
};
