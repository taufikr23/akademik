import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { studentService } from '../../services/studentService';
import { academicService } from '../../services/academicService';

interface LocalStudent {
  id: number;
  nis: string;
  nisn: string;
  fullName: string;
  gender: string;
  phone: string;
  address: string;
  departmentId?: number;
  isActive?: boolean;
}

interface Department {
  id: number;
  name: string;
}

const initialForm = {
  nis: '', nisn: '', fullName: '', gender: 'LAKI_LAKI', phone: '', address: '', departmentId: '',
};

export default function Students() {
  const [students, setStudents] = useState<LocalStudent[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selected, setSelected] = useState<LocalStudent | null>(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const deptMap = useMemo(() => Object.fromEntries(departments.map(d => [d.id, d.name])), [departments]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await studentService.getStudents();
      const raw = res?.data;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      setStudents(list);
      try {
        const dRes = await academicService.getDepartments();
        const dRaw = dRes?.data;
        const dList = Array.isArray(dRaw) ? dRaw : Array.isArray(dRaw?.data) ? dRaw.data : [];
        setDepartments(dList);
      } catch { setDepartments([]); }
    } catch (e) { console.error('Load students error:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter(s =>
      s.fullName?.toLowerCase().includes(q) ||
      s.nis?.toLowerCase().includes(q) ||
      s.nisn?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      deptMap[s.departmentId!]?.toLowerCase().includes(q)
    );
  }, [students, search, deptMap]);

  const openAdd = () => { setEditingId(null); setForm(initialForm); setShowModal(true); };
  const openEdit = (s: LocalStudent) => {
    setEditingId(s.id);
    setForm({ nis: s.nis, nisn: s.nisn || '', fullName: s.fullName, gender: s.gender, phone: s.phone || '', address: s.address || '', departmentId: s.departmentId ? String(s.departmentId) : '' });
    setShowModal(true);
  };
  const openDelete = (s: LocalStudent) => { setSelected(s); setShowDelete(true); };

  const handleSave = async () => {
    setError('');
    if (!form.nis.trim()) { setError('NIS wajib diisi'); return; }
    if (!form.fullName.trim()) { setError('Nama lengkap wajib diisi'); return; }
    setSaving(true);
    try {
      const payload = { ...form, photoUrl: '', departmentId: form.departmentId ? Number(form.departmentId) : undefined };
      if (editingId) {
        await studentService.updateStudent(editingId, payload as any);
      } else {
        await studentService.createStudent(payload as any);
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Gagal menyimpan data');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (selected) {
      try {
        await studentService.deleteStudent(selected.id);
        setShowDelete(false);
        load();
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Gagal menghapus data');
        setShowDelete(false);
      }
    }
  };

  const columns = [
    { key: 'no', label: 'No.', render: (_: LocalStudent, i?: number) => (i ?? 0) + 1 },
    { key: 'nis', label: 'NIS' },
    { key: 'nisn', label: 'NISN', render: (v: LocalStudent) => v.nisn || '-' },
    { key: 'fullName', label: 'Nama Lengkap' },
    { key: 'gender', label: 'Jenis Kelamin', render: (v: LocalStudent) => v.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan' },
    { key: 'phone', label: 'Telepon', render: (v: LocalStudent) => v.phone || '-' },
    { key: 'departmentId', label: 'Jurusan', render: (v: LocalStudent) => deptMap[v.departmentId!] || '-' },
    {
      key: 'isActive', label: 'Status',
      render: (v: LocalStudent) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.isActive ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-700/50 text-slate-400'}`}>
          {v.isActive ? 'Aktif' : 'Nonaktif'}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Aksi',
      render: (row: LocalStudent) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(row)} className="text-primary-300 hover:text-primary-200"><Edit2 size={16} /></button>
          <button onClick={() => openDelete(row)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Data Siswa" action={<button onClick={openAdd} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"><Plus size={16} /> Tambah</button>} />

      <div className="bg-slate-800 rounded-xl shadow-lg shadow-black/20 p-4 mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, NIS, NISN, telepon, atau jurusan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 outline-none transition-colors"
          />
        </div>
        {search && (
          <button onClick={() => setSearch('')} className="text-sm text-slate-400 hover:text-slate-100 whitespace-nowrap">
            Reset
          </button>
        )}
        <span className="text-sm text-slate-400 whitespace-nowrap">{filtered.length} data</span>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Siswa' : 'Tambah Siswa'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">NIS</label>
              <input type="text" value={form.nis} onChange={e => setForm({ ...form, nis: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">NISN</label>
              <input type="text" value={form.nisn} onChange={e => setForm({ ...form, nisn: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
            <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-500" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Jenis Kelamin</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                <option value="LAKI_LAKI">Laki-laki</option>
                <option value="PEREMPUAN">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Jurusan</label>
              <select value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500">
                <option value="">Pilih Jurusan</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Telepon</label>
            <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Alamat</label>
            <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 placeholder-slate-500" rows={2} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-slate-100 transition-colors">Batal</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </Modal>

      <ConfirmDelete isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Hapus Siswa" message={`Hapus data siswa "${selected?.fullName}"?`} />
    </div>
  );
}
