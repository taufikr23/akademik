import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { scheduleService } from '../../services/scheduleService';

interface LocalEvent {
  id: number;
  title: string;
  eventType: string;
  description: string;
  startDate: string;
  endDate: string;
}

const eventTypeConfig: Record<string, { label: string; color: string }> = {
  EXAM: { label: 'Ujian', color: 'bg-red-900/40 text-red-400' },
  HOLIDAY: { label: 'Libur', color: 'bg-emerald-900/40 text-emerald-400' },
  CEREMONY: { label: 'Upacara', color: 'bg-primary-900/40 text-primary-300' },
  DEADLINE: { label: 'Batas Waktu', color: 'bg-orange-900/40 text-orange-400' },
};

const initialForm = { title: '', eventType: 'EXAM', description: '', startDate: '', endDate: '' };

export default function Events() {
  const [events, setEvents] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<LocalEvent | null>(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await scheduleService.getEvents();
      setEvents(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditingId(null); setForm(initialForm); setShowModal(true); };
  const openEdit = (e: LocalEvent) => {
    setEditingId(e.id);
    setForm({ title: e.title, eventType: e.eventType, description: e.description, startDate: e.startDate.slice(0, 10), endDate: e.endDate.slice(0, 10) });
    setShowModal(true);
  };
  const openDelete = (e: LocalEvent) => { setSelected(e); setShowDelete(true); };

  const handleSave = async () => {
    setError('');
    if (!form.title.trim()) { setError('Judul wajib diisi'); return; }
    setSaving(true);
    try {
      const payload = { title: form.title, eventType: form.eventType, description: form.description, startDate: form.startDate, endDate: form.endDate };
      if (editingId) {
        await scheduleService.updateEvent(editingId, payload);
      } else {
        await scheduleService.createEvent(payload);
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
        await scheduleService.deleteEvent(selected.id);
        setShowDelete(false);
        load();
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Gagal menghapus data');
        setShowDelete(false);
      }
    }
  };

  const formatDate = (v: string) => {
    if (!v) return '-';
    return new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const columns = [
    { key: 'title', label: 'Judul' },
    {
      key: 'eventType', label: 'Tipe',
      render: (item: LocalEvent) => {
        const cfg = eventTypeConfig[item.eventType] || { label: item.eventType, color: 'bg-slate-700/50 text-slate-400' };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>;
      },
    },
    { key: 'startDate', label: 'Tanggal Mulai', render: (item: LocalEvent) => formatDate(item.startDate) },
    { key: 'endDate', label: 'Tanggal Selesai', render: (item: LocalEvent) => formatDate(item.endDate) },
    { key: 'description', label: 'Deskripsi', render: (item: LocalEvent) => <span className="line-clamp-1 max-w-[200px]">{item.description}</span> },
    {
      key: 'actions', label: 'Aksi',
      render: (item: LocalEvent) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(item)} className="text-primary-300 hover:text-primary-200"><Edit2 size={16} /></button>
          <button onClick={() => openDelete(item)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Event Sekolah" action={<button onClick={openAdd} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"><Plus size={16} /> Tambah</button>} />
      <DataTable columns={columns} data={events} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Event' : 'Tambah Event'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Judul</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tipe Event</label>
            <select value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2">
              <option value="EXAM">Ujian</option>
              <option value="HOLIDAY">Libur</option>
              <option value="CEREMONY">Upacara</option>
              <option value="DEADLINE">Batas Waktu</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tanggal Mulai</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tanggal Selesai</label>
              <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-600 rounded-lg text-slate-400 hover:bg-slate-700/50">Batal</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </Modal>

      <ConfirmDelete isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Hapus Event" message={`Hapus event "${selected?.title}"?`} />
    </div>
  );
}
