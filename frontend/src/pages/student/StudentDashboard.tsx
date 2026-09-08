import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, ClipboardCheck, FileText, Award, Clock, BookOpen,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { teacherSubjectService } from '../../services/academicService';
import { useAuth } from '../../context/AuthContext';

interface TodaySchedule {
  id: number;
  className: string;
  teacherName: string;
  subjectName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

const dayColors: Record<number, string> = {
  1: 'border-primary-500 bg-primary-900/30',
  2: 'border-emerald-600 bg-emerald-900/30',
  3: 'border-yellow-600 bg-yellow-900/30',
  4: 'border-purple-600 bg-purple-900/30',
  5: 'border-red-600 bg-red-900/30',
  6: 'border-indigo-600 bg-indigo-900/30',
};

const quickLinks = [
  { label: 'Jadwal Pelajaran', path: '/operational/schedules', icon: <Calendar size={24} />, color: 'bg-primary-600' },
  { label: 'Presensi Saya', path: '/operational/attendance', icon: <ClipboardCheck size={24} />, color: 'bg-orange-600' },
  { label: 'Tugas Saya', path: '/operational/assignments', icon: <FileText size={24} />, color: 'bg-teal-600' },
  { label: 'Nilai Saya', path: '/operational/grades', icon: <Award size={24} />, color: 'bg-red-700' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodaySchedule();
  }, []);

  const loadTodaySchedule = async () => {
    setLoading(true);
    try {
      const today = new Date().getDay();
      const dayOfWeek = today === 0 ? 7 : today;
      // Get student's classId
      let schedules: any[] = [];
      try {
        const studentRes = await import('../../api/client').then(m => m.default.get('/api/students'));
        const students = Array.isArray(studentRes.data) ? studentRes.data : [];
        const myStudent = students.find((s: any) => s.nis === user?.username || s.userId === user?.id);
        if (myStudent?.classId) {
          const sRes = await teacherSubjectService.getByClass(myStudent.classId);
          schedules = Array.isArray(sRes.data) ? sRes.data : [];
        }
      } catch (e) {
        console.error('Could not fetch student class:', e);
      }
      const todaySchedules = schedules
        .filter((s: any) => s.dayOfWeek === dayOfWeek && s.isActive)
        .sort((a: any, b: any) => (a.startTime || '').localeCompare(b.startTime || ''));
      setTodaySchedule(todaySchedules);
    } catch (e) {
      console.error('Failed to load schedule:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Dashboard Siswa" subtitle={`Selamat datang, ${user?.username || 'Siswa'}!`} />

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex flex-col items-center p-5 bg-slate-800 rounded-xl shadow-lg shadow-black/20 hover:shadow-lg hover:shadow-black/20 transition-all hover:scale-105"
          >
            <div className={`${link.color} text-white p-3 rounded-full mb-3`}>
              {link.icon}
            </div>
            <span className="text-sm font-medium text-slate-300 text-center">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Today's Schedule - from database */}
      <div className="bg-slate-800 rounded-xl shadow-lg shadow-black/20 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-primary-300" />
          <h3 className="text-lg font-semibold text-slate-100">Jadwal Hari Ini</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className='w-6 h-6 border-4 border-primary-300 border-t-primary-500 rounded-full animate-spin' />
          </div>
        ) : todaySchedule.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">Tidak ada jadwal hari ini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySchedule.map(s => (
              <div key={s.id} className={`flex items-center p-4 border-l-4 rounded-lg ${dayColors[s.dayOfWeek] || 'border-slate-500 bg-slate-800/50'}`}>
                <div className="text-center min-w-[80px]">
                  <p className="text-sm font-bold text-slate-100">{s.startTime}</p>
                  <p className="text-xs text-slate-500">s/d</p>
                  <p className="text-sm font-bold text-slate-100">{s.endTime}</p>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-slate-100 flex items-center gap-2">
                    <BookOpen size={14} className="text-slate-500" />
                    {s.subjectName || 'Mapel'}
                  </p>
                  <p className="text-sm text-slate-400">Guru: {s.teacherName || '-'} | Ruang: {s.room || '-'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
