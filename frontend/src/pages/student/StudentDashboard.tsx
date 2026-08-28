import { useEffect, useState } from 'react';
import { Calendar, ClipboardCheck, FileText, Award, Clock, BookMarked, Send, CreditCard } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { scheduleService } from '../../services/scheduleService';
import { attendanceService } from '../../services/attendanceService';
import { assignmentService } from '../../services/assignmentService';
import { gradeService } from '../../services/gradeService';
import { useAuth } from '../../context/AuthContext';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    schedules: 0, attendance: 0, assignments: 0, grades: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [schedules, attendance, assignments, grades] = await Promise.allSettled([
          scheduleService.getSchedules(),
          attendanceService.getAttendances(),
          assignmentService.getAssignments(),
          gradeService.getGrades(),
        ]);
        setStats({
          schedules: schedules.status === 'fulfilled' ? schedules.value.data.length : 0,
          attendance: attendance.status === 'fulfilled' ? attendance.value.data.length : 0,
          assignments: assignments.status === 'fulfilled' ? assignments.value.data.length : 0,
          grades: grades.status === 'fulfilled' ? grades.value.data.length : 0,
        });
      } catch {}
      setLoading(false);
    };
    loadStats();
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard Siswa" subtitle={`Selamat datang, ${user?.username}`} />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Calendar size={24} className="text-blue-600" />} label="Jadwal Hari Ini" value={stats.schedules} color="bg-blue-50" />
            <StatCard icon={<ClipboardCheck size={24} className="text-emerald-600" />} label="Kehadiran" value={stats.attendance} color="bg-emerald-50" />
            <StatCard icon={<FileText size={24} className="text-orange-600" />} label="Tugas Diberikan" value={stats.assignments} color="bg-orange-50" />
            <StatCard icon={<Award size={24} className="text-rose-600" />} label="Nilai Diterima" value={stats.grades} color="bg-rose-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Hari Ini</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Jadwal Pelajaran</p>
                    <p className="text-xs text-gray-500">Lihat jadwal pelajaran hari ini</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileText size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Kumpulkan Tugas</p>
                    <p className="text-xs text-gray-500">Lihat dan kumpulkan tugas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <ClipboardCheck size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Presensi</p>
                    <p className="text-xs text-gray-500">Lihat riwayat kehadiran</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu Siswa</h3>
              <div className="grid grid-cols-2 gap-3">
                <a href="/schedules" className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
                  <Calendar size={20} className="text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-blue-900">Jadwal</p>
                </a>
                <a href="/assignments" className="p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-center">
                  <FileText size={20} className="text-orange-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-orange-900">Tugas</p>
                </a>
                <a href="/grades" className="p-3 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors text-center">
                  <Award size={20} className="text-violet-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-violet-900">Nilai</p>
                </a>
                <a href="/students/report-card" className="p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors text-center">
                  <CreditCard size={20} className="text-rose-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-rose-900">Rapor</p>
                </a>
                <a href="/attendance" className="p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors text-center">
                  <ClipboardCheck size={20} className="text-emerald-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-emerald-900">Presensi</p>
                </a>
                <a href="/students/materials" className="p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors text-center">
                  <BookMarked size={20} className="text-teal-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-teal-900">Materi</p>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
