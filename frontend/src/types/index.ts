export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  id: number;
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

// ============================================
// MASTER DATA
// ============================================

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

export interface Subject {
  id: number;
  code: string;
  name: string;
  description: string;
  creditHours: number;
  jenis: 'UMUM' | 'KEJURUAN';
  departmentId?: number;
  departmentName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// USER MANAGEMENT
// ============================================

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

// ============================================
// PENUGASAN
// ============================================

export interface TeacherSubject {
  id: number;
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName: string;
  academicYearId: number;
  academicYearName: string;
  classId?: number;
  className?: string;
  departmentName?: string;
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  room?: string;
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

// ============================================
// ENROLLMENT
// ============================================

export interface StudentEnrollment {
  id: number;
  studentId: number;
  studentName: string;
  studentNis: string;
  classId: number;
  className: string;
  academicYearId: number;
  academicYearName: string;
  semesterId: number;
  semesterName: string;
  status: string;
  createdAt: string;
}

// ============================================
// OPERASIONAL
// ============================================

export interface Schedule {
  id: number;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName: string;
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
  studentName: string;
  scheduleId: number;
  className: string;
  subjectName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';
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
  subjectName: string;
  teacherId: number;
  teacherName: string;
  classId: number;
  className: string;
  dueDate: string;
  maxScore: number;
  assignmentType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// NILAI (Dengan Komponen)
// ============================================

export interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  semesterId: number;
  semesterName: string;
  tugasScore: number;  // Nilai Tugas (30%)
  utsScore: number;    // Nilai UTS (30%)
  uasScore: number;    // Nilai UAS (40%)
  finalScore: number;  // Nilai Akhir
  predikat: string;    // A, B+, B, C+, C, D, E
  comments: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// LAPORAN
// ============================================

export interface AttendanceSummary {
  studentId: number;
  studentName: string;
  className: string;
  totalDays: number;
  present: number;
  sick: number;
  leave: number;
  absent: number;
  attendanceRate: number;
}

export interface GradeSummary {
  studentId: number;
  studentName: string;
  className: string;
  subjectName: string;
  tugasScore: number;
  utsScore: number;
  uasScore: number;
  finalScore: number;
  predikat: string;
}

export interface SchoolStatistics {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  attendanceRate: number;
  averageGrade: number;
  gradeDistribution: {
    A: number;
    BPlus: number;
    B: number;
    CPlus: number;
    C: number;
    D: number;
    E: number;
  };
  attendanceDistribution: {
    present: number;
    sick: number;
    leave: number;
    absent: number;
  };
}
