import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { academicService } from '../../services/academicService';
import type { HomeroomTeacher, Teacher, ClassRoom, AcademicYear } from '../../types';

export default function HomeroomTeachers() {
  const [homeroomTeachers, setHomeroomTeachers] = useState<HomeroomTeacher[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState<HomeroomTeacher | null>(null);
  const [deleteItem, setDeleteItem] = useState<HomeroomTeacher | null>(null);
  const [form, setForm] = useState({ teacherId: '', classId: '', academicYearId: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [hmData, teacherData, classData, yearData] = await Promise.all([
        academicService.getHomeroomTeachers(),
        academicService.getTeachers(),
        academicService.getClasses(),
        academicService.getAcademicYears(),
      ]);
      setHomeroomTeachers(hmData.data);
      setTeachers(teacherData.data);
      setClasses(classData.data);
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
    setForm({ teacherId: teachers[0]?.id ? String(teachers[0].id) : '', classId: classes[0]?.id ? String(classes[0].id) : '', academicYearId: academicYears[0]?.id ? String(academicYears[0].id) : '' });
    setShowModal(true);
  };

  const openEdit = (item: HomeroomTeacher) => {
    setEditItem(item);
    setForm({ teacherId: String(item.teacherId), classId: String(item.classId), academicYearId: String(item.academicYearId) });
    setShowModal(true);
  };

  const openDelete = (item: HomeroomTeacher) => {
    setDeleteItem(item);
    setShowDelete(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      teacherId: Number(form.teacherId),
      classId: Number(form.classId),
      academicYearId: Number(form.academicYearId),
    };
    try {
      if (editItem) {
        await academicService.updateHomeroomTeacher(editItem.id, payload);
      } else {
        await academicService.createHomeroomTeacher(payload);
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
      await academicService.deleteHomeroomTeacher(deleteItem.id);
      setShowDelete(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const getTeacherName = (id: number) => teachers.find((t) => t.id === id)?.fullName ?? '-';
  const getClassName = (id: number) => classes.find((c) => c.id === id)?.name ?? '-';
  const getAcademicYearName = (id: number) => academicYears.find((y) => y.id === id)?.yearName ?? '-';

  const columns = [
    {
      key: 'teacherId',
      label: 'Teacher Name',
      render: (item: HomeroomTeacher) => getTeacherName(item.teacherId),
    },
    {
      key: 'classId',
      label: 'Class Name',
      render: (item: HomeroomTeacher) => getClassName(item.classId),
    },
    {
      key: 'academicYearId',
      label: 'Academic Year',
      render: (item: HomeroomTeacher) => getAcademicYearName(item.academicYearId),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: HomeroomTeacher) => (
        <span className={item.isActive ? 'badge bg-green-100 text-green-700' : 'badge bg-gray-100 text-gray-700'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: HomeroomTeacher) => (
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
      <PageHeader title="Wali Kelas" subtitle="Data Wali Kelas" action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah</button>} />
      <DataTable columns={columns} data={homeroomTeachers} loading={loading} />

      <Modal show={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Wali Kelas' : 'Tambah Wali Kelas'}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="label-field">Guru</label>
              <select
                className="input-field"
                value={form.teacherId}
                onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                required
              >
                <option value="">Pilih Guru</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>{t.fullName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Kelas</label>
              <select
                className="input-field"
                value={form.classId}
                onChange={(e) => setForm({ ...form, classId: e.target.value })}
                required
              >
                <option value="">Pilih Kelas</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Tahun Ajaran</label>
              <select
                className="input-field"
                value={form.academicYearId}
                onChange={(e) => setForm({ ...form, academicYearId: e.target.value })}
                required
              >
                <option value="">Pilih Tahun Ajaran</option>
                {academicYears.map((y) => (
                  <option key={y.id} value={y.id}>{y.yearName}</option>
                ))}
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
