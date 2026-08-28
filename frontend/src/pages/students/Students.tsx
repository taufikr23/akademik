import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { studentService } from '../../services/studentService';

interface LocalStudent {
  id: number;
  nis: string;
  nisn: string;
  fullName: string;
  gender: string;
  phone: string;
  address: string;
  status?: string;
}

const initialForm = {
  nis: '',
  nisn: '',
  fullName: '',
  gender: 'LAKI_LAKI',
  phone: '',
  address: '',
};

export default function Students() {
  const [students, setStudents] = useState<LocalStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<LocalStudent | null>(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await studentService.getStudents();
      setStudents(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEdit = (s: LocalStudent) => {
    setEditingId(s.id);
    setForm({ nis: s.nis, nisn: s.nisn, fullName: s.fullName, gender: s.gender, phone: s.phone, address: s.address });
    setShowModal(true);
  };

  const openDelete = (s: LocalStudent) => {
    setSelected(s);
    setShowDelete(true);
  };

  const handleSave = async () => {
    setError('');
    if (!form.nis.trim()) { setError('NIS wajib diisi'); return; }
    if (!form.fullName.trim()) { setError('Nama lengkap wajib diisi'); return; }
    setSaving(true);
    try {
      const payload = { ...form, photoUrl: '' };
      if (editingId) {
        await studentService.updateStudent(editingId, payload as any);
      } else {
        await studentService.createStudent(payload as any);
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Gagal menyimpan data';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await studentService.deleteStudent(selected.id);
        setShowDelete(false);
        load();
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Gagal menghapus data';
        alert(msg);
        setShowDelete(false);
      }
    }
  };

  const columns = [
    { key: 'nis', label: 'NIS' },
    { key: 'nisn', label: 'NISN' },
    { key: 'fullName', label: 'Nama Lengkap' },
    { key: 'gender', label: 'Jenis Kelamin', render: (v: LocalStudent) => v.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan' },
    { key: 'phone', label: 'Telepon' },
    {
      key: 'status', label: 'Status',
      render: (v: LocalStudent) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {v.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Aksi',
      render: (row: LocalStudent) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
          <button onClick={() => openDelete(row)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Data Siswa" action={<button onClick={openAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"><Plus size={16} /> Tambah</button>} />
      <DataTable columns={columns} data={students} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Siswa' : 'Tambah Siswa'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIS</label>
            <input type="text" value={form.nis} onChange={e => setForm({ ...form, nis: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NISN</label>
            <input type="text" value={form.nisn} onChange={e => setForm({ ...form, nisn: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full border rounded-lg px-3 py-2">
              <option value="LAKI_LAKI">Laki-laki</option>
              <option value="PEREMPUAN">Perempuan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telepon</label>
            <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border rounded-lg px-3 py-2" rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
      </Modal>

      <ConfirmDelete isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Hapus Siswa" message={`Hapus data siswa "${selected?.fullName}"?`} />
    </div>
  );
}
