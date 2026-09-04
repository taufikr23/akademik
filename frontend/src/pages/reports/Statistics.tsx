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
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Statistik Sekolah" subtitle="Dashboard analitik untuk Kepala Sekolah" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Siswa</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Guru</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalTeachers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Kelas</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClasses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Mata Pelajaran</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSubjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rata-rata Kehadiran</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.attendanceRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-pink-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rata-rata Nilai</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageGrade}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rekap Kehadiran Bulanan</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-500">Hadir</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">8%</div>
            <div className="text-sm text-gray-500">Izin</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">5%</div>
            <div className="text-sm text-gray-500">Sakit</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">2%</div>
            <div className="text-sm text-gray-500">Alpa</div>
          </div>
        </div>
      </div>

      {/* Grade Summary by Department */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rata-rata Nilai per Jurusan</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-gray-700">TKJ</span>
            <div className="flex-1 mx-4">
              <div className="h-4 bg-gray-200 rounded-full">
                <div className="h-4 bg-blue-500 rounded-full" style={{ width: '78.5%' }}></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">78.5</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-gray-700">RPL</span>
            <div className="flex-1 mx-4">
              <div className="h-4 bg-gray-200 rounded-full">
                <div className="h-4 bg-green-500 rounded-full" style={{ width: '82.3%' }}></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">82.3</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-gray-700">Akuntansi</span>
            <div className="flex-1 mx-4">
              <div className="h-4 bg-gray-200 rounded-full">
                <div className="h-4 bg-purple-500 rounded-full" style={{ width: '75.2%' }}></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">75.2</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 text-sm font-medium text-gray-700">Multimedia</span>
            <div className="flex-1 mx-4">
              <div className="h-4 bg-gray-200 rounded-full">
                <div className="h-4 bg-yellow-500 rounded-full" style={{ width: '80.1%' }}></div>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-900">80.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
