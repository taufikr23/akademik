import { useState, useEffect } from 'react';
import { BarChart3, Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import PageHeader from '../../components/PageHeader';

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
  attendanceRate: number;
  averageGrade: number;
}

export default function Statistics() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    attendanceRate: 0,
    averageGrade: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // TODO: Replace with actual API calls
      // For now, use mock data
      setStats({
        totalStudents: 450,
        totalTeachers: 25,
        totalClasses: 15,
        totalSubjects: 20,
        attendanceRate: 85.5,
        averageGrade: 78.3,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Memuat data...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Statistik Sekolah" subtitle="Dashboard analitik untuk Kepala Sekolah" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg shadow-lg shadow-black/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-900/40 rounded-full">
              <GraduationCap className="h-6 w-6 text-primary-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Total Siswa</p>
              <p className="text-2xl font-semibold text-slate-100">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg shadow-black/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-900/40 rounded-full">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Total Guru</p>
              <p className="text-2xl font-semibold text-slate-100">{stats.totalTeachers}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg shadow-black/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-900/40 rounded-full">
              <BookOpen className="h-6 w-6 text-purple-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Total Kelas</p>
              <p className="text-2xl font-semibold text-slate-100">{stats.totalClasses}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg shadow-black/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-900/40 rounded-full">
              <BarChart3 className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Total Mata Pelajaran</p>
              <p className="text-2xl font-semibold text-slate-100">{stats.totalSubjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg shadow-black/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-900/40 rounded-full">
              <TrendingUp className="h-6 w-6 text-indigo-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Rata-rata Kehadiran</p>
              <p className="text-2xl font-semibold text-slate-100">{stats.attendanceRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg shadow-lg shadow-black/20 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-pink-900/40 rounded-full">
              <BarChart3 className="h-6 w-6 text-pink-300" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-400">Rata-rata Nilai</p>
              <p className="text-2xl font-semibold text-slate-100">{stats.averageGrade}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-slate-800 rounded-lg shadow-lg shadow-black/20 p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Rekap Kehadiran Bulanan</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">85%</div>
            <div className="text-sm text-slate-400">Hadir</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">8%</div>
            <div className="text-sm text-slate-400">Izin</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">5%</div>
            <div className="text-sm text-slate-400">Sakit</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">2%</div>
            <div className="text-sm text-slate-400">Alpa</div>
          </div>
        </div>
      </div>

      {/* Grade Summary by Department */}
      <div className="bg-slate-800 rounded-lg shadow-lg shadow-black/20 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Rata-rata Nilai per Jurusan</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-slate-300">TKJ</span>
            <div className="flex-1 mx-4">
              <div className="h-4 bg-slate-700 rounded-full">
                <div className="h-4 bg-primary-600 rounded-full" style={{ width: '78.5%' }}></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-100">78.5</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-slate-300">RPL</span>
            <div className="flex-1 mx-4">
              <div className="h-4 bg-slate-700 rounded-full">
                <div className="h-4 bg-emerald-600 rounded-full" style={{ width: '82.3%' }}></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-100">82.3</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-slate-300">Akuntansi</span>
            <div className="flex-1 mx-4">
              <div className="h-4 bg-slate-700 rounded-full">
                <div className="h-4 bg-purple-700 rounded-full" style={{ width: '75.2%' }}></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-100">75.2</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-slate-300">Multimedia</span>
            <div className="flex-1 mx-4">
              <div className="h-4 bg-slate-700 rounded-full">
                <div className="h-4 bg-yellow-600 rounded-full" style={{ width: '80.1%' }}></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-100">80.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
