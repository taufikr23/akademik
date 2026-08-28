import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { academicService } from '../../services/academicService';
import type { TeacherSubject, Teacher, Subject, AcademicYear } from '../../types';

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<TeacherSubject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteItem, setDeleteItem] = useState<TeacherSubject | null>(null);
  const [form, setForm] = useState({ teacherId: '', subjectId: '', academicYearId: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assignmentData, teacherData, subjectData, yearData] = await Promise.all([
        academicService.getTeacherSubjects(),
        academicService.getTeachers(),
        academicService.getSubjects(),
        academicService.getAcademicYears(),
      ]);
      setAssignments(assignmentData.data);
      setTeachers(teacherData.data);
      setSubjects(subjectData.data);
      setAcademicYears(yearData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => {
    setForm({ teacherId: teachers[0]?.id ? String(teachers[0].id) : '', subjectId: subjects[0]?.id ? String(subjects[0].id) : '', academicYearId: academicYears[0]?.id ? String(academicYears[0].id) : '' });
    setShowModal(true);
  };

  const openDelete = (item: TeacherSubject) => {
    setDeleteItem(item);
    setShowDelete(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await academicService.createTeacherSubject({
        teacherId: Number(form.teacherId),
        subjectId: Number(form.subjectId),
        academicYearId: Number(form.academicYearId),
      });
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
      await academicService.deleteTeacherSubject(deleteItem.id);
      setShowDelete(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const getTeacherName = (id: number) => teachers.find((t) => t.id === id)?.fullName ?? '-';
  const getSubjectName = (id: number) => subjects.find((s) => s.id === id)?.name ?? '-';
  const getAcademicYearName = (id: number) => academicYears.find((y) => y.id === id)?.yearName ?? '-';

  const columns = [
    {
      key: 'teacherId',
      label: 'Teacher Name',
      render: (item: TeacherSubject) => getTeacherName(item.teacherId),
    },
    {
      key: 'subjectId',
      label: 'Subject Name',
      render: (item: TeacherSubject) => getSubjectName(item.subjectId),
    },
    {
      key: 'academicYearId',
      label: 'Academic Year',
      render: (item: TeacherSubject) => getAcademicYearName(item.academicYearId),
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: TeacherSubject) => (
        <span className={item.isActive ? 'badge bg-green-100 text-green-700' : 'badge bg-gray-100 text-gray-700'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (item: TeacherSubject) => (
        <div className="flex gap-2">
          <button onClick={() => openDelete(item)} className="btn-icon text-red-600">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Guru - Mata Pelajaran" subtitle="Penugasan Guru ke Mata Pelajaran" action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah</button>} />
      <DataTable columns={columns} data={assignments} loading={loading} />

      <Modal show={showModal} onClose={() => setShowModal(false)} title="Tambah Penugasan">
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
              <label className="label-field">Mata Pelajaran</label>
              <select
                className="input-field"
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                required
              >
                <option value="">Pilih Mata Pelajaran</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
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
