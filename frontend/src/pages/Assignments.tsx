import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import { assignmentService } from '../services/assignmentService';
import { academicService } from '../services/academicService';
import { Edit, Trash2 } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  teacherId: number;
  classId: number | null;
  dueDate: string;
  maxScore: number;
  assignmentType: string;
}

const defaultForm = {
  title: '',
  description: '',
  subjectId: 0,
  teacherId: 0,
  classId: null as number | null,
  dueDate: '',
  maxScore: 0,
  assignmentType: '',
};

export default function Assignments() {
  const [data, setData] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editItem, setEditItem] = useState<Assignment | null>(null);
  const [deleteItem, setDeleteItem] = useState<Assignment | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await assignmentService.getAssignments();
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
        await assignmentService.update(editItem.id, { ...formData, classId: formData.classId ?? 0 });
      } else {
        await assignmentService.create({ ...formData, classId: formData.classId ?? 0 });
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

  const handleEdit = (item: Assignment) => {
    setEditItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      subjectId: item.subjectId,
      teacherId: item.teacherId,
      classId: item.classId,
      dueDate: item.dueDate,
      maxScore: item.maxScore,
      assignmentType: item.assignmentType,
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await assignmentService.delete(deleteItem.id);
      setDeleteItem(null);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const columns = [
    { header: 'Judul', accessor: 'title' },
    { header: 'Subject ID', accessor: 'subjectId' },
    { header: 'Teacher ID', accessor: 'teacherId' },
    { header: 'Class ID', accessor: (row: Assignment) => row.classId ?? '-' },
    { header: 'Batas Waktu', accessor: 'dueDate' },
    { header: 'Nilai Maks', accessor: 'maxScore' },
    { header: 'Tipe', accessor: 'assignmentType' },
    {
      header: 'Aksi',
      accessor: (row: Assignment) => (
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
      <PageHeader title="Tugas" action={<button onClick={() => { setEditItem(null); setFormData(defaultForm); setModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">Tambah</button>} />
      <DataTable columns={columns} data={data} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Tugas' : 'Tambah Tugas'}>
        <div className="space-y-4">
          <div className="label-field">Judul</div>
          <div className="input-field">
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Deskripsi</div>
          <div className="input-field">
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border rounded px-3 py-2" rows={3} />
          </div>
          <div className="label-field">Subject ID</div>
          <div className="input-field">
            <input type="number" value={formData.subjectId} onChange={(e) => setFormData({ ...formData, subjectId: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Teacher ID</div>
          <div className="input-field">
            <input type="number" value={formData.teacherId} onChange={(e) => setFormData({ ...formData, teacherId: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Class ID (Opsional)</div>
          <div className="input-field">
            <input type="number" value={formData.classId ?? ''} onChange={(e) => setFormData({ ...formData, classId: e.target.value ? Number(e.target.value) : null })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Batas Waktu</div>
          <div className="input-field">
            <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Nilai Maks</div>
          <div className="input-field">
            <input type="number" value={formData.maxScore} onChange={(e) => setFormData({ ...formData, maxScore: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Tipe Tugas</div>
          <div className="input-field">
            <input type="text" value={formData.assignmentType} onChange={(e) => setFormData({ ...formData, assignmentType: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Batal</button>
            <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDelete isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Hapus Tugas" message="Yakin ingin menghapus tugas ini?" />
    </div>
  );
}
