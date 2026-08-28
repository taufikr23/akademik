import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import { gradeService } from '../services/gradeService';
import { Edit, Trash2 } from 'lucide-react';

interface Grade {
  id: number;
  studentId: number;
  assignmentId: number | null;
  subjectId: number;
  score: number;
  grade: string;
  comments: string;
  semester: string;
  academicYear: string;
  gradeType: string;
}

const defaultForm = {
  studentId: 0,
  assignmentId: null as number | null,
  subjectId: 0,
  score: 0,
  grade: '',
  comments: '',
  semester: '',
  academicYear: '',
  gradeType: '',
};

export default function Grades() {
  const [data, setData] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editItem, setEditItem] = useState<Grade | null>(null);
  const [deleteItem, setDeleteItem] = useState<Grade | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await gradeService.getGrades();
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async () => {
    setError('');
    setSaving(true);
    try {
      if (editItem) {
        await gradeService.update(editItem.id, { ...formData, assignmentId: formData.assignmentId ?? 0 });
      } else {
        await gradeService.create({ ...formData, assignmentId: formData.assignmentId ?? 0 });
      }
      setModalOpen(false);
      setFormData(defaultForm);
      setEditItem(null);
      loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Gagal menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Grade) => {
    setEditItem(item);
    setFormData({
      studentId: item.studentId,
      assignmentId: item.assignmentId,
      subjectId: item.subjectId,
      score: item.score,
      grade: item.grade,
      comments: item.comments,
      semester: item.semester,
      academicYear: item.academicYear,
      gradeType: item.gradeType,
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await gradeService.delete(deleteItem.id);
      setDeleteItem(null);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 font-semibold';
    if (score >= 60) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  const columns = [
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Subject ID', accessor: 'subjectId' },
    {
      header: 'Nilai',
      accessor: (row: Grade) => (
        <span className={scoreColor(row.score)}>{row.score}</span>
      ),
    },
    { header: 'Grade', accessor: 'grade' },
    { header: 'Semester', accessor: 'semester' },
    { header: 'Tahun Akademik', accessor: 'academicYear' },
    { header: 'Tipe', accessor: 'gradeType' },
    { header: 'Komentar', accessor: 'comments' },
    {
      header: 'Aksi',
      accessor: (row: Grade) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="text-blue-600 hover:text-blue-800">
            <Edit size={16} />
          </button>
          <button onClick={() => setDeleteItem(row)} className="text-red-600 hover:text-red-800">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Nilai" action={<button onClick={() => { setEditItem(null); setFormData(defaultForm); setModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">Tambah</button>} />
      <DataTable columns={columns} data={data} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Nilai' : 'Tambah Nilai'}>
        <div className="space-y-4">
          <div className="label-field">Student ID</div>
          <div className="input-field">
            <input type="number" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Assignment ID (Opsional)</div>
          <div className="input-field">
            <input type="number" value={formData.assignmentId ?? ''} onChange={(e) => setFormData({ ...formData, assignmentId: e.target.value ? Number(e.target.value) : null })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Subject ID</div>
          <div className="input-field">
            <input type="number" value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Nilai</div>
          <div className="input-field">
            <input type="number" value={formData.score} onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Grade</div>
          <div className="input-field">
            <input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Komentar</div>
          <div className="input-field">
            <textarea value={formData.comments} onChange={(e) => setFormData({ ...formData, comments: e.target.value })} className="w-full border rounded px-3 py-2" rows={3} />
          </div>
          <div className="label-field">Semester</div>
          <div className="input-field">
            <input type="text" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Tahun Akademik</div>
          <div className="input-field">
            <input type="text" value={formData.academicYear} onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Tipe Nilai</div>
          <div className="input-field">
            <input type="text" value={formData.gradeType} onChange={(e) => setFormData({ ...formData, gradeType: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Batal</button>
            <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDelete isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Hapus Nilai" message="Yakin ingin menghapus data nilai ini?" />
    </div>
  );
}
