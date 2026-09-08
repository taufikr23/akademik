import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { academicService } from '../../services/academicService';
import type { AcademicYear } from '../../types';

export default function AcademicYears() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState<AcademicYear | null>(null);
  const [deleteItem, setDeleteItem] = useState<AcademicYear | null>(null);
  const [form, setForm] = useState({ yearName: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await academicService.getAcademicYears();
      setAcademicYears(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ yearName: '' });
    setShowModal(true);
  };

  const openEdit = (item: AcademicYear) => {
    setEditItem(item);
    setForm({ yearName: item.yearName });
    setShowModal(true);
  };

  const openDelete = (item: AcademicYear) => {
    setDeleteItem(item);
    setShowDelete(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editItem) {
        await academicService.updateAcademicYear(editItem.id, form);
      } else {
        await academicService.createAcademicYear(form);
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
      await academicService.deleteAcademicYear(deleteItem.id);
      setShowDelete(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const columns = [
    { key: 'yearName', header: 'Year Name' },
    {
      key: 'isActive',
      header: 'Status',
      render: (item: AcademicYear) => (
        <span className={item.isActive ? 'badge bg-emerald-900/40 text-emerald-400' : 'badge bg-slate-700/50 text-slate-300'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'semesterCount',
      header: 'Semesters',
      render: (item: AcademicYear) => <span>{item.semesterCount}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: AcademicYear) => (
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
      <PageHeader title="Tahun Ajaran" action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah</button>} />
      <DataTable columns={columns} data={academicYears} loading={loading} />

      <Modal show={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label-field">Tahun Ajaran</label>
              <input
                type="text"
                className="input-field"
                value={form.yearName}
                onChange={(e) => setForm({ ...form, yearName: e.target.value })}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
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
