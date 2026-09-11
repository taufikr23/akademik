import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, GraduationCap, Users } from 'lucide-react';
import { authService } from '../services/authService';
import { academicService } from '../services/academicService';

const DEPARTMENTS = [
  { id: 1, name: 'TITL', fullName: 'Teknik Instalasi Tenaga Listrik' },
  { id: 2, name: 'TSM', fullName: 'Teknik Sepeda Motor' },
  { id: 3, name: 'DPIB', fullName: 'Desain Pemodelan dan Informasi Bangunan' },
  { id: 4, name: 'TKP', fullName: 'Teknik Konstruksi dan Perumahan' },
  { id: 5, name: 'APAT', fullName: 'Agribisnis Perikanan Air Tawar' },
  { id: 6, name: 'TKR', fullName: 'Teknik Kendaraan Ringan' },
  { id: 7, name: 'TKPI', fullName: 'Teknik Kapal Penangkap Ikan' },
  { id: 8, name: 'NKPI', fullName: 'Nautika Kapal Penangkap Ikan' },
];

const inputCls = 'w-full border rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all duration-200';
const inputStyle = { backgroundColor: '#1a2236', borderColor: '#2a3554' };
const labelCls = 'block text-sm font-semibold text-slate-300 mb-1.5';
const TRANSITION = 'transform 700ms cubic-bezier(0.4, 0, 0.2, 1)';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [role, setRole] = useState<'SISWA' | 'GURU'>('SISWA');
  const [f, setF] = useState({ nis: '', nisn: '', name: '', gender: 'LAKI_LAKI', dob: '', phone: '', addr: '', email: '', dept: '', cls: '', pass: '', pass2: '' });
  const [showP, setShowP] = useState(false);
  const [err, setErr] = useState('');
  const [load, setLoad] = useState(false);
  const [ok, setOk] = useState(false);
  const [contentFade, setContentFade] = useState(true);
  const [formSlideIn, setFormSlideIn] = useState(false);
  const [classes, setClasses] = useState<{id:number;name:string;departmentId:number}[]>([]);

  const il = role === 'SISWA';

  useEffect(() => {
    academicService.getClasses().then(res => {
      const data = Array.isArray(res.data) ? res.data : [];
      setClasses(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (step === 'form') {
      const t = setTimeout(() => setFormSlideIn(true), 50);
      return () => clearTimeout(t);
    }
  }, [step]);

  const W = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF(p => ({ ...p, [k]: e.target.value }));

  const handleRoleSelect = (r: 'SISWA' | 'GURU') => {
    setRole(r);
    setStep('form');
  };

  const handleBack = () => {
    setFormSlideIn(false);
    setTimeout(() => setStep('role'), 700);
  };

  const handleRoleSwitch = (newRole: 'SISWA' | 'GURU') => {
    if (newRole === role) return;
    setContentFade(false);
    setTimeout(() => {
      setRole(newRole);
      setF({ nis: '', nisn: '', name: '', gender: 'LAKI_LAKI', dob: '', phone: '', addr: '', email: '', dept: '', cls: '', pass: '', pass2: '' });
      setErr('');
      setContentFade(true);
    }, 350);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (f.pass !== f.pass2) { setErr('Password tidak cocok'); return; }
    if (f.pass.length < 6) { setErr('Password minimal 6 karakter'); return; }
    setLoad(true);
    try {
      await authService.register({
        username: f.nis, nisn: role === 'SISWA' ? f.nisn : undefined, fullName: f.name,
        gender: f.gender, dateOfBirth: f.dob || undefined, phone: f.phone || undefined,
        address: f.addr || undefined, email: f.email,
        departmentId: role === 'SISWA' && f.dept ? Number(f.dept) : undefined,
        classId: role === 'SISWA' && f.cls ? Number(f.cls) : undefined,
        role, password: f.pass,
      });
      setOk(true);
    } catch (e: any) { setErr(e.response?.data?.message || e.message || 'Gagal mendaftar — periksa koneksi server'); }
    finally { setLoad(false); }
  };

  if (ok) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a] p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-lg p-8 text-center border border-slate-700">
        <div className="w-16 h-16 bg-yellow-900/40 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">⏳</span></div>
        <h2 className="text-xl font-bold text-slate-100 mb-2">Pendaftaran Berhasil!</h2>
        <p className="text-slate-400 text-sm mb-1">Status: <strong className="text-slate-200">Menunggu Persetujuan Admin</strong></p>
        <p className="text-slate-500 text-sm mb-6">Tunggu email notifikasi sebelum login.</p>
        <button onClick={() => navigate('/login')} className="btn-primary w-full py-3 text-sm">Kembali ke Login</button>
      </div>
    </div>
  );

  if (step === 'role') return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-primary-800 via-primary-900 to-[#081a47] items-center justify-center p-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-48 h-48 flex items-center justify-center mb-6">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
              alt="Tut Wuri Handayani" 
              className="w-full h-full drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">SIASEK</h1>
          <p className="text-lg text-primary-200">Sistem Informasi Akademik Sekolah</p>
          <p className="text-primary-300 mt-3 text-sm">Daftar sebagai Siswa atau Guru</p>
        </div>
      </div>
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 bg-[#0a0f1a]">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-slate-100 mb-1">Daftar Akun Baru</h2>
          <p className="text-sm text-slate-400 mb-6">Pilih jenis akun</p>
          <div className="space-y-3">
            <button onClick={() => handleRoleSelect('SISWA')} className="w-full flex items-center gap-4 p-5 bg-slate-800 border border-slate-700 rounded-xl hover:border-primary-500 transition-all">
              <div className="w-14 h-14 bg-primary-900/50 rounded-xl flex items-center justify-center"><GraduationCap size={28} className="text-primary-300" /></div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-100 text-lg">Siswa</h3>
                <p className="text-sm text-slate-400">Daftar sebagai siswa baru SMK</p>
              </div>
            </button>
            <button onClick={() => handleRoleSelect('GURU')} className="w-full flex items-center gap-4 p-5 bg-slate-800 border border-slate-700 rounded-xl hover:border-primary-500 transition-all">
              <div className="w-14 h-14 bg-primary-900/50 rounded-xl flex items-center justify-center"><Users size={28} className="text-primary-300" /></div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-100 text-lg">Guru</h3>
                <p className="text-sm text-slate-400">Daftar sebagai guru SMK</p>
              </div>
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-6 text-center">
            Sudah punya akun? <Link to="/login" className="text-primary-300 font-medium hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );

  const blueTransform = formSlideIn
    ? (il ? 'translateX(0)' : 'translateX(150%)')
    : 'translateX(-100%)';
  const formTransform = formSlideIn
    ? (il ? 'translateX(0)' : 'translateX(-66.67%)')
    : 'translateX(100%)';

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0f1a]">
      <div
        className="hidden lg:flex absolute top-0 bottom-0 left-0 w-2/5 bg-gradient-to-br from-primary-800 via-primary-900 to-[#081a47] items-center justify-center p-8 z-0"
        style={{ transform: blueTransform, transition: TRANSITION }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-48 h-48 flex items-center justify-center mb-6">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
              alt="Tut Wuri Handayani" 
              className="w-full h-full drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">SIASEK</h1>
          <p className="text-lg text-primary-200">{il ? 'Pendaftaran Siswa' : 'Pendaftaran Guru'}</p>
        </div>
      </div>

      <div
        className="lg:absolute top-0 bottom-0 lg:left-[40%] lg:w-[60%] w-full bg-[#0a0f1a] flex items-center justify-center p-6 overflow-y-auto z-10"
        style={{ transform: formTransform, transition: TRANSITION }}
      >
        <div className="w-full max-w-lg">
          <button onClick={handleBack} className="text-sm text-slate-500 hover:text-slate-300 mb-3">← Kembali</button>
          <h2 className="text-2xl font-bold text-slate-100 mb-1">{il ? 'Formulir Siswa' : 'Formulir Guru'}</h2>
          <p className="text-sm text-slate-400 mb-4">Isi data lengkap untuk mendaftar</p>

          <div className="flex bg-slate-800 rounded-lg p-1 mb-4 border border-slate-700">
            <button onClick={() => handleRoleSwitch('SISWA')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${il ? 'bg-primary-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
              Siswa
            </button>
            <button onClick={() => handleRoleSwitch('GURU')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-300 ${!il ? 'bg-primary-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
              Guru
            </button>
          </div>

          {err && <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-2 rounded-lg mb-3 text-sm">{err}</div>}

          <div className={`transition-all duration-300 ${contentFade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>{il ? 'NIS' : 'NIP'} *</label>
                  <input type="text" className={inputCls} style={inputStyle} placeholder={il ? 'Nomor Induk Siswa' : 'Nomor Induk Pegawai'} value={f.nis} onChange={W('nis')} required />
                </div>
                {il && (
                  <div>
                    <label className={labelCls}>NISN *</label>
                    <input type="text" className={inputCls} style={inputStyle} placeholder="Nomor Induk Siswa Nasional" value={f.nisn} onChange={W('nisn')} required />
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Nama Lengkap *</label>
                <input type="text" className={inputCls} style={inputStyle} placeholder="Sesuai KK" value={f.name} onChange={W('name')} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Gender *</label>
                  <select className={inputCls} style={inputStyle} value={f.gender} onChange={W('gender')}>
                    <option value="LAKI_LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Tgl Lahir</label>
                  <input type="date" className={inputCls} style={inputStyle} value={f.dob} onChange={W('dob')} />
                </div>
                <div>
                  <label className={labelCls}>Telepon</label>
                  <input type="tel" className={inputCls} style={inputStyle} placeholder="08xxx" value={f.phone} onChange={W('phone')} />
                </div>
              </div>
              {il && (
                <div>
                  <label className={labelCls}>Alamat</label>
                  <input type="text" className={inputCls} style={inputStyle} placeholder="Alamat lengkap" value={f.addr} onChange={W('addr')} />
                </div>
              )}
              {il && (
                <div>
                  <label className={labelCls}>Jurusan *</label>
                  <select className={inputCls} style={inputStyle} value={f.dept} onChange={e => { setF(p => ({...p, dept: e.target.value, cls: ''})); }} required>
                    <option value="">Pilih Jurusan</option>
                    {DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name} — {d.fullName}</option>
                    ))}
                  </select>
                </div>
              )}
              {il && f.dept && (
                <div>
                  <label className={labelCls}>Kelas *</label>
                  <select className={inputCls} style={inputStyle} value={f.cls} onChange={W('cls')} required>
                    <option value="">Pilih Kelas</option>
                    {classes.filter(c => c.departmentId === Number(f.dept)).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className={labelCls}>Email *</label>
                <input type="email" className={inputCls} style={inputStyle} placeholder="email@contoh.com" value={f.email} onChange={W('email')} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Password *</label>
                  <div className="relative">
                    <input type={showP ? 'text' : 'password'} className={`${inputCls} pr-10`} style={inputStyle} placeholder="Min. 6 karakter" value={f.pass} onChange={W('pass')} required minLength={6} />
                    <button type="button" onClick={() => setShowP(!showP)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showP ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Konfirmasi *</label>
                  <input type="password" className={inputCls} style={inputStyle} placeholder="Ulangi password" value={f.pass2} onChange={W('pass2')} required minLength={6} />
                  {f.pass && f.pass2 && f.pass !== f.pass2 && <p className="text-red-400 text-xs mt-1">Password tidak cocok</p>}
                </div>
              </div>
              <button type="submit" disabled={load || (f.pass.length > 0 && f.pass !== f.pass2)} className="btn-primary w-full py-3 text-sm font-medium disabled:opacity-50 mt-1">
                {load ? 'Mendaftar...' : 'Daftar'}
              </button>
            </form>
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">
            Sudah punya akun? <Link to="/login" className="text-primary-300 font-medium hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
