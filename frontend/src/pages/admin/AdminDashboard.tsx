import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, Calendar, School, TrendingUp, Shield } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { academicService } from '../../services/academicService';
import { studentService } from '../../services/studentService';
import { scheduleService } from '../../services/scheduleService';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  change?: string;
}

function StatCard({ icon, label, value, color, change }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {change && <p className="text-xs text-emerald-600 font-medium">{change}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    teachers: 0, students: 0, subjects: 0, classes: 0, departments: 0, schedules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [teachers, students, subjects, classes, depts, schedules] = await Promise.allSettled([
          academicService.getTeachers(),
          studentService.getStudents(),
          academicService.getSubjects(),
          academicService.getClasses(),
          academicService.getDepartments(),
          scheduleService.getSchedules(),
        ]);
        setStats({
          teachers: teachers.status === 'fulfilled' ? teachers.value.data.length : 0,
          students: students.status === 'fulfilled' ? students.value.data.length : 0,
          subjects: subjects.status === 'fulfilled' ? subjects.value.data.length : 0,
          classes: classes.status === 'fulfilled' ? classes.value.data.length : 0,
          departments: depts.status === 'fulfilled' ? depts.value.data.length : 0,
          schedules: schedules.status === 'fulfilled' ? schedules.value.data.length : 0,
        });
      } catch {}
      setLoading(false);
    };
    loadStats();
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard Admin" subtitle="Panel manajemen seluruh data akademik sekolah" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon={<Users size={24} className="text-blue-600" />} label="Total Guru" value={stats.teachers} color="bg-blue-50" />
            <StatCard icon={<GraduationCap size={24} className="text-emerald-600" />} label="Total Siswa" value={stats.students} color="bg-emerald-50" />
            <StatCard icon={<School size={24} className="text-violet-600" />} label="Total Kelas" value={stats.classes} color="bg-violet-50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard icon={<BookOpen size={24} className="text-amber-600" />} label="Mata Pelajaran" value={stats.subjects} color="bg-amber-50" />
            <StatCard icon={<Shield size={24} className="text-indigo-600" />} label="Jurusan" value={stats.departments} color="bg-indigo-50" />
            <StatCard icon={<Calendar size={24} className="text-teal-600" />} label="Jadwal Aktif" value={stats.schedules} color="bg-teal-50" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manajemen Sekolah</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Kelola Data Guru & Siswa</p>
                    <p className="text-xs text-gray-500">Tambah, edit, atau hapus data pengguna</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                    <School size={16} className="text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Kelola Data Akademik</p>
                    <p className="text-xs text-gray-500">Jurusan, kelas, tahun ajaran, dan semester</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <TrendingUp size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Kelola Jadwal & Penugasan</p>
                    <p className="text-xs text-gray-500">Atur jadwal pelajaran dan penugasan guru</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Akses Cepat</h3>
              <div className="grid grid-cols-2 gap-3">
                <a href="/teachers/list" className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
                  <Users size={20} className="text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-blue-900">Data Guru</p>
                </a>
                <a href="/students/list" className="p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors text-center">
                  <GraduationCap size={20} className="text-emerald-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-emerald-900">Data Siswa</p>
                </a>
                <a href="/teachers/assignments" className="p-3 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors text-center">
                  <BookOpen size={20} className="text-violet-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-violet-900">Penugasan Guru</p>
                </a>
                <a href="/schedules" className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors text-center">
                  <Calendar size={20} className="text-amber-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-amber-900">Jadwal Pelajaran</p>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
