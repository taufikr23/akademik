import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, GraduationCap, Calendar, ClipboardCheck,
  FileText, Award, School, Clock, Bell
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import smkBisaLogo from '../../assets/smk-bisa.png';
import { authService } from '../../services/authService';

const quickLinks = [
  { label: 'Master Data', path: '/master/academic-years', icon: <School size={24} />, color: 'bg-primary-600' },
  { label: 'Data Guru', path: '/users/teachers', icon: <Users size={24} />, color: 'bg-emerald-600' },
  { label: 'Data Siswa', path: '/users/students', icon: <GraduationCap size={24} />, color: 'bg-purple-700' },
  { label: 'Penugasan', path: '/assignments/teacher-subjects', icon: <Users size={24} />, color: 'bg-indigo-700' },
  { label: 'Jadwal', path: '/operational/schedules', icon: <Calendar size={24} />, color: 'bg-yellow-600' },
  { label: 'Presensi', path: '/operational/attendance', icon: <ClipboardCheck size={24} />, color: 'bg-orange-600' },
  { label: 'Tugas', path: '/operational/assignments', icon: <FileText size={24} />, color: 'bg-teal-600' },
  { label: 'Nilai', path: '/operational/grades', icon: <Award size={24} />, color: 'bg-red-700' },
];

export default function AdminDashboard() {
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    authService.getPendingRegistrations()
      .then(res => {
        const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
        setPendingCount(list.length);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard Admin" subtitle="Selamat datang di Sistem Informasi Akademik SMK" />

      {/* Notifikasi Pendaftaran */}
      {pendingCount > 0 && (
        <div className="bg-primary-900/40 border border-primary-500/50 rounded-lg p-4 mb-6 flex items-center justify-between shadow-lg shadow-black/20 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500/30 p-2 rounded-full">
              <Bell className="text-primary-300" size={20} />
            </div>
            <div>
              <h4 className="text-slate-100 font-medium">Ada Pendaftaran Baru!</h4>
              <p className="text-slate-300 text-sm">Terdapat {pendingCount} pengguna baru (guru/siswa) yang menunggu persetujuan Anda.</p>
            </div>
          </div>
          <Link to="/admin/approvals" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Lihat Data
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex flex-col items-center p-4 bg-slate-800 rounded-lg shadow-lg shadow-black/20 hover:shadow-lg hover:shadow-black/20 transition-shadow"
          >
            <div className={`${link.color} text-white p-3 rounded-full mb-2`}>
              {link.icon}
            </div>
            <span className="text-sm font-medium text-slate-300 text-center">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Banner / Logo SMK Bisa */}
      <div className="bg-slate-800 rounded-lg shadow-lg shadow-black/20 p-6 flex flex-col items-center justify-center min-h-[300px]">
        <img 
          src={smkBisaLogo} 
          alt="SMK Bisa" 
          className="max-w-full h-auto max-h-64 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
        />
        <h3 className="text-xl font-bold text-slate-100 mt-6 tracking-wider">SMK BISA, SMK HEBAT!</h3>
      </div>
    </div>
  );
}
