import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, Calendar, ClipboardCheck, FileText, Award, TrendingUp } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { academicService } from '../services/academicService';
import { studentService } from '../services/studentService';
import { attendanceService } from '../services/attendanceService';
import { assignmentService } from '../services/assignmentService';
import { gradeService } from '../services/gradeService';
import { scheduleService } from '../services/scheduleService';

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

export default function Dashboard() {
  const [stats, setStats] = useState({
    teachers: 0, students: 0, subjects: 0, classes: 0,
    attendances: 0, assignments: 0, grades: 0, departments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [teachers, students, subjects, classes, attendances, assignments, grades, depts] = await Promise.allSettled([
          academicService.getTeachers(),
          studentService.getStudents(),
          academicService.getSubjects(),
          academicService.getClasses(),
          attendanceService.getAttendances(),
          assignmentService.getAssignments(),
          gradeService.getGrades(),
          academicService.getDepartments(),
        ]);
        setStats({
          teachers: teachers.status === 'fulfilled' ? teachers.value.data.length : 0,
          students: students.status === 'fulfilled' ? students.value.data.length : 0,
          subjects: subjects.status === 'fulfilled' ? subjects.value.data.length : 0,
          classes: classes.status === 'fulfilled' ? classes.value.data.length : 0,
          attendances: attendances.status === 'fulfilled' ? attendances.value.data.length : 0,
          assignments: assignments.status === 'fulfilled' ? assignments.value.data.length : 0,
          grades: grades.status === 'fulfilled' ? grades.value.data.length : 0,
          departments: depts.status === 'fulfilled' ? depts.value.data.length : 0,
        });
      } catch {}
      setLoading(false);
    };
    loadStats();
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Ringkasan data akademik sekolah" />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Users size={24} className="text-blue-600" />} label="Guru" value={stats.teachers} color="bg-blue-50" />
            <StatCard icon={<GraduationCap size={24} className="text-emerald-600" />} label="Siswa" value={stats.students} color="bg-emerald-50" />
            <StatCard icon={<BookOpen size={24} className="text-violet-600" />} label="Mata Pelajaran" value={stats.subjects} color="bg-violet-50" />
            <StatCard icon={<TrendingUp size={24} className="text-amber-600" />} label="Kelas" value={stats.classes} color="bg-amber-50" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<ClipboardCheck size={24} className="text-teal-600" />} label="Kehadiran" value={stats.attendances} color="bg-teal-50" />
            <StatCard icon={<FileText size={24} className="text-orange-600" />} label="Tugas" value={stats.assignments} color="bg-orange-50" />
            <StatCard icon={<Award size={24} className="text-rose-600" />} label="Nilai" value={stats.grades} color="bg-rose-50" />
            <StatCard icon={<Calendar size={24} className="text-indigo-600" />} label="Jurusan" value={stats.departments} color="bg-indigo-50" />
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selamat Datang di SIASEK</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Platform Sistem Informasi Akademik Sekolah untuk mengelola seluruh data akademik secara terintegrasi.
              Gunakan menu di sebelah kiri untuk mengakses berbagai modul: data akademik, tenaga pengajar, siswa,
              jadwal pelajaran, kehadiran, tugas, dan penilaian.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
