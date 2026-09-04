import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { academicService } from '../../services/academicService';
import type { Semester, AcademicYear } from '../../types';

export default function Semesters() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState<Semester | null>(null);
  const [deleteItem, setDeleteItem] = useState<Semester | null>(null);
  const [form, setForm] = useState({ academicYearId: '', semesterType: 'GANJIL' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [semesterData, yearData] = await Promise.all([
        academicService.getSemesters(),
        academicService.getAcademicYears(),
      ]);
      setSemesters(semesterData.data);
      setAcademicYears(yearData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ academicYearId: academicYears[0]?.id ? String(academicYears[0].id) : '', semesterType: 'GANJIL' });
    setShowModal(true);
  };

  const openEdit = (item: Semester) => {
    setEditItem(item);
    setForm({ academicYearId: String(item.academicYearId), semesterType: item.semesterType });
    setShowModal(true);
  };

  const openDelete = (item: Semester) => {
    setDeleteItem(item);
    setShowDelete(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editItem) {
        await academicService.updateSemester(editItem.id, { academicYearId: Number(form.academicYearId), semesterType: form.semesterType });
      } else {
        await academicService.createSemester({ academicYearId: Number(form.academicYearId), semesterType: form.semesterType });
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
      await academicService.deleteSemester(deleteItem.id);
      setShowDelete(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const columns = [
    {
      key: 'semesterType',
      header: 'Semester Type',
      render: (item: Semester) => (
        <span className={item.semesterType === 'GANJIL' ? 'badge bg-blue-100 text-blue-700' : 'badge bg-purple-100 text-purple-700'}>
          {item.semesterType}
        </span>
      ),
    },
    {
      key: 'academicYearId',
      header: 'Academic Year',
      render: (item: Semester) => academicYears.find((y) => y.id === item.academicYearId)?.yearName ?? '-',
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (item: Semester) => (
        <span className={item.isActive ? 'badge bg-green-100 text-green-700' : 'badge bg-gray-100 text-gray-700'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Semester) => (
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
      <PageHeader title="Semester" action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah</button>} />
      <DataTable columns={columns} data={semesters} loading={loading} />

      <Modal show={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Semester' : 'Tambah Semester'}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label-field">Tahun Ajaran</label>
              <select
                className="input-field"
                value={form.academicYearId}
                onChange={(e) => setForm({ ...form, academicYearId: e.target.value })}
                required
              >
                <option value="">Pilih Tahun Ajaran</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>{year.yearName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Semester</label>
              <select
                className="input-field"
                value={form.semesterType}
                onChange={(e) => setForm({ ...form, semesterType: e.target.value })}
                required
              >
                <option value="GANJIL">GANJIL</option>
                <option value="GENAP">GENAP</option>
              </select>
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
