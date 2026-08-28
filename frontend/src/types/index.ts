export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  token: string | null;
  username: string;
  role: string;
  isActive: boolean;
}

export interface User {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
}

export interface AcademicYear {
  id: number;
  yearName: string;
  isActive: boolean;
  semesterCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Semester {
  id: number;
  academicYearId: number;
  academicYearName: string;
  semesterType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  classCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassRoom {
  id: number;
  name: string;
  departmentId: number;
  departmentName: string;
  gradeLevel: number;
  academicYearId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: number;
  userId: number;
  nip: string;
  fullName: string;
  gender: string;
  photoUrl: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: number;
  code: string;
  name: string;
  description: string;
  creditHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherSubject {
  id: number;
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName: string;
  academicYearId: number;
  academicYearName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HomeroomTeacher {
  id: number;
  teacherId: number;
  teacherName: string;
  classId: number;
  className: string;
  academicYearId: number;
  academicYearName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: number;
  userId: number;
  nis: string;
  nisn: string;
  fullName: string;
  gender: string;
  photoUrl: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentEnrollment {
  id: number;
  studentId: number;
  studentName: string;
  studentNis: string;
  classId: number;
  academicYearId: number;
  status: string;
  createdAt: string;
}

export interface Schedule {
  id: number;
  classId: number;
  teacherId: number;
  subjectId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  title: string;
  eventType: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  id: number;
  studentId: number;
  scheduleId: number;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  location: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  teacherId: number;
  classId: number;
  dueDate: string;
  maxScore: number;
  assignmentType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Grade {
  id: number;
  studentId: number;
  assignmentId: number;
  subjectId: number;
  score: number;
  grade: string;
  comments: string;
  semester: string;
  academicYear: string;
  gradeType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
