import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ConfirmDelete from '../components/ConfirmDelete';
import { attendanceService } from '../services/attendanceService';
import { studentService } from '../services/studentService';
import { scheduleService } from '../services/scheduleService';
import { Edit, Trash2 } from 'lucide-react';

interface Attendance {
  id: number;
  studentId: number;
  scheduleId: number;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  location: string;
  notes: string;
}

const defaultForm = {
  studentId: 0,
  scheduleId: 0,
  date: '',
  checkInTime: '',
  checkOutTime: '',
  status: 'HADIR',
  location: '',
  notes: '',
};

const statusColors: Record<string, string> = {
  HADIR: 'bg-green-100 text-green-800',
  IZIN: 'bg-yellow-100 text-yellow-800',
  SAKIT: 'bg-blue-100 text-blue-800',
  ALPHA: 'bg-red-100 text-red-800',
};

export default function Attendance() {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [editItem, setEditItem] = useState<Attendance | null>(null);
  const [deleteItem, setDeleteItem] = useState<Attendance | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await attendanceService.getAttendances();
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
        await attendanceService.update(editItem.id, formData);
      } else {
        await attendanceService.create(formData);
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

  const handleEdit = (item: Attendance) => {
    setEditItem(item);
    setFormData({
      studentId: item.studentId,
      scheduleId: item.scheduleId,
      date: item.date,
      checkInTime: item.checkInTime,
      checkOutTime: item.checkOutTime,
      status: item.status,
      location: item.location,
      notes: item.notes,
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await attendanceService.delete(deleteItem.id);
      setDeleteItem(null);
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal menghapus data');
    }
  };

  const columns = [
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Schedule ID', accessor: 'scheduleId' },
    { header: 'Tanggal', accessor: 'date' },
    { header: 'Check-in', accessor: 'checkInTime' },
    { header: 'Check-out', accessor: 'checkOutTime' },
    {
      header: 'Status',
      accessor: (row: Attendance) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.status] || 'bg-gray-100 text-gray-800'}`}>
          {row.status}
        </span>
      ),
    },
    { header: 'Catatan', accessor: 'notes' },
    {
      header: 'Aksi',
      accessor: (row: Attendance) => (
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
      <PageHeader title="Kehadiran" action={<button onClick={() => { setEditItem(null); setFormData(defaultForm); setModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">Tambah</button>} />
      <DataTable columns={columns} data={data} loading={loading} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Kehadiran' : 'Tambah Kehadiran'}>
        <div className="space-y-4">
          <div className="label-field">Student ID</div>
          <div className="input-field">
            <input type="number" value={formData.studentId} onChange={(e) => setFormData({ ...formData, studentId: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Schedule ID</div>
          <div className="input-field">
            <input type="number" value={formData.scheduleId} onChange={(e) => setFormData({ ...formData, scheduleId: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Tanggal</div>
          <div className="input-field">
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Waktu Masuk</div>
          <div className="input-field">
            <input type="time" value={formData.checkInTime} onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Waktu Keluar</div>
          <div className="input-field">
            <input type="time" value={formData.checkOutTime} onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Status</div>
          <div className="input-field">
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full border rounded px-3 py-2">
              <option value="HADIR">HADIR</option>
              <option value="IZIN">IZIN</option>
              <option value="SAKIT">SAKIT</option>
              <option value="ALPHA">ALPHA</option>
            </select>
          </div>
          <div className="label-field">Lokasi</div>
          <div className="input-field">
            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="label-field">Catatan</div>
          <div className="input-field">
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full border rounded px-3 py-2" rows={3} />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Batal</button>
            <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </div>
      </Modal>

      <ConfirmDelete isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} title="Hapus Kehadiran" message={`Yakin ingin mengapus data kehadiran ini?`} />
    </div>
  );
}
