import { useState, useEffect } from 'react';
import { Check, X, Users, Clock } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { authService } from '../services/authService';

interface PendingUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  nisn: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  departmentId: number;
  classId: number;
  className: string;
  role: string;
  accountStatus: string;
  createdAt: string;
}

export default function PendingRegistrations() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await authService.getPendingRegistrations();
      const list = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
      setUsers(list);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (userId: number) => {
    setProcessing(userId);
    try {
      await authService.approveUser(userId);
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Gagal menyetujui');
    } finally { setProcessing(null); }
  };

  const handleReject = async (userId: number) => {
    if (!confirm('Tolak pendaftaran ini?')) return;
    setProcessing(userId);
    try {
      await authService.rejectUser(userId);
      load();
    } catch (e: any) {
      alert(e.response?.data?.message || 'Gagal menolak');
    } finally { setProcessing(null); }
  };

  return (
    <div>
      <PageHeader title='Persetujuan Pendaftaran' subtitle='Setujui atau tolak pendaftaran siswa/guru baru' />

      <div className='bg-slate-800 rounded-xl shadow-lg shadow-black/20 p-6 mb-6'>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-yellow-900/40 rounded-full'>
            <Clock size={24} className='text-yellow-400' />
          </div>
          <div>
            <p className='text-2xl font-bold text-slate-100'>{users.length}</p>
            <p className='text-sm text-slate-400'>Pendaftaran menunggu persetujuan</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <div className='w-8 h-8 border-4 border-primary-300 border-t-primary-500 rounded-full animate-spin' />
        </div>
      ) : users.length === 0 ? (
        <div className='bg-slate-800 rounded-xl shadow-lg shadow-black/20 p-12 text-center'>
          <Users size={48} className='text-slate-600 mx-auto mb-4' />
          <p className='text-slate-400'>Tidak ada pendaftaran baru yang menunggu</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {users.map((user) => (
            <div key={user.id} className='bg-slate-800 rounded-xl shadow-lg shadow-black/20 p-5'>
              <div className='flex items-start justify-between'>
                <div className='flex items-start gap-4'>
                  <div className={'w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ' + (user.role === 'SISWA' ? 'bg-primary-900/30' : 'bg-emerald-900/40')}>
                    <span className='text-2xl'>{user.role === 'SISWA' ? '\uD83C\uDF93' : '\uD83D\uDC68\u200D\uD83C\uDFEB'}</span>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='font-bold text-slate-100 text-lg'>{user.fullName || user.username}</h3>
                      <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (user.role === 'SISWA' ? 'bg-primary-900/30 text-primary-300' : 'bg-emerald-900/40 text-emerald-400')}>
                        {user.role === 'SISWA' ? 'Siswa' : 'Guru'}
                      </span>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-sm'>
                      <div><span className='text-slate-500'>{user.role === 'SISWA' ? 'NIS' : 'NIP'}:</span> <span className='text-slate-300 font-medium'>{user.username}</span></div>
                      {user.nisn && <div><span className='text-slate-500'>NISN:</span> <span className='text-slate-300'>{user.nisn}</span></div>}
                      {user.className && <div><span className='text-slate-500'>Kelas:</span> <span className='text-slate-300 font-medium'>{user.className}</span></div>}
                      <div><span className='text-slate-500'>Email:</span> <span className='text-slate-300'>{user.email}</span></div>
                      <div><span className='text-slate-500'>Gender:</span> <span className='text-slate-300'>{user.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}</span></div>
                      {user.dateOfBirth && <div><span className='text-slate-500'>Tgl Lahir:</span> <span className='text-slate-300'>{user.dateOfBirth}</span></div>}
                      {user.phone && <div><span className='text-slate-500'>Telp:</span> <span className='text-slate-300'>{user.phone}</span></div>}
                      {user.address && <div className='col-span-2'><span className='text-slate-500'>Alamat:</span> <span className='text-slate-300'>{user.address}</span></div>}
                    </div>
                    <p className='text-xs text-slate-500 mt-2'>Dibuat: {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className='flex items-center gap-2 flex-shrink-0 ml-4'>
                  <button
                    onClick={() => handleApprove(user.id)}
                    disabled={processing === user.id}
                    className='flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50 text-sm font-medium'>
                    <Check size={16} /> Setujui
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    disabled={processing === user.id}
                    className='flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 text-sm font-medium'>
                    <X size={16} /> Tolak
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
