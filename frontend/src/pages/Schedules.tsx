import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import { scheduleService } from '../services/scheduleService';
import { academicService } from '../services/academicService';

interface LocalSchedule {
  id: number;
  classId: number;
  teacherId: number;
  subjectId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
}

interface ClassItem { id: number; name: string; }
interface TeacherItem { id: number; fullName: string; }
interface SubjectItem { id: number; name: string; }

const dayNames: Record<number, string> = { 1: 'Senin', 2: 'Selasa', 3: 'Rabu', 4: 'Kamis', 5: 'Jumat', 6: 'Sabtu', 7: 'Minggu' };

const initialForm = { classId: '', teacherId: '', subjectId: '', dayOfWeek: '1', startTime: '', endTime: '', room: '' };

export default function Schedules() {
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

  const load = async () => {
    setLoading(true);
    try {
      const [s, c, t, sub] = await Promise.all([
        scheduleService.getSchedules(),
        academicService.getClasses(),
        academicService.getTeachers(),
        academicService.getSubjects(),
      ]);
      setSchedules(s.data);
      setClasses(c.data);
      setTeachers(t.data);
      setSubjects(sub.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const classMap = Object.fromEntries(classes.map(c => [c.id, c.name]));
  const teacherMap = Object.fromEntries(teachers.map(t => [t.id, t.fullName]));
  const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s.name]));

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

  const columns = [
    { key: 'classId', label: 'Kelas', render: (item: LocalSchedule) => classMap[item.classId] ?? item.classId },
    { key: 'teacherId', label: 'Guru', render: (item: LocalSchedule) => teacherMap[item.teacherId] ?? item.teacherId },
    { key: 'subjectId', label: 'Mata Pelajaran', render: (item: LocalSchedule) => subjectMap[item.subjectId] ?? item.subjectId },
    { key: 'dayOfWeek', label: 'Hari', render: (item: LocalSchedule) => dayNames[item.dayOfWeek] ?? item.dayOfWeek },
    { key: 'timeRange', label: 'Jam', render: (item: LocalSchedule) => `${item.startTime} - ${item.endTime}` },
    { key: 'room', label: 'Ruang' },
    {
      key: 'actions', label: 'Aksi',
      render: (item: LocalSchedule) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
          <button onClick={() => openDelete(item)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Jadwal Pelajaran" action={<button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus size={16} /> Tambah</button>} />
      <DataTable columns={columns} data={schedules} loading={loading} />

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
