import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, KeyRound } from 'lucide-react';
import { authService } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'register' | 'activate'>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('SISWA');
  const [activationCode, setActivationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.register(username, password, role);
      if (res.success) {
        setMessage(res.message);
        setStep('activate');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.activate(username, activationCode, newPassword);
      if (res.success) {
        navigate('/login');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm">
            <BookOpen size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">SIASEK</h1>
          <p className="text-xl text-primary-100 text-center max-w-md">Sistem Informasi Akademik Sekolah</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'register' ? 'Buat Akun Baru' : 'Aktivasi Akun'}
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            {step === 'register' ? 'Isi data untuk mendaftar' : 'Masukkan kode aktivasi dari email'}
          </p>

          {message && step === 'activate' && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">{message}</div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
          )}

          {step === 'register' ? (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="label-field">Username</label>
                <input type="text" className="input-field" placeholder="4-20 karakter" value={username} onChange={(e) => setUsername(e.target.value)} required minLength={4} maxLength={20} />
              </div>
              <div>
                <label className="label-field">Password</label>
                <input type="password" className="input-field" placeholder="Minimal 6 karakter" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <div>
                <label className="label-field">Role</label>
                <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="SISWA">Siswa</option>
                  <option value="GURU">Guru</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-50">
                {loading ? 'Mendaftar...' : 'Daftar'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleActivate} className="space-y-5">
              <div>
                <label className="label-field">Username</label>
                <input type="text" className="input-field" value={username} disabled />
              </div>
              <div>
                <label className="label-field">Kode Aktivasi</label>
                <div className="relative">
                  <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" className="input-field pl-10" placeholder="Masukkan kode aktivasi" value={activationCode} onChange={(e) => setActivationCode(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="label-field">Password Baru</label>
                <input type="password" className="input-field" placeholder="Minimal 6 karakter" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-50">
                {loading ? 'Mengaktifkan...' : 'Aktifkan Akun'}
              </button>
            </form>
          )}

          <p className="text-sm text-gray-500 mt-6 text-center">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
