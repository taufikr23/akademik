import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { academicService } from '../../services/academicService';
import type { ClassRoom, Department, AcademicYear } from '../../types';

export default function Classes() {
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState<ClassRoom | null>(null);
  const [deleteItem, setDeleteItem] = useState<ClassRoom | null>(null);
  const [form, setForm] = useState({ name: '', departmentId: '', gradeLevel: '1', academicYearId: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [classData, deptData, yearData] = await Promise.all([
        academicService.getClasses(),
        academicService.getDepartments(),
        academicService.getAcademicYears(),
      ]);
      setClasses(classData.data);
      setDepartments(deptData.data);
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
    setForm({ name: '', departmentId: String(departments[0]?.id ?? ''), gradeLevel: '1', academicYearId: '' });
    setShowModal(true);
  };

  const openEdit = (item: ClassRoom) => {
    setEditItem(item);
    setForm({
      name: item.name,
      departmentId: String(item.departmentId),
      gradeLevel: String(item.gradeLevel),
      academicYearId: item.academicYearId ? String(item.academicYearId) : '',
    });
    setShowModal(true);
  };

  const openDelete = (item: ClassRoom) => {
    setDeleteItem(item);
    setShowDelete(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        departmentId: Number(form.departmentId),
        gradeLevel: Number(form.gradeLevel),
        academicYearId: form.academicYearId ? Number(form.academicYearId) : undefined,
      };
      if (editItem) {
        await academicService.updateClass(editItem.id, payload);
      } else {
        await academicService.createClass(payload);
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
      await academicService.deleteClass(deleteItem.id);
      setShowDelete(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'departmentId',
      header: 'Department',
      render: (item: ClassRoom) => departments.find((d) => d.id === item.departmentId)?.name ?? '-',
    },
    { key: 'gradeLevel', header: 'Grade Level' },
    {
      key: 'academicYearId',
      header: 'Academic Year',
      render: (item: ClassRoom) => academicYears.find((y) => y.id === item.academicYearId)?.yearName ?? '-',
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (item: ClassRoom) => (
        <span className={item.isActive ? 'badge bg-emerald-900/40 text-emerald-400' : 'badge bg-slate-700/50 text-slate-300'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: ClassRoom) => (
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
      <PageHeader title="Kelas" action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah</button>} />
      <DataTable columns={columns} data={classes} loading={loading} />

      <Modal show={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Kelas' : 'Tambah Kelas'}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label-field">Nama Kelas</label>
              <input
                type="text"
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">Jurusan</label>
              <select
                className="input-field"
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                required
              >
                <option value="">Pilih Jurusan</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Grade Level</label>
              <input
                type="number"
                className="input-field"
                min={1}
                value={form.gradeLevel}
                onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">Tahun Ajaran</label>
              <select
                className="input-field"
                value={form.academicYearId}
                onChange={(e) => setForm({ ...form, academicYearId: e.target.value })}
              >
                <option value="">Pilih Tahun Ajaran</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>{year.yearName}</option>
                ))}
              </select>
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
