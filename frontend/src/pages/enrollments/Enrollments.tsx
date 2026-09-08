import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { studentService } from '../../services/studentService';
import { academicService } from '../../services/academicService';
import type { Student, StudentEnrollment, ClassRoom, AcademicYear } from '../../types';

interface LocalStudent { id: number; fullName: string; nis: string; }
interface LocalEnrollment { id: number; studentId: number; classId: number; academicYearId: number; status: string; }
interface LocalClass { id: number; name: string; }
interface LocalYear { id: number; yearName: string; }

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: 'Aktif', color: 'bg-emerald-900/40 text-emerald-400' },
  GRADUATED: { label: 'Lulus', color: 'bg-primary-900/40 text-primary-300' },
  DROPPED: { label: 'Keluar', color: 'bg-red-900/40 text-red-400' },
};

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState<LocalEnrollment[]>([]);
  const [students, setStudents] = useState<LocalStudent[]>([]);
  const [classes, setClasses] = useState<LocalClass[]>([]);
  const [academicYears, setAcademicYears] = useState<LocalYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState<LocalEnrollment | null>(null);
  const [filterStudentId, setFilterStudentId] = useState('');
  const [form, setForm] = useState({ studentId: '', classId: '', academicYearId: '', status: 'ACTIVE' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadInitial = async () => {
    setLoading(true);
    try {
      const [s, c, ay] = await Promise.all([
        studentService.getStudents(),
        academicService.getClasses(),
        academicService.getAcademicYears(),
      ]);
      setStudents(s.data);
      setClasses(c.data);
      setAcademicYears(ay.data);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      if (filterStudentId) {
        const res = await studentService.getEnrollmentsByStudent(Number(filterStudentId));
        setEnrollments(res.data);
      } else {
        const res = await studentService.getEnrollments();
        setEnrollments(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInitial(); }, []);
  useEffect(() => { if (students.length > 0) loadEnrollments(); }, [filterStudentId, students]);

  const studentMap = Object.fromEntries(students.map(s => [s.id, s]));
  const classMap = Object.fromEntries(classes.map(c => [c.id, c]));
  const yearMap = Object.fromEntries(academicYears.map(y => [y.id, y]));

  const openAdd = () => { setForm({ studentId: '', classId: '', academicYearId: '', status: 'ACTIVE' }); setShowModal(true); };
  const openDelete = (e: LocalEnrollment) => { setSelected(e); setShowDelete(true); };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      await studentService.createEnrollment({
        studentId: Number(form.studentId),
        classId: Number(form.classId),
        academicYearId: Number(form.academicYearId),
        status: form.status,
      });
      setShowModal(false);
      loadEnrollments();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Gagal menyimpan data';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await studentService.deleteEnrollment(selected.id);
        setShowDelete(false);
        loadEnrollments();
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Gagal menghapus data');
        setShowDelete(false);
      }
    }
  };

  const columns = [
    {
      key: 'studentId', label: 'Nama Siswa',
      render: (item: LocalEnrollment) => studentMap[item.studentId]?.fullName ?? item.studentId,
    },
    {
      key: 'studentId2', label: 'NIS',
      render: (item: LocalEnrollment) => studentMap[item.studentId]?.nis ?? '-',
    },
    { key: 'classId', label: 'Kelas', render: (item: LocalEnrollment) => classMap[item.classId]?.name ?? item.classId },
    { key: 'academicYearId', label: 'Tahun Akademik', render: (item: LocalEnrollment) => yearMap[item.academicYearId]?.yearName ?? item.academicYearId },
    {
      key: 'status', label: 'Status',
      render: (item: LocalEnrollment) => {
        const cfg = statusConfig[item.status] || { label: item.status, color: 'bg-slate-700/50 text-slate-400' };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>;
      },
    },
    {
      key: 'actions', label: 'Aksi',
      render: (item: LocalEnrollment) => (
        <button onClick={() => openDelete(item)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pendaftaran Siswa"
        action={
          <div className="flex items-center gap-3">
            <select value={filterStudentId} onChange={e => setFilterStudentId(e.target.value)} className="bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 text-sm">
              <option value="">Semua Siswa</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.nis})</option>)}
            </select>
            <button onClick={openAdd} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"><Plus size={16} /> Tambah</button>
          </div>
        }
      />
      <DataTable columns={columns} data={enrollments} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Pendaftaran">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Siswa</label>
            <select value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2">
              <option value="">Pilih Siswa</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.nis})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Kelas</label>
            <select value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2">
              <option value="">Pilih Kelas</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tahun Akademik</label>
            <select value={form.academicYearId} onChange={e => setForm({ ...form, academicYearId: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2">
              <option value="">Pilih Tahun Akademik</option>
              {academicYears.map(y => <option key={y.id} value={y.id}>{y.yearName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2">
              <option value="ACTIVE">Aktif</option>
              <option value="GRADUATED">Lulus</option>
              <option value="DROPPED">Keluar</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-600 rounded-lg text-slate-400 hover:bg-slate-700/50">Batal</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </Modal>

      <ConfirmDelete isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Hapus Pendaftaran" message="Hapus data pendaftaran ini?" />
    </div>
  );
}
