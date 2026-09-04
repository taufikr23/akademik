import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { scheduleService } from '../../services/scheduleService';
import { academicService, teacherSubjectService } from '../../services/academicService';
import { useAuth } from '../../context/AuthContext';

interface LocalSchedule {
  id: number;
  classId: number;
  className: string;
  departmentName?: string;
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

interface ClassItem { id: number; name: string; }
interface TeacherItem { id: number; fullName: string; }
interface SubjectItem { id: number; name: string; }

const dayNames: Record<number, string> = { 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu', 7: 'Minggu' };
const dayColors: Record<number, string> = { 1: 'bg-blue-50 border-blue-400', 2: 'bg-emerald-50 border-emerald-400', 3: 'bg-yellow-50 border-yellow-400', 4: 'bg-purple-50 border-purple-400', 5: 'bg-red-50 border-red-400', 6: 'bg-indigo-50 border-indigo-400' };

const initialForm = { classId: '', teacherId: '', subjectId: '', dayOfWeek: '1', startTime: '', endTime: '', room: '' };

export default function Schedules() {
  const { user } = useAuth();
  const isStudent = user?.role === 'SISWA';
  const isTeacher = user?.role === 'GURU';

  const [schedules, setSchedules] = useState<LocalSchedule[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<LocalSchedule | null>(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [c, t, sub] = await Promise.all([
        academicService.getClasses(),
        academicService.getTeachers(),
        academicService.getSubjects(),
      ]);
      setClasses(c.data);
      setTeachers(t.data);
      setSubjects(sub.data);

      if (isStudent && user) {
        // Fetch student data to get classId
        try {
          const studentRes = await import('../../api/client').then(m => m.default.get('/api/students'));
          const students = Array.isArray(studentRes.data) ? studentRes.data : [];
          const myStudent = students.find((s: any) => s.nis === user.username || s.userId === user.id);
          if (myStudent?.classId) {
            const sRes = await teacherSubjectService.getByClass(myStudent.classId);
            setSchedules(sRes.data);
          } else {
            setSchedules([]);
          }
        } catch { setSchedules([]); }
      } else if (isTeacher && user) {
        try {
          const teacherRes = await import('../../api/client').then(m => m.default.get('/api/teachers'));
          const teachers = Array.isArray(teacherRes.data) ? teacherRes.data : [];
          const myTeacher = teachers.find((t: any) => t.nip === user.username || t.userId === user.id);
          if (myTeacher?.id) {
            const sRes = await teacherSubjectService.getByTeacher(myTeacher.id);
            setSchedules(sRes.data);
          } else {
            setSchedules([]);
          }
        } catch { setSchedules([]); }
      } else {
        const s = await scheduleService.getSchedules();
        setSchedules(s.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditingId(null); setForm(initialForm); setShowModal(true); };
  const openEdit = (s: LocalSchedule) => {
    setEditingId(s.id);
    setForm({ classId: String(s.classId), teacherId: String(s.teacherId), subjectId: String(s.subjectId), dayOfWeek: String(s.dayOfWeek), startTime: s.startTime, endTime: s.endTime, room: s.room });
    setShowModal(true);
  };
  const openDelete = (s: LocalSchedule) => { setSelected(s); setShowDelete(true); };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const payload = {
        classId: Number(form.classId),
        teacherId: Number(form.teacherId),
        subjectId: Number(form.subjectId),
        dayOfWeek: Number(form.dayOfWeek),
        startTime: form.startTime,
        endTime: form.endTime,
        room: form.room,
      };
      if (editingId) {
        await scheduleService.updateSchedule(editingId, payload);
      } else {
        await scheduleService.createSchedule(payload);
      }
      setShowModal(false);
      load();
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
        await scheduleService.deleteSchedule(selected.id);
        setShowDelete(false);
        load();
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Gagal menghapus data');
        setShowDelete(false);
      }
    }
  };

  const filtered = schedules.filter(s => {
    if (selectedDay && s.dayOfWeek !== selectedDay) return false;
    if (search) {
      const q = search.toLowerCase();
      return (s.className || '').toLowerCase().includes(q) || (s.teacherName || '').toLowerCase().includes(q) || (s.subjectName || '').toLowerCase().includes(q);
    }
    return true;
  });

  // Group by day for student view
  const grouped = Object.keys(dayNames).map(Number).map(day => ({
    day,
    label: dayNames[day],
    items: filtered.filter(s => s.dayOfWeek === day).sort((a, b) => (a.startTime || '').localeCompare(b.startTime || '')),
  })).filter(g => g.items.length > 0);

  const columns = [
    { key: 'className', label: 'Kelas' },
    { key: 'teacherName', label: 'Guru' },
    { key: 'subjectName', label: 'Mata Pelajaran' },
    { key: 'dayOfWeek', label: 'Hari', render: (item: LocalSchedule) => dayNames[item.dayOfWeek] ?? item.dayOfWeek },
    { key: 'timeRange', label: 'Jam', render: (item: LocalSchedule) => `${item.startTime} - ${item.endTime}` },
    { key: 'room', label: 'Ruang' },
    ...(isStudent || isTeacher ? [] : [{
      key: 'actions', label: 'Aksi',
      render: (item: LocalSchedule) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
          <button onClick={() => openDelete(item)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
        </div>
      ),
    }]),
  ];

  return (
    <div>
      <PageHeader title="Jadwal Pelajaran" subtitle={isStudent ? 'Jadwal pelajaran kelas Anda' : isTeacher ? 'Jadwal mengajar Anda' : 'Atur jadwal pelajaran semua kelas'} action={(!isStudent && !isTeacher) ? <button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus size={16} /> Tambah</button> : undefined} />

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-4">
        <input type="text" placeholder="Cari kelas, guru, atau mapel..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        <div className="flex gap-1">
          <button onClick={() => setSelectedDay(null)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!selectedDay ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Semua</button>
          {[1,2,3,4,5,6].map(d => (
            <button key={d} onClick={() => setSelectedDay(d)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedDay === d ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{dayNames[d]}</button>
          ))}
        </div>
      </div>

      {/* Student/Teacher view: grouped by day */}
      {(isStudent || isTeacher) ? (
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12"><div className='w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin' /></div>
          ) : grouped.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center"><Calendar size={48} className='text-gray-300 mx-auto mb-4' /><p className='text-gray-500'>Tidak ada jadwal</p></div>
          ) : grouped.map(g => (
            <div key={g.day}>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{g.label}</h3>
              <div className="space-y-3">
                {g.items.map(s => (
                  <div key={s.id} className={`bg-white rounded-xl shadow-sm border-l-4 p-4 ${dayColors[g.day] || 'bg-gray-50 border-gray-400'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[70px]">
                          <p className="text-sm font-bold text-gray-900">{s.startTime}</p>
                          <p className='text-xs text-gray-400'>s/d</p>
                          <p className="text-sm font-bold text-gray-900">{s.endTime}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{s.subjectName || `Mapel #${s.subjectId}`}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{s.className || '-'}</span>
                            {s.departmentName && (
                              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">{s.departmentName}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Guru: {s.teacherName || `-`} | Ruang: {s.room || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Admin view: table */
        <DataTable columns={columns} data={filtered} loading={loading} />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Jadwal' : 'Tambah Jadwal'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
            <select value={form.classId} onChange={e => setForm({ ...form, classId: e.target.value })} className="w-full border rounded-lg px-3 py-2">
              <option value="">Pilih Kelas</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guru</label>
            <select value={form.teacherId} onChange={e => setForm({ ...form, teacherId: e.target.value })} className="w-full border rounded-lg px-3 py-2">
              <option value="">Pilih Guru</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.fullName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mata Pelajaran</label>
            <select value={form.subjectId} onChange={e => setForm({ ...form, subjectId: e.target.value })} className="w-full border rounded-lg px-3 py-2">
              <option value="">Pilih Mata Pelajaran</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hari</label>
            <select value={form.dayOfWeek} onChange={e => setForm({ ...form, dayOfWeek: e.target.value })} className="w-full border rounded-lg px-3 py-2">
              {Object.entries(dayNames).map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
              <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
              <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ruang</label>
            <input type="text" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </Modal>

      <ConfirmDelete isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Hapus Jadwal" message="Hapus jadwal pelajaran ini?" />
    </div>
  );
}
