import {
  Users, GraduationCap, Calendar,
  ClipboardCheck, FileText, Award, School, Clock, Home,
  UserCheck, BookOpen, BarChart3, Settings,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: { label: string; path: string }[];
}

// ============================================
// MENU ADMIN - Akses ke semua fitur
// ============================================
export const adminMenu: NavItem[] = [
  // Dashboard
  { label: 'Dashboard', path: '/dashboard/admin', icon: <Home size={20} /> },

  // Master Data (Data Induk Sekolah)
  {
    label: 'Master Data', path: '/master', icon: <School size={20} />,
    children: [
      { label: 'Tahun Ajaran', path: '/master/academic-years' },
      { label: 'Semester', path: '/master/semesters' },
      { label: 'Jurusan', path: '/master/departments' },
      { label: 'Kelas', path: '/master/classes' },
      { label: 'Mata Pelajaran', path: '/master/subjects' },
    ],
  },

  // Manajemen Pengguna
  {
    label: 'Pengguna', path: '/users', icon: <Users size={20} />,
    children: [
      { label: 'Data Guru', path: '/users/teachers' },
      { label: 'Data Siswa', path: '/users/students' },
    ],
  },

  // Penugasan
  {
    label: 'Penugasan', path: '/assignments', icon: <UserCheck size={20} />,
    children: [
      { label: 'Guru & Mata Pelajaran', path: '/assignments/teacher-subjects' },
      { label: 'Wali Kelas', path: '/assignments/homeroom' },
    ],
  },

  // Pendaftaran Siswa
  { label: 'Pendaftaran Siswa', path: '/enrollments', icon: <GraduationCap size={20} /> },
  { label: 'Persetujuan Pendaftaran', path: '/admin/approvals', icon: <UserCheck size={20} /> },

  // Operasional
  {
    label: 'Operasional', path: '/operational', icon: <BookOpen size={20} />,
    children: [
      { label: 'Jadwal Pelajaran', path: '/operational/schedules' },
      { label: 'Presensi', path: '/operational/attendance' },
      { label: 'Tugas', path: '/operational/assignments' },
      { label: 'Nilai', path: '/operational/grades' },
    ],
  },

  // Laporan
  {
    label: 'Laporan', path: '/reports', icon: <BarChart3 size={20} />,
    children: [
      { label: 'Statistik Sekolah', path: '/reports/statistics' },
      { label: 'Rekap Kehadiran', path: '/reports/attendance-summary' },
      { label: 'Rekap Nilai', path: '/reports/grade-summary' },
    ],
  },
];

// ============================================
// MENU GURU - Akses terbatas
// ============================================
export const teacherMenu: NavItem[] = [
  // Dashboard
  { label: 'Dashboard', path: '/dashboard/guru', icon: <Home size={20} /> },

  // Menu Utama Guru
  { label: 'Jadwal Mengajar', path: '/operational/schedules', icon: <Calendar size={20} /> },
  { label: 'Daftar Siswa', path: '/users/students', icon: <GraduationCap size={20} /> },

  // Operasional
  {
    label: 'Operasional', path: '/operational', icon: <BookOpen size={20} />,
    children: [
      { label: 'Presensi Siswa', path: '/operational/attendance' },
      { label: 'Buat Tugas', path: '/operational/assignments' },
      { label: 'Input Nilai', path: '/operational/grades' },
    ],
  },
];

// ============================================
// MENU SISWA - Akses terbatas
// ============================================
export const studentMenu: NavItem[] = [
  // Dashboard
  { label: 'Dashboard', path: '/dashboard/siswa', icon: <Home size={20} /> },

  // Menu Utama Siswa
  { label: 'Jadwal Pelajaran', path: '/operational/schedules', icon: <Calendar size={20} /> },
  { label: 'Presensi Saya', path: '/operational/attendance', icon: <ClipboardCheck size={20} /> },
  { label: 'Tugas Saya', path: '/operational/assignments', icon: <FileText size={20} /> },
  { label: 'Nilai Saya', path: '/operational/grades', icon: <Award size={20} /> },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getMenuByRole(role: string): NavItem[] {
  switch (role) {
    case 'ADMIN':
      return adminMenu;
    case 'GURU':
      return teacherMenu;
    case 'SISWA':
      return studentMenu;
    default:
      return [];
  }
}

export function getDashboardRedirect(role: string): string {
  switch (role) {
    case 'ADMIN': return '/dashboard/admin';
    case 'GURU': return '/dashboard/guru';
    case 'SISWA': return '/dashboard/siswa';
    default: return '/login';
  }
}
