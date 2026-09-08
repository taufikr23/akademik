import { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, GraduationCap, Camera, Upload,
  BookOpen,
  Calendar, Shield, BadgeCheck, CreditCard, Users, Building2, Hash
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

interface StudentProfile {
  id: number; userId: number; nis: string; nisn: string; fullName: string;
  gender: string; phone: string; address: string; className: string;
  departmentName?: string; departmentId: number; photoUrl?: string; isActive: boolean; createdAt: string;
}

interface TeacherProfile {
  id: number; userId: number; nip: string; fullName: string;
  gender: string; phone: string; email: string; photoUrl?: string; isActive: boolean; createdAt: string;
}

const genderLabel: Record<string, string> = { L: 'Laki-laki', P: 'Perempuan' };

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className='flex items-start gap-4 py-3 border-b border-slate-700 last:border-0'>
      <div className='w-9 h-9 bg-slate-700  rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5'>{icon}</div>
      <div className='flex-1'>
        <p className='text-xs text-slate-400 font-medium uppercase tracking-wide'>{label}</p>
        <p className='text-sm font-semibold text-slate-100  mt-0.5'>{value || '-'}</p>
      </div>
    </div>
  );
}
function getAvatarColor(role: string) {
  if (role === 'ADMIN') return 'bg-primary-600';
  if (role === 'GURU') return 'bg-primary-700';
  if (role === 'SISWA') return 'bg-primary-500';
  return 'bg-slate-600';
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useState<any>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (user?.role === "SISWA" && studentProfile) {
        const res = await api.post<any>("/api/students/" + studentProfile.id + "/photo", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setStudentProfile({ ...studentProfile, photoUrl: res.data });
      } else if (user?.role === "GURU" && teacherProfile) {
        const res = await api.post<any>("/api/teachers/" + teacherProfile.id + "/photo", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setTeacherProfile({ ...teacherProfile, photoUrl: res.data });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const getPhotoUrl = () => {
    if (user?.role === "SISWA" && studentProfile?.photoUrl) return "/api/students/photo/" + studentProfile.photoUrl;
    if (user?.role === "GURU" && teacherProfile?.photoUrl) return "/api/teachers/photo/" + teacherProfile.photoUrl;
    return null;
  };

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      if (user?.role === 'SISWA') {
        const res = await api.get<any>('/api/students/nis/' + user.username);
        const data = res.data;
        let deptName = '';
        if (data.departmentId) {
          try {
            const deptRes = await api.get<any>('/api/departments/' + data.departmentId);
            deptName = deptRes.data?.name || '';
          } catch {}
        }
        setStudentProfile({ ...data, departmentName: deptName });
      } else if (user?.role === 'GURU') {
        const res = await api.get<any>('/api/teachers/nip/' + user.username);
        setTeacherProfile(res.data);
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (<div className='flex items-center justify-center min-h-[400px]'><div className='w-8 h-8 border-4 border-primary-300 border-t-primary-500 rounded-full animate-spin' /></div>);
  }

  const displayName = studentProfile?.fullName || teacherProfile?.fullName || user?.username || '-';
  const roleLabel = user?.role === 'ADMIN' ? 'Administrator' : user?.role === 'GURU' ? 'Guru' : 'Siswa';
  const color = getAvatarColor(user?.role || '');
  return (
    <div>
      <PageHeader title='Profil Saya' subtitle='Lihat data profil akun Anda' />
      <div className='bg-slate-800  rounded-2xl shadow-lg shadow-black/20 border border-slate-700 overflow-hidden mb-6'>
        <div className={color + ' h-28'} />
        <div className='px-6 pb-6'>
          <div className='flex items-end gap-4 -mt-10'>
            <label className={color + ' w-20 h-20 rounded-2xl flex items-center justify-center text-white  text-2xl font-bold shadow-lg shadow-black/20 border-4 border-slate-700 relative cursor-pointer overflow-hidden group'}>
              {getPhotoUrl() ? (
                <img src={getPhotoUrl()!} alt={displayName} className='w-full h-full object-cover' />
              ) : (
                <>{studentProfile?.fullName || teacherProfile?.fullName ? getInitials(displayName) : <User size={32} />}</>
              )}
              <input type='file' accept='image/*' className='hidden' onChange={handlePhotoUpload} />
              <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                {uploading ? (
                  <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                ) : (
                  <Camera size={20} className='text-white' />
                )}
              </div>
            </label>
            <div className='pb-1'>
              <h2 className='text-xl font-bold text-slate-100'>{displayName}</h2>
              <div className='flex items-center gap-2 mt-1'>
                <span className={color + ' inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold text-slate-100 '}><Shield size={12} /> {roleLabel}</span>
                <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/30 text-emerald-400'><BadgeCheck size={12} /> Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-slate-800  rounded-2xl shadow-lg shadow-black/20 border border-slate-700 p-6'>
          <h3 className='text-base font-bold text-slate-100  mb-4 flex items-center gap-2'><User size={18} className='text-slate-400' /> Biodata Diri</h3>
          <InfoRow icon={<User size={16} className='text-slate-400' />} label='Nama Lengkap' value={displayName} />
          <InfoRow icon={<CreditCard size={16} className='text-slate-400' />} label={user?.role === 'SISWA' ? 'NIS' : user?.role === 'GURU' ? 'NIP' : 'Username'} value={user?.username || '-'} />
          {studentProfile?.nisn && <InfoRow icon={<Hash size={16} className='text-slate-400' />} label='NISN' value={studentProfile.nisn} />}
          <InfoRow icon={<Users size={16} className='text-slate-400' />} label='Jenis Kelamin' value={genderLabel[studentProfile?.gender || teacherProfile?.gender || ''] || '-'} />
        </div>
        <div className='bg-slate-800  rounded-2xl shadow-lg shadow-black/20 border border-slate-700 p-6'>
          <h3 className='text-base font-bold text-slate-100  mb-4 flex items-center gap-2'><Phone size={18} className='text-slate-400' /> Informasi Kontak</h3>
          <InfoRow icon={<Phone size={16} className='text-slate-400' />} label='No. Telepon' value={studentProfile?.phone || teacherProfile?.phone || '-'} />
          {teacherProfile?.email && <InfoRow icon={<Mail size={16} className='text-slate-400' />} label='Email' value={teacherProfile.email} />}
          {studentProfile?.address && <InfoRow icon={<MapPin size={16} className='text-slate-400' />} label='Alamat' value={studentProfile.address} />}
        </div>
        {user?.role === 'SISWA' && studentProfile && (
          <div className='bg-slate-800  rounded-2xl shadow-lg shadow-black/20 border border-slate-700 p-6 md:col-span-2'>
            <h3 className='text-base font-bold text-slate-100  mb-4 flex items-center gap-2'><GraduationCap size={18} className='text-slate-400' /> Informasi Akademik</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-0'>
              <InfoRow icon={<Building2 size={16} className='text-slate-400' />} label='Kelas' value={studentProfile.className || '-'} />
              <InfoRow icon={<BookOpen size={16} className='text-slate-400' />} label='Jurusan' value={studentProfile.departmentName || '-'} />
              <InfoRow icon={<Calendar size={16} className='text-slate-400' />} label='Tahun Masuk' value={studentProfile.createdAt ? new Date(studentProfile.createdAt).getFullYear().toString() : '-'} />
              <InfoRow icon={<Shield size={16} className='text-slate-400' />} label='Status' value={studentProfile.isActive ? 'Aktif' : 'Non-aktif'} />
            </div>
          </div>
        )}
        {user?.role === 'GURU' && teacherProfile && (
          <div className='bg-slate-800  rounded-2xl shadow-lg shadow-black/20 border border-slate-700 p-6 md:col-span-2'>
            <h3 className='text-base font-bold text-slate-100  mb-4 flex items-center gap-2'><BookOpen size={18} className='text-slate-400' /> Informasi Kepegawaian</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-0'>
              <InfoRow icon={<Shield size={16} className='text-slate-400' />} label='Status' value={teacherProfile.isActive ? 'Aktif' : 'Non-aktif'} />
              <InfoRow icon={<Calendar size={16} className='text-slate-400' />} label='Terdaftar Sejak' value={teacherProfile.createdAt ? new Date(teacherProfile.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
