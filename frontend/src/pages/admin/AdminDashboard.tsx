import { Link } from 'react-router-dom';
import {
  Users, GraduationCap, Calendar, ClipboardCheck,
  FileText, Award, School, Clock, TrendingUp,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';

const quickLinks = [
  { label: 'Master Data', path: '/master/academic-years', icon: <School size={24} />, color: 'bg-blue-500' },
  { label: 'Data Guru', path: '/users/teachers', icon: <Users size={24} />, color: 'bg-green-500' },
  { label: 'Data Siswa', path: '/users/students', icon: <GraduationCap size={24} />, color: 'bg-purple-500' },
  { label: 'Penugasan', path: '/assignments/teacher-subjects', icon: <Users size={24} />, color: 'bg-indigo-500' },
  { label: 'Pendaftaran', path: '/enrollments', icon: <GraduationCap size={24} />, color: 'bg-pink-500' },
  { label: 'Jadwal', path: '/operational/schedules', icon: <Calendar size={24} />, color: 'bg-yellow-500' },
  { label: 'Presensi', path: '/operational/attendance', icon: <ClipboardCheck size={24} />, color: 'bg-orange-500' },
  { label: 'Tugas', path: '/operational/assignments', icon: <FileText size={24} />, color: 'bg-teal-500' },
  { label: 'Nilai', path: '/operational/grades', icon: <Award size={24} />, color: 'bg-red-500' },
  { label: 'Laporan', path: '/reports/statistics', icon: <TrendingUp size={24} />, color: 'bg-indigo-600' },
];

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Dashboard Admin" subtitle="Selamat datang di Sistem Informasi Akademik SMK" />

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className={`${link.color} text-white p-3 rounded-full mb-2`}>
              {link.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users size={16} className="text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">3 guru baru terdaftar</p>
              <p className="text-xs text-gray-500">2 jam yang lalu</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <GraduationCap size={16} className="text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">15 siswa baru terdaftar</p>
              <p className="text-xs text-gray-500">5 jam yang lalu</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Calendar size={16} className="text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Jadwal semester baru dibuat</p>
              <p className="text-xs text-gray-500">1 hari yang lalu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
