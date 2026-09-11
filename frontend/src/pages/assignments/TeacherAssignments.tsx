import { useState, useEffect, useMemo } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { academicService } from '../../services/academicService';

interface Teacher { id: number; fullName: string; nip: string; }
interface Subject { id: number; name: string; code: string; departmentId?: number; jenis: string; }
interface ClassRoom { id: number; name: string; departmentId?: number; departmentName?: string; gradeLevel: number; }
interface AcademicYear { id: number; yearName: string; isActive: boolean; }
interface Department { id: number; name: string; }
interface Assignment { id: number; teacherId: number; subjectId: number; academicYearId: number; classId?: number; isActive: boolean; dayOfWeek?: number; startTime?: string; endTime?: string; room?: string; }

const TIME_SLOTS = [
  { label: 'Slot 1 — 08:00 - 10:00', start: '08:00', end: '10:00' },
  { label: 'Slot 2 — 10:30 - 11:30', start: '10:30', end: '11:30' },
  { label: 'Slot 3 — 13:00 - 15:00', start: '13:00', end: '15:00' },
];

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Assignment | null>(null);
  const [form, setForm] = useState({ teacherId: '', subjectId: '', academicYearId: '', classId: '', dayOfWeek: '', startTime: '', endTime: '', room: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const teacherMap = useMemo(() => Object.fromEntries(teachers.map(t => [t.id, t.fullName])), [teachers]);
  const subjectMap = useMemo(() => Object.fromEntries(subjects.map(s => [s.id, s.name])), [subjects]);
  const yearMap = useMemo(() => Object.fromEntries(academicYears.map(y => [y.id, y.yearName])), [academicYears]);
  const classMap = useMemo(() => Object.fromEntries(classes.map(c => [c.id, c.name])), [classes]);
  const deptMap = useMemo(() => Object.fromEntries(departments.map(d => [d.id, d.name])), [departments]);

  // Filter subjects by selected class's department
  const filteredSubjects = useMemo(() => {
    if (!form.classId) return subjects;
    const selectedClass = classes.find(c => c.id === Number(form.classId));
    if (!selectedClass?.departmentId) return subjects;
    return subjects.filter(s => s.departmentId === selectedClass.departmentId || !s.departmentId);
  }, [form.classId, subjects, classes]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [a, t, s, c, y, d] = await Promise.all([
        academicService.getTeacherSubjects(),
        academicService.getTeachers(),
        academicService.getSubjects(),
        academicService.getClasses(),
        academicService.getAcademicYears(),
        academicService.getDepartments(),
      ]);
      setAssignments(Array.isArray(a.data) ? a.data : []);
      setTeachers(Array.isArray(t.data) ? t.data : []);
      setSubjects(Array.isArray(s.data) ? s.data : []);
      setClasses(Array.isArray(c.data) ? c.data : []);
      setAcademicYears(Array.isArray(y.data) ? y.data : []);
      setDepartments(Array.isArray(d.data) ? d.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return assignments;
    const q = search.toLowerCase();
    return assignments.filter(a =>
      teacherMap[a.teacherId]?.toLowerCase().includes(q) ||
      subjectMap[a.subjectId]?.toLowerCase().includes(q) ||
      classMap[a.classId!]?.toLowerCase().includes(q)
    );
  }, [assignments, search, teacherMap, subjectMap, classMap]);

  const openAdd = () => {
    const activeYear = academicYears.find(y => y.isActive);
    setForm({
      teacherId: teachers[0]?.id ? String(teachers[0].id) : '',
      subjectId: '',
      academicYearId: activeYear ? String(activeYear.id) : '',
      classId: '',
      dayOfWeek: '',
      startTime: '',
      endTime: '',
      room: '',
    });
    setShowModal(true);
  };

  const openDelete = (item: Assignment) => { setDeleteItem(item); setShowDelete(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await academicService.createTeacherSubject({
        teacherId: Number(form.teacherId),
        subjectId: Number(form.subjectId),
        academicYearId: Number(form.academicYearId),
        classId: form.classId ? Number(form.classId) : undefined,
        dayOfWeek: form.dayOfWeek ? Number(form.dayOfWeek) : undefined,
        startTime: form.startTime || undefined,
        endTime: form.endTime || undefined,
        room: form.room || undefined,
      });
      setShowModal(false);
      loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Gagal menyimpan data');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await academicService.deleteTeacherSubject(deleteItem.id);
      setShowDelete(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menghapus data');
    }
  };

  const columns = [
    { key: 'teacherId', label: 'Guru', render: (item: Assignment) => teacherMap[item.teacherId] ?? '-' },
    { key: 'classId', label: 'Kelas', render: (item: Assignment) => classMap[item.classId!] ?? '-' },
    { key: 'subjectId', label: 'Mata Pelajaran', render: (item: Assignment) => subjectMap[item.subjectId] ?? '-' },
    { key: 'dayOfWeek', label: 'Hari', render: (item: any) => {
      const days: Record<number, string> = {1:'Senin',2:'Selasa',3:'Rabu',4:'Kamis',5:'Jumat',6:'Sabtu'};
      return item.dayOfWeek ? days[item.dayOfWeek] ?? '-' : '-';
    }},
    { key: 'timeRange', label: 'Jam', render: (item: any) => (item.startTime && item.endTime) ? `${item.startTime} - ${item.endTime}` : '-' },
    { key: 'room', label: 'Ruang', render: (item: any) => item.room ?? '-' },
    { key: 'academicYearId', label: 'Tahun Ajaran', render: (item: Assignment) => yearMap[item.academicYearId] ?? '-' },
    {
      key: 'isActive', label: 'Status',
      render: (item: Assignment) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-700/50 text-slate-300'}`}>
          {item.isActive ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Aksi',
      render: (item: Assignment) => (
        <button onClick={() => openDelete(item)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Guru & Mata Pelajaran" subtitle="Atur jadwal mengajar guru ke kelas" action={
        <button onClick={openAdd} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"><Plus size={16} /> Tambah</button>
      } />

      <div className="bg-slate-800 rounded-xl shadow-lg shadow-black/20 p-4 mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Cari guru, mapel, atau kelas..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 text-slate-100 border border-slate-600 rounded-lg text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 outline-none" />
        </div>
        {search && <button onClick={() => setSearch('')} className="text-sm text-slate-400 hover:text-slate-300">Reset</button>}
        <span className="text-sm text-slate-500">{filtered.length} data</span>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

      <Modal show={showModal} onClose={() => setShowModal(false)} title="Tambah Penugasan Mengajar">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label-field">Guru *</label>
              <select className="input-field" value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })} required>
                <option value="">Pilih Guru</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName} ({t.nip})</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Kelas *</label>
              <select className="input-field" value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value, subjectId: '' })} required>
                <option value="">Pilih Kelas</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} — {deptMap[c.departmentId!] || ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Mata Pelajaran *</label>
              <select className="input-field" value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })} required>
                <option value="">Pilih Mata Pelajaran</option>
                {filteredSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code}) — {s.jenis}</option>
                ))}
              </select>
              {form.classId && <p className="text-xs text-slate-500 mt-1">Mapel difilter berdasarkan jurusan kelas</p>}
            </div>
            <div>
              <label className="label-field">Tahun Ajaran *</label>
              <select className="input-field" value={form.academicYearId} onChange={e => setForm({ ...form, academicYearId: e.target.value })} required>
                <option value="">Pilih Tahun Ajaran</option>
                {academicYears.map(y => <option key={y.id} value={y.id}>{y.yearName} {y.isActive ? '(Aktif)' : ''}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Hari</label>
                <select className="input-field" value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: e.target.value })}>
                  <option value="">Pilih Hari</option>
                  <option value="1">Senin</option>
                  <option value="2">Selasa</option>
                  <option value="3">Rabu</option>
                  <option value="4">Kamis</option>
                  <option value="5">Jumat</option>
                  <option value="6">Sabtu</option>
                </select>
              </div>
              <div>
                <label className="label-field">Ruang</label>
                <input type="text" className="input-field" placeholder="Contoh: Lab Motor" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label-field">Slot Waktu *</label>
              <select className="input-field" value={`${form.startTime}-${form.endTime}`} onChange={e => {
                const slot = TIME_SLOTS.find(s => `${s.start}-${s.end}` === e.target.value);
                setForm({ ...form, startTime: slot?.start || '', endTime: slot?.end || '' });
              }}>
                <option value="-">Pilih Slot Waktu</option>
                {TIME_SLOTS.map(s => <option key={s.start} value={`${s.start}-${s.end}`}>{s.label}</option>)}
              </select>
              <p className="text-xs text-slate-500 mt-1">1 hari maksimal 3 mata pelajaran (3 slot)</p>
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDelete show={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Hapus Penugasan" message="Hapus penugasan mengajar ini?" />
    </div>
  );
}
