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
  1: 'border-blue-500 bg-blue-50',
  2: 'border-emerald-500 bg-emerald-50',
  3: 'border-yellow-500 bg-yellow-50',
  4: 'border-purple-500 bg-purple-50',
  5: 'border-red-500 bg-red-50',
  6: 'border-indigo-500 bg-indigo-50',
};

const quickLinks = [
  { label: 'Jadwal Pelajaran', path: '/operational/schedules', icon: <Calendar size={24} />, color: 'bg-blue-500' },
  { label: 'Presensi Saya', path: '/operational/attendance', icon: <ClipboardCheck size={24} />, color: 'bg-orange-500' },
  { label: 'Tugas Saya', path: '/operational/assignments', icon: <FileText size={24} />, color: 'bg-teal-500' },
  { label: 'Nilai Saya', path: '/operational/grades', icon: <Award size={24} />, color: 'bg-red-500' },
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
            className="flex flex-col items-center p-5 bg-white rounded-xl shadow hover:shadow-md transition-all hover:scale-105"
          >
            <div className={`${link.color} text-white p-3 rounded-full mb-3`}>
              {link.icon}
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Today's Schedule - from database */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Jadwal Hari Ini</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className='w-6 h-6 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin' />
          </div>
        ) : todaySchedule.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada jadwal hari ini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySchedule.map(s => (
              <div key={s.id} className={`flex items-center p-4 border-l-4 rounded-lg ${dayColors[s.dayOfWeek] || 'border-gray-400 bg-gray-50'}`}>
                <div className="text-center min-w-[80px]">
                  <p className="text-sm font-bold text-gray-900">{s.startTime}</p>
                  <p className="text-xs text-gray-400">s/d</p>
                  <p className="text-sm font-bold text-gray-900">{s.endTime}</p>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <BookOpen size={14} className="text-gray-400" />
                    {s.subjectName || 'Mapel'}
                  </p>
                  <p className="text-sm text-gray-500">Guru: {s.teacherName || '-'} | Ruang: {s.room || '-'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
