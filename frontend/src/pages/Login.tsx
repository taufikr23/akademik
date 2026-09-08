import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../components/RoleRoute';
import { triggerDoorTransition } from '../components/DoorTransition';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(username, password);
      const d = res?.data || res;
      if (d?.token) {
        // Trigger transisi pintu saat login berhasil
        triggerDoorTransition(() => {
          login(d.token as string, { id: d.id || 0, username: d.username, role: d.role, isActive: d.isActive });
          navigate(getDashboardPath(d.role));
        });
      } else {
        setError(res?.message || 'Login gagal');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-800 via-primary-900 to-[#081a47] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="w-48 h-48 flex items-center justify-center mb-8">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
              alt="Tut Wuri Handayani" 
              className="w-full h-full drop-shadow-lg"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">SIASEK</h1>
          <p className="text-xl text-primary-200 text-center max-w-md">
            Sistem Informasi Akademik Sekolah
          </p>
          <p className="text-primary-300 mt-4 text-center max-w-sm">
            Platform terpadu untuk mengelola data akademik, jadwal, kehadiran, tugas, dan nilai siswa
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0a0f1a]">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-16 h-16 flex items-center justify-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
                alt="Tut Wuri Handayani" 
                className="w-full h-full drop-shadow-md"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100">SIASEK</h1>
              <p className="text-xs text-slate-500">Sistem Informasi Akademik</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-100 mb-2">Masuk ke akun Anda</h2>
          <p className="text-sm text-slate-400 mb-8">Masukkan kredensial untuk mengakses dashboard</p>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-field">Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="Username / NIS / NIP"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-50">
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Belum punya akun?{" "}
            <Link to="/register" className="text-primary-300 hover:text-primary-200 font-medium">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
