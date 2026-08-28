import {
  Users, GraduationCap, Calendar,
  ClipboardCheck, FileText, Award, School, Clock, Home,
  UserCheck,
} from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: { label: string; path: string }[];
  onlyHomeroom?: boolean;
}

export const adminMenu: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard/admin', icon: <Home size={20} /> },
  {
    label: 'Manajemen Pengguna', path: '/admin/users', icon: <Users size={20} />,
    children: [
      { label: 'Data Guru', path: '/teachers/list' },
      { label: 'Data Siswa', path: '/students/list' },
    ],
  },
  {
    label: 'Data Akademik', path: '/academic', icon: <School size={20} />,
    children: [
      { label: 'Jurusan', path: '/academic/departments' },
      { label: 'Tahun Ajaran', path: '/academic/years' },
      { label: 'Semester', path: '/academic/semesters' },
      { label: 'Kelas', path: '/academic/classes' },
      { label: 'Mata Pelajaran', path: '/teachers/subjects' },
    ],
  },
  {
    label: 'Penugasan Guru', path: '/teachers', icon: <UserCheck size={20} />,
    children: [
      { label: 'Guru & Mata Pelajaran', path: '/teachers/assignments' },
      { label: 'Wali Kelas', path: '/teachers/homeroom' },
    ],
  },
  { label: 'Pendaftaran Siswa', path: '/students/enrollments', icon: <GraduationCap size={20} /> },
  { label: 'Jadwal Pelajaran', path: '/schedules', icon: <Calendar size={20} /> },
  { label: 'Kalender Sekolah', path: '/events', icon: <Clock size={20} /> },
  { label: 'Presensi', path: '/attendance', icon: <ClipboardCheck size={20} /> },
  { label: 'Tugas', path: '/assignments', icon: <FileText size={20} /> },
  { label: 'Nilai', path: '/grades', icon: <Award size={20} /> },
];

export const teacherMenu: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard/guru', icon: <Home size={20} /> },
  { label: 'Daftar Siswa', path: '/students/list', icon: <GraduationCap size={20} /> },
  { label: 'Jadwal Mengajar', path: '/schedules', icon: <Calendar size={20} /> },
  { label: 'Presensi', path: '/attendance', icon: <ClipboardCheck size={20} /> },
  { label: 'Tugas', path: '/assignments', icon: <FileText size={20} /> },
  { label: 'Nilai', path: '/grades', icon: <Award size={20} /> },
];

export const studentMenu: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard/siswa', icon: <Home size={20} /> },
  { label: 'Jadwal Pelajaran', path: '/schedules', icon: <Calendar size={20} /> },
  { label: 'Kalender Sekolah', path: '/events', icon: <Clock size={20} /> },
  { label: 'Tugas', path: '/assignments', icon: <FileText size={20} /> },
  { label: 'Presensi Saya', path: '/attendance', icon: <ClipboardCheck size={20} /> },
  { label: 'Nilai Saya', path: '/grades', icon: <Award size={20} /> },
];

export function getMenuByRole(role: string, isHomeroom?: boolean): NavItem[] {
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
