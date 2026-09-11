import { useState, useEffect } from 'react';
import { Check, X, Users, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
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
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectUserId, setRejectUserId] = useState<number | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveUserId, setApproveUserId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleApprove = (userId: number) => {
    setApproveUserId(userId);
    setShowApproveModal(true);
  };

  const confirmApprove = async () => {
    if (!approveUserId) return;
    setProcessing(approveUserId);
    setShowApproveModal(false);
    try {
      await authService.approveUser(approveUserId);
      setToast({ type: 'success', message: 'Pendaftaran berhasil disetujui!' });
      load();
    } catch (e: any) {
      setToast({ type: 'error', message: e.response?.data?.message || 'Gagal menyetujui' });
    } finally { setProcessing(null); setApproveUserId(null); }
  };

  const handleReject = (userId: number) => {
    setRejectUserId(userId);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectUserId) return;
    setProcessing(rejectUserId);
    setShowRejectModal(false);
    try {
      await authService.rejectUser(rejectUserId);
      setToast({ type: 'success', message: 'Pendaftaran berhasil ditolak.' });
      load();
    } catch (e: any) {
      setToast({ type: 'error', message: e.response?.data?.message || 'Gagal menolak' });
    } finally { setProcessing(null); setRejectUserId(null); }
  };

  return (
    <div>
      <PageHeader title='Persetujuan Pendaftaran' subtitle='Setujui atau tolak pendaftaran siswa/guru baru' />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-sm ${
            toast.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-700 text-emerald-100'
              : 'bg-red-900/90 border-red-700 text-red-100'
          }`}>
            {toast.type === 'success'
              ? <CheckCircle size={20} className="text-emerald-400" />
              : <XCircle size={20} className="text-red-400" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Setujui */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowApproveModal(false)} />
          <div className="relative bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                <Check size={24} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Setujui Pendaftaran</h3>
                <p className="text-sm text-slate-400 mt-1">Akun akan diaktifkan dan user dapat login.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowApproveModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">Batal</button>
              <button onClick={confirmApprove} className="px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-2">
                <Check size={16} /> Setujui
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Tolak */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
          <div className="relative bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-900/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">Tolak Pendaftaran</h3>
                <p className="text-sm text-slate-400 mt-1">Pendaftaran ini akan ditolak dan tidak dapat login.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">Batal</button>
              <button onClick={confirmReject} className="px-4 py-2 text-sm font-medium text-white bg-red-700 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-2">
                <X size={16} /> Tolak
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-1 text-sm'>
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
                    className='flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50 text-sm font-medium transition-colors'>
                    <Check size={16} /> Setujui
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    disabled={processing === user.id}
                    className='flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 disabled:opacity-50 text-sm font-medium transition-colors'>
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
