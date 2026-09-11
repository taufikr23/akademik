import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, ClipboardCheck, FileText, Award, Users,
  BookOpen, Clock, CheckCircle, AlertTriangle, XCircle,
} from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { teacherService, teacherSubjectService } from '../../services/academicService';
import { attendanceService } from '../../services/attendanceService';

const dayNames: Record<number, string> = { 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu', 7: 'Minggu' };
const dayColors: Record<number, string> = {
  1: 'border-primary-500 bg-primary-900/30',
  2: 'border-emerald-600 bg-emerald-900/30',
  3: 'border-yellow-600 bg-yellow-900/30',
  4: 'border-purple-600 bg-purple-900/30',
  5: 'border-red-600 bg-red-900/30',
  6: 'border-indigo-600 bg-indigo-900/30',
};

interface TeacherClassData {
  teacher_subject_id: number;
  class_id: number;
  class_name: string;
  subject_id: number;
  subject_name: string;
  day_of_week: number | null;
  start_time: string | null;
  end_time: string | null;
  room: string | null;
}

interface AttendanceStat {
  classId: number;
  className: string;
  subjectName: string;
  totalStudents: number;
  todayHadir: number;
  todayAlpha: number;
}

const quickLinks = [
  { label: 'Jadwal Mengajar', path: '/operational/schedules', icon: <Calendar size={24} />, color: 'bg-primary-600' },
  { label: 'Daftar Siswa', path: '/users/students', icon: <Users size={24} />, color: 'bg-emerald-600' },
  { label: 'Presensi Siswa', path: '/operational/attendance', icon: <ClipboardCheck size={24} />, color: 'bg-orange-600' },
  { label: 'Buat Tugas', path: '/operational/assignments', icon: <FileText size={24} />, color: 'bg-teal-600' },
  { label: 'Input Nilai', path: '/operational/grades', icon: <Award size={24} />, color: 'bg-red-700' },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [teacherClasses, setTeacherClasses] = useState<TeacherClassData[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(() => new Date().toISOString().split('T')[0]);
  const [todayDayOfWeek] = useState(() => {
    const d = new Date().getDay(); // 0=Sun,1=Mon,...
    return d === 0 ? 7 : d; // Convert to 1-7 (Mon-Sun)
  });

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      // Find teacher record
      const teachersRes = await teacherService.getAll();
      const teachers = teachersRes.data;
      const myTeacher = teachers.find((t: any) => t.nip === user?.username || t.userId === user?.id);

      if (myTeacher) {
        // Get teacher's classes from attendance-service endpoint
        const classesRes = await attendanceService.getTeacherClasses(myTeacher.id);
        const classes: TeacherClassData[] = classesRes.data;
        setTeacherClasses(classes);

        // Get attendance stats for each class
        const stats: AttendanceStat[] = [];
        const uniqueClassIds = [...new Set(classes.map(c => c.class_id))];

        for (const classId of uniqueClassIds) {
          try {
            // Get students count
            const studentsRes = await attendanceService.getClassStudents(classId);
            const totalStudents = studentsRes.data.length;

            // Get today's attendance for first subject in this class
            const firstTs = classes.find(c => c.class_id === classId);
            if (firstTs) {
              try {
                const attRes = await attendanceService.getClassAttendance(classId, firstTs.teacher_subject_id, today);
                const attendances = attRes.data?.studentAttendances || [];
                const hadir = attendances.filter((a: any) => a.status === 'HADIR').length;
                const alpha = attendances.filter((a: any) => a.status === 'ALPHA').length;

                stats.push({
                  classId,
                  className: firstTs.class_name,
                  subjectName: firstTs.subject_name,
                  totalStudents,
                  todayHadir: hadir,
                  todayAlpha: alpha,
                });
              } catch {
                // No attendance yet today
                stats.push({
                  classId,
                  className: firstTs.class_name,
                  subjectName: firstTs.subject_name,
                  totalStudents,
                  todayHadir: 0,
                  todayAlpha: totalStudents,
                });
              }
            }
          } catch {
            // skip
          }
        }
        setAttendanceStats(stats);
      }
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  // Today's schedule
  const todaySchedule = teacherClasses.filter(tc => tc.day_of_week === todayDayOfWeek);

  // Unique classes
  const uniqueClasses = [...new Map(teacherClasses.map(tc => [tc.class_id, tc])).values()];

  return (
    <div>
      <PageHeader title="Dashboard Guru" subtitle="Selamat datang di Sistem Informasi Akademik SMK" />

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex flex-col items-center p-3 sm:p-4 bg-slate-800 rounded-lg shadow-lg shadow-black/20 hover:shadow-lg hover:shadow-black/20 transition-shadow"
          >
            <div className={`${link.color} text-white p-3 rounded-full mb-2`}>
              {link.icon}
            </div>
            <span className="text-sm font-medium text-slate-300 text-center">{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="bg-slate-800 rounded-xl shadow-lg shadow-black/20 border border-slate-700 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-primary-300" />
          <h3 className="text-lg font-semibold text-slate-100">Jadwal Mengajar Hari Ini</h3>
          <span className="bg-primary-900/40 text-primary-300 px-2 py-0.5 rounded-full text-xs font-medium">
            {dayNames[todayDayOfWeek]}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary-300 border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : todaySchedule.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl p-8 text-center">
            <Calendar size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Tidak ada jadwal mengajar hari ini</p>
            <p className="text-slate-500 text-sm mt-1">Nikmati hari libur Anda! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySchedule.sort((a, b) => (a.start_time || '').localeCompare(b.start_time || '')).map(tc => (
              <div key={tc.teacher_subject_id} className={`border-l-4 rounded-xl p-4 ${dayColors[todayDayOfWeek] || 'border-slate-500 bg-slate-800/50'}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[80px]">
                      <p className="text-sm font-bold text-slate-100">{tc.start_time || '-'}</p>
                      <p className="text-xs text-slate-500">s/d</p>
                      <p className="text-sm font-bold text-slate-100">{tc.end_time || '-'}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100 text-lg">{tc.subject_name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="bg-primary-900/40 text-primary-300 px-2 py-0.5 rounded-full text-xs font-medium">
                          {tc.class_name}
                        </span>
                        <span className="bg-purple-900/40 text-purple-300 px-2 py-0.5 rounded-full text-xs font-medium">
                          {teacherClasses.find(c => c.class_id === tc.class_id)?.class_name?.includes('TSM') ? 'Teknik Sepeda Motor' :
                           teacherClasses.find(c => c.class_id === tc.class_id)?.class_name?.includes('TITL') ? 'Teknik Instalasi Tenaga Listrik' :
                           teacherClasses.find(c => c.class_id === tc.class_id)?.class_name?.includes('DPIB') ? 'Desain Pemodelan Informasi Bangunan' :
                           teacherClasses.find(c => c.class_id === tc.class_id)?.class_name?.includes('TKP') ? 'Teknik Konstruksi Perumahan' :
                           teacherClasses.find(c => c.class_id === tc.class_id)?.class_name?.includes('APAT') ? 'Agribisnis Perikanan Air Tawar' :
                           teacherClasses.find(c => c.class_id === tc.class_id)?.class_name?.includes('TKR') ? 'Teknik Kendaraan Ringan' :
                           teacherClasses.find(c => c.class_id === tc.class_id)?.class_name?.includes('TKPI') ? 'Teknik Kapal Penangkap Ikan' :
                           teacherClasses.find(c => c.class_id === tc.class_id)?.class_name?.includes('NKPI') ? 'Nautika Kapal Penangkap Ikan' :
                           'Jurusan'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">Ruang: {tc.room || '-'}</p>
                    </div>
                  </div>
                  <Link
                    to="/operational/attendance"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1"
                  >
                    <ClipboardCheck size={16} />
                    Absen
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance Summary per Class */}
      <div className="bg-slate-800 rounded-xl shadow-lg shadow-black/20 border border-slate-700 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={20} className="text-emerald-400" />
          <h3 className="text-lg font-semibold text-slate-100">Rekap Kehadiran Siswa Hari Ini</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-6 h-6 border-4 border-emerald-800 border-t-emerald-400 rounded-full animate-spin" />
          </div>
        ) : attendanceStats.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl p-6 text-center">
            <p className="text-slate-400">Belum ada data kehadiran hari ini</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendanceStats.map(stat => {
              const attendanceRate = stat.totalStudents > 0
                ? Math.round((stat.todayHadir / stat.totalStudents) * 100)
                : 0;

              return (
                <div key={stat.classId} className="border border-slate-700 rounded-xl p-4 hover:shadow-lg hover:shadow-black/20 transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-100">{stat.className}</h4>
                      <p className="text-xs text-slate-400">{stat.subjectName}</p>
                    </div>
                    <span className={`text-lg font-bold ${
                      attendanceRate >= 80 ? 'text-emerald-400' :
                      attendanceRate >= 50 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {attendanceRate}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        attendanceRate >= 80 ? 'bg-emerald-600' :
                        attendanceRate >= 50 ? 'bg-yellow-600' : 'bg-red-700'
                      }`}
                      style={{ width: `${attendanceRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle size={12} />
                      <span>Hadir: {stat.todayHadir}/{stat.totalStudents}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-400">
                      <XCircle size={12} />
                      <span>Alpha: {stat.todayAlpha}</span>
                    </div>
                  </div>

                  <Link
                    to="/operational/attendance"
                    className="mt-3 block text-center bg-primary-900/30 text-primary-300 py-1.5 rounded-lg text-xs font-medium hover:bg-primary-900/50 transition-colors"
                  >
                    Lihat Detail →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All Classes Summary */}
      <div className="bg-slate-800 rounded-xl shadow-lg shadow-black/20 border border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-purple-300" />
          <h3 className="text-lg font-semibold text-slate-100">Kelas yang Anda Ajar</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-6 h-6 border-4 border-purple-800 border-t-purple-400 rounded-full animate-spin" />
          </div>
        ) : uniqueClasses.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl p-6 text-center">
            <p className="text-slate-400">Belum ada penugasan kelas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {uniqueClasses.map(tc => {
              const subjects = teacherClasses.filter(c => c.class_id === tc.class_id);
              const hasSchedule = subjects.some(s => s.day_of_week !== null);
              const deptName = subjects[0]?.class_name?.includes('TSM') ? 'Teknik Sepeda Motor' :
                              subjects[0]?.class_name?.includes('TITL') ? 'Teknik Instalasi Tenaga Listrik' :
                              subjects[0]?.class_name?.includes('DPIB') ? 'Desain Pemodelan Informasi Bangunan' :
                              subjects[0]?.class_name?.includes('TKP') ? 'Teknik Konstruksi Perumahan' :
                              subjects[0]?.class_name?.includes('APAT') ? 'Agribisnis Perikanan Air Tawar' :
                              subjects[0]?.class_name?.includes('TKR') ? 'Teknik Kendaraan Ringan' :
                              subjects[0]?.class_name?.includes('TKPI') ? 'Teknik Kapal Penangkap Ikan' :
                              subjects[0]?.class_name?.includes('NKPI') ? 'Nautika Kapal Penangkap Ikan' :
                              'Jurusan';

              return (
                <div key={tc.class_id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg ${
                      hasSchedule ? 'bg-primary-600' : 'bg-slate-500'
                    }`}>
                      {tc.class_name?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-100">{tc.class_name}</h4>
                      <p className="text-xs text-slate-400">{deptName}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {subjects.map(s => (
                          <span key={s.teacher_subject_id} className="bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded text-xs">
                            {s.subject_name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      hasSchedule
                        ? 'bg-emerald-900/40 text-emerald-400'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {hasSchedule ? 'Terjadwal' : 'Belum Terjadwal'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
