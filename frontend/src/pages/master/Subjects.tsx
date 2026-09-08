import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable, { Column } from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { subjectService, departmentService } from '../../services/academicService';

interface Subject {
  id: number;
  code: string;
  name: string;
  description: string;
  creditHours: number;
  jenis: 'UMUM' | 'KEJURUAN';
  departmentId?: number;
  departmentName?: string;
  isActive: boolean;
}

interface Department {
  id: number;
  name: string;
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editItem, setEditItem] = useState<Subject | null>(null);
  const [deleteItem, setDeleteItem] = useState<Subject | null>(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    creditHours: 0,
    jenis: 'UMUM' as 'UMUM' | 'KEJURUAN',
    departmentId: 0,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subjectsRes, departmentsRes] = await Promise.all([
        subjectService.getAll(),
        departmentService.getAll(),
      ]);
      setSubjects(subjectsRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm({ code: '', name: '', description: '', creditHours: 0, jenis: 'UMUM', departmentId: 0 });
    setShowModal(true);
  };

  const openEdit = (item: Subject) => {
    setEditItem(item);
    setForm({
      code: item.code,
      name: item.name,
      description: item.description,
      creditHours: item.creditHours,
      jenis: item.jenis,
      departmentId: item.departmentId || 0,
    });
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
      const payload = {
        ...form,
        departmentId: form.jenis === 'KEJURUAN' ? form.departmentId : null,
      };
      if (editItem) {
        await subjectService.update(editItem.id, payload);
      } else {
        await subjectService.create(payload);
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
      await subjectService.delete(deleteItem.id);
      setShowDelete(false);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const columns: Column<Subject>[] = [
    { header: 'Kode', accessor: 'code', width: '100px' },
    { header: 'Nama', accessor: 'name' },
    { header: 'Jenis', accessor: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        row.jenis === 'UMUM' ? 'bg-primary-900/40 text-primary-300' : 'bg-purple-900/40 text-purple-300'
      }`}>
        {row.jenis}
      </span>
    ), width: '120px' },
    { header: 'Jurusan', accessor: (row) => row.departmentName || '-', width: '120px' },
    { header: 'Jam', accessor: 'creditHours', width: '80px' },
    { header: 'Status', accessor: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
        row.isActive ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-700/50 text-slate-200'
      }`}>
        {row.isActive ? 'Aktif' : 'Non-aktif'}
      </span>
    ), width: '100px' },
    { header: 'Aksi', accessor: (row) => (
      <div className="flex gap-2">
        <button onClick={() => openEdit(row)} className="p-1 text-primary-300 hover:bg-primary-900/30 rounded">
          <Pencil size={16} />
        </button>
        <button onClick={() => openDelete(row)} className="p-1 text-red-400 hover:bg-red-900/30 rounded">
          <Trash2 size={16} />
        </button>
      </div>
    ), width: '100px' },
  ];

  return (
    <div>
      <PageHeader
        title="Mata Pelajaran"
        subtitle="Data Mata Pelajaran (UMUM & KEJURUAN)"
        action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Tambah</button>}
      />
      <DataTable columns={columns} data={subjects} loading={loading} searchPlaceholder="Cari mata pelajaran..." />

      <Modal show={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran'}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Kode</label>
              <input
                type="text"
                className="w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-800 text-slate-100"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nama</label>
              <input
                type="text"
                className="w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-800 text-slate-100"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Jenis</label>
              <select
                className="w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-800 text-slate-100"
                value={form.jenis}
                onChange={(e) => setForm({ ...form, jenis: e.target.value as 'UMUM' | 'KEJURUAN' })}
                required
              >
                <option value="UMUM">UMUM (Untuk Semua Jurusan)</option>
                <option value="KEJURUAN">KEJURUAN (Spesifik Jurusan)</option>
              </select>
            </div>
            {form.jenis === 'KEJURUAN' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Jurusan</label>
                <select
                  className="w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-800 text-slate-100"
                  value={form.departmentId}
                  onChange={(e) => setForm({ ...form, departmentId: Number(e.target.value) })}
                  required
                >
                  <option value="">Pilih Jurusan</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Deskripsi</label>
              <textarea
                className="w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-800 text-slate-100"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Jam Pelajaran</label>
              <input
                type="number"
                className="w-full border border-slate-600 rounded-lg px-3 py-2 bg-slate-800 text-slate-100"
                value={form.creditHours}
                onChange={(e) => setForm({ ...form, creditHours: Number(e.target.value) })}
                min={0}
                required
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
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
