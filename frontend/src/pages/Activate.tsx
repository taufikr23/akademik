import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

export default function Activate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') || '';
  const user = searchParams.get('user') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  useEffect(() => { if (!token || !user) { setValidToken(false); return; } setValidToken(true); }, [token, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      await authService.activate(token, user, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat aktivasi');
    } finally {
      setLoading(false);
    }
  };

  if (validToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8 text-center border border-slate-700">
          <div className="w-16 h-16 bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Link Tidak Valid</h2>
          <p className="text-slate-400 text-sm mb-6">
            {!token || !user
              ? 'Link aktivasi tidak lengkap. Silakan minta link baru ke administrator.'
              : 'Link aktivasi tidak valid atau sudah kedaluarsa. Silakan minta link baru ke administrator.'}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary px-6 py-2"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    );
  }

  if (validToken === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-lg p-8 text-center border border-slate-700">
          <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Akun Berhasil Diaktifkan!</h2>
          <p className="text-slate-400 text-sm mb-6">
            Anda akan dialihkan ke halaman login dalam beberapa detik.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary px-6 py-2"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

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
            Aktivasi Akun
          </p>
          <p className="text-primary-300 mt-4 text-center max-w-sm">
            Buat password baru untuk mengakses sistem informasi akademik sekolah
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-[#0a0f1a]">
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

          <h2 className="text-2xl font-bold text-slate-100 mb-2">Aktivasi Akun</h2>
          <p className="text-sm text-slate-400 mb-8">Buat password baru untuk akun Anda</p>

          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-field">Username (NIS/NIP)</label>
              <input
                type="text"
                className="input-field"
                style={{ backgroundColor: '#1a2236', borderColor: '#2a3554' }}
                value={user}
                disabled
              />
            </div>
            <div>
              <label className="label-field">Password Baru</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  style={{ backgroundColor: '#1a2236', borderColor: '#2a3554' }}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label-field">Konfirmasi Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="input-field pr-10"
                  style={{ backgroundColor: '#1a2236', borderColor: '#2a3554' }}
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Password tidak cocok</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || (password.length > 0 && password !== confirmPassword)}
              className="btn-primary w-full py-3 text-base disabled:opacity-50"
            >
              {loading ? 'Mengaktifkan...' : 'Aktifkan Akun'}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 text-center">
            Sudah punya akun?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-300 hover:text-primary-200 font-medium"
            >
              Masuk
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
