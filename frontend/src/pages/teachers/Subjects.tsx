import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { academicService } from '../../services/academicService';
import type { Subject } from '../../types';

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState<Subject | null>(null);
  const [deleteItem, setDeleteItem] = useState<Subject | null>(null);
  const [form, setForm] = useState({ code: '', name: '', description: '', creditHours: 0 });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await academicService.getSubjects();
      setSubjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ code: '', name: '', description: '', creditHours: 0 });
    setShowModal(true);
  };

  const openEdit = (item: Subject) => {
    setEditItem(item);
    setForm({ code: item.code, name: item.name, description: item.description, creditHours: item.creditHours });
    setShowModal(true);
  };

  const openDelete = (item: Subject) => {
    setDeleteItem(item);
    setShowDelete(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editItem) {
        await academicService.updateSubject(editItem.id, form);
      } else {
        await academicService.createSubject(form);
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
      await academicService.deleteSubject(deleteItem.id);
      setShowDelete(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const columns = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'creditHours', label: 'Credit Hours' },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: Subject) => (
        <span className={item.isActive ? 'badge bg-green-100 text-green-700' : 'badge bg-gray-100 text-gray-700'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: Subject) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(item)} className="btn-icon">
            <Pencil size={16} />
          </button>
          <button onClick={() => openDelete(item)} className="btn-icon text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Mata Pelajaran" subtitle="Data Mata Pelajaran" action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah</button>} />
      <DataTable columns={columns} data={subjects} loading={loading} />

      <Modal show={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label-field">Code</label>
              <input
                type="text"
                className="input-field"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">Name</label>
              <input
                type="text"
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">Description</label>
              <textarea
                className="input-field"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <label className="label-field">Credit Hours</label>
              <input
                type="number"
                className="input-field"
                value={form.creditHours}
                onChange={(e) => setForm({ ...form, creditHours: Number(e.target.value) })}
                min={0}
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
