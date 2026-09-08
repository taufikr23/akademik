import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { academicService } from '../../services/academicService';
import type { Teacher } from '../../types';

export default function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState<Teacher | null>(null);
  const [deleteItem, setDeleteItem] = useState<Teacher | null>(null);
  const [form, setForm] = useState({ nip: '', fullName: '', gender: 'Laki-laki', phone: '', email: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await academicService.getTeachers();
      setTeachers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ nip: '', fullName: '', gender: 'Laki-laki', phone: '', email: '' });
    setShowModal(true);
  };

  const openEdit = (item: Teacher) => {
    setEditItem(item);
    setForm({ nip: item.nip, fullName: item.fullName, gender: item.gender, phone: item.phone, email: item.email });
    setShowModal(true);
  };

  const openDelete = (item: Teacher) => {
    setDeleteItem(item);
    setShowDelete(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = { ...form, userId: 0, photoUrl: '' };
    try {
      if (editItem) {
        await academicService.updateTeacher(editItem.id, payload);
      } else {
        await academicService.createTeacher(payload);
      }
      setShowModal(false);
      loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await academicService.deleteTeacher(deleteItem.id);
      setShowDelete(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const columns = [
    { key: 'nip', label: 'NIP' },
    { key: 'fullName', label: 'Full Name' },
    {
      key: 'gender',
      label: 'Gender',
      render: (item: Teacher) => (
        <span className={item.gender === 'Laki-laki' ? 'badge bg-primary-900/40 text-primary-300' : 'badge bg-pink-900/40 text-pink-300'}>
          {item.gender === 'Laki-laki' ? 'Laki-laki' : 'Perempuan'}
        </span>
      ),
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: Teacher) => (
        <span className={item.isActive ? 'badge bg-emerald-900/30 text-emerald-400' : 'badge bg-slate-700/50 text-slate-400'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: Teacher) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(item)} className="btn-icon">
            <Pencil size={16} />
          </button>
          <button onClick={() => openDelete(item)} className="btn-icon text-red-400">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Guru" subtitle="Data Guru" action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah</button>} />
      <DataTable columns={columns} data={teachers} loading={loading} />

      <Modal show={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Guru' : 'Tambah Guru'}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label-field">NIP</label>
              <input
                type="text"
                className="input-field"
                value={form.nip}
                onChange={(e) => setForm({ ...form, nip: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">Full Name</label>
              <input
                type="text"
                className="input-field"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">Gender</label>
              <select
                className="input-field"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                required
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="label-field">Phone</label>
              <input
                type="text"
                className="input-field"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">Email</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDelete show={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} />
    </div>
  );
}
