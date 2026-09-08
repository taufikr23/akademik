import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';
import { useAuth } from '../../context/AuthContext';
import { gradeService } from '../../services/academicService';

interface Grade {
  id: number;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  subjectId: number;
  subjectName: string;
  semesterId: number;
  tugasScore: number;
  utsScore: number;
  uasScore: number;
  finalScore: number;
  predikat: string;
  comments: string;
}

const getPredikat = (score: number): string => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C+';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'E';
};

const getPredikatColor = (predikat: string) => {
  switch (predikat) {
    case 'A': return 'bg-emerald-900/40 text-emerald-300';
    case 'B+': return 'bg-primary-900/40 text-primary-200';
    case 'B': return 'bg-indigo-900/40 text-indigo-300';
    case 'C+': return 'bg-yellow-900/40 text-yellow-300';
    case 'C': return 'bg-orange-900/40 text-orange-300';
    case 'D': return 'bg-red-900/40 text-red-300';
    case 'E': return 'bg-red-900/50 text-red-300';
    default: return 'bg-slate-700/50 text-slate-200';
  }
};

const getScoreColor = (score: number) => score >= 70 ? 'text-emerald-400' : score > 0 ? 'text-red-400' : 'text-slate-500';

function GuruGradesView() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState<Grade | null>(null);
  const [utsScore, setUtsScore] = useState(0);
  const [uasScore, setUasScore] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    gradeService.getAll().then(res => setGrades(res.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSaveUtsUas = async () => {
    if (!editModal) return;
    setSaving(true);
    try {
      const finalScore = (editModal.tugasScore * 0.3) + (utsScore * 0.3) + (uasScore * 0.4);
      await gradeService.update(editModal.id, {
        studentId: editModal.studentId,
        classId: editModal.classId,
        subjectId: editModal.subjectId,
        semesterId: editModal.semesterId || 1,
        tugasScore: editModal.tugasScore,
        utsScore,
        uasScore,
        finalScore,
        predikat: getPredikat(finalScore),
        comments: editModal.comments || '',
      });
      setEditModal(null);
      const res = await gradeService.getAll();
      setGrades(res.data || []);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader title="Input Nilai" subtitle="Nilai tugas otomatis dari tugas yang dinilai" />
      {loading ? (
        <div className="text-center py-8 text-slate-400">Memuat...</div>
      ) : grades.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <BookOpen size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">Belum ada nilai</p>
          <p className="text-sm text-slate-500">Nilai akan muncul setelah Anda menilai tugas siswa</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">No</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Siswa</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Kelas</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Mapel</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">Tugas (30%)</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">UTS (30%)</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">UAS (40%)</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">Akhir</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">Predikat</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {grades.map((g, i) => (
                <tr key={g.id} className="hover:bg-slate-700/50">
                  <td className="px-4 py-3 text-sm text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-100">{g.studentName}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{g.className}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{g.subjectName}</td>
                  <td className="px-4 py-3 text-sm text-center"><span className={`font-semibold ${getScoreColor(g.tugasScore)}`}>{g.tugasScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className={getScoreColor(g.utsScore)}>{g.utsScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className={getScoreColor(g.uasScore)}>{g.uasScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className="font-bold text-slate-200">{(g.finalScore ?? 0).toFixed(1)}</span></td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPredikatColor(g.predikat)}`}>{g.predikat}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => { setEditModal(g); setUtsScore(g.utsScore || 0); setUasScore(g.uasScore || 0); }}
                      className="text-xs px-2 py-1 bg-primary-900/30 text-primary-300 rounded hover:bg-primary-900/40">
                      Input UTS/UAS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal show={!!editModal} onClose={() => setEditModal(null)} title={`Input Nilai: ${editModal?.studentName || ''}`}>
        {editModal && (
          <div className="space-y-4">
            <div className="bg-primary-900/30 p-3 rounded-lg text-sm">
              <p className="font-medium text-primary-200">{editModal.subjectName} — {editModal.className}</p>
              <p className="text-primary-300">Nilai Tugas: <span className="font-semibold">{editModal.tugasScore ?? 0}</span> (otomatis dari penilaian tugas)</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">UTS (30%)</label>
                <input type="number" value={utsScore} onChange={e => setUtsScore(Number(e.target.value))} min={0} max={100}
                  className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">UAS (40%)</label>
                <input type="number" value={uasScore} onChange={e => setUasScore(Number(e.target.value))} min={0} max={100}
                  className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <span className="text-sm text-slate-400">Perhitungan: </span>
              <span className="text-sm text-slate-300">Tugas ({editModal.tugasScore ?? 0} × 30%) + UTS ({utsScore} × 30%) + UAS ({uasScore} × 40%) = </span>
              <span className="text-lg font-bold text-primary-300">{((editModal.tugasScore ?? 0) * 0.3 + utsScore * 0.3 + uasScore * 0.4).toFixed(1)}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${getPredikatColor(getPredikat((editModal.tugasScore ?? 0) * 0.3 + utsScore * 0.3 + uasScore * 0.4))}`}>
                {getPredikat((editModal.tugasScore ?? 0) * 0.3 + utsScore * 0.3 + uasScore * 0.4)}
              </span>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditModal(null)} className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700/50 text-slate-300">Batal</button>
              <button onClick={handleSaveUtsUas} disabled={saving}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function SiswaGradesView() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchGrades = async () => {
      try {
        let studentId = user.id;
        
        // Coba dapatkan data siswa asli untuk mendapatkan studentId yang benar
        try {
          const studentRes = await import('../../api/client').then(m => m.default.get('/api/students'));
          const students = Array.isArray(studentRes.data) ? studentRes.data : [];
          const myStudent = students.find((s: any) => s.nis === user.username || s.userId === user.id);
          if (myStudent && myStudent.id) {
            studentId = myStudent.id;
          }
        } catch (e) {
          console.error('Bisa mengabaikan error ini jika backend student tidak ada:', e);
        }

        const res = await gradeService.getAll();
        const all = res.data || [];
        // Filter menggunakan studentId yang benar
        setGrades(all.filter((g: Grade) => g.studentId === studentId || g.studentName.toLowerCase().includes(user.username?.toLowerCase() || '')));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user]);

  return (
    <div>
      <PageHeader title="Nilai Saya" subtitle="Lihat rekap nilai semua mata pelajaran" />
      {loading ? (
        <div className="text-center py-8 text-slate-400">Memuat...</div>
      ) : grades.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <BookOpen size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">Belum ada nilai</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-lg shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left px-5 py-4 text-sm font-semibold text-slate-300">No</th>
                  <th className="text-left px-5 py-4 text-sm font-semibold text-slate-300">Mata Pelajaran</th>
                  <th className="text-center px-5 py-4 text-sm font-semibold text-slate-300">Tugas (30%)</th>
                  <th className="text-center px-5 py-4 text-sm font-semibold text-slate-300">UTS (30%)</th>
                  <th className="text-center px-5 py-4 text-sm font-semibold text-slate-300">UAS (40%)</th>
                  <th className="text-center px-5 py-4 text-sm font-semibold text-slate-300">Nilai Akhir</th>
                  <th className="text-center px-5 py-4 text-sm font-semibold text-slate-300">Predikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {grades.map((g, i) => (
                  <tr key={g.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-4 text-sm text-slate-400">{i + 1}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-100">{g.subjectName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{g.className}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-center">
                      <span className={`font-semibold ${getScoreColor(g.tugasScore)}`}>
                        {g.tugasScore !== null && g.tugasScore !== undefined ? Number(g.tugasScore).toFixed(1) : '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-center">
                      <span className={getScoreColor(g.utsScore)}>
                        {g.utsScore !== null && g.utsScore !== undefined ? Number(g.utsScore).toFixed(1) : '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-center">
                      <span className={getScoreColor(g.uasScore)}>
                        {g.uasScore !== null && g.uasScore !== undefined ? Number(g.uasScore).toFixed(1) : '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-center">
                      <span className="text-base font-bold text-primary-300">
                        {g.finalScore !== null && g.finalScore !== undefined ? Number(g.finalScore).toFixed(1) : '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wider ${getPredikatColor(g.predikat)}`}>
                        {g.predikat || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminGradesView() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gradeService.getAll().then(res => setGrades(res.data || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Semua Nilai" subtitle="Rekap nilai seluruh siswa" />
      {loading ? (
        <div className="text-center py-8 text-slate-400">Memuat...</div>
      ) : grades.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <BookOpen size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">Belum ada nilai</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">No</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Siswa</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Kelas</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Mapel</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">Tugas</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">UTS</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">UAS</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">Akhir</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-400">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {grades.map((g, i) => (
                <tr key={g.id} className="hover:bg-slate-700/50">
                  <td className="px-4 py-3 text-sm text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-slate-100">{g.studentName}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{g.className}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{g.subjectName}</td>
                  <td className="px-4 py-3 text-sm text-center"><span className={getScoreColor(g.tugasScore)}>{g.tugasScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className={getScoreColor(g.utsScore)}>{g.utsScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className={getScoreColor(g.uasScore)}>{g.uasScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className="font-bold text-slate-100">{(g.finalScore ?? 0).toFixed(1)}</span></td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPredikatColor(g.predikat)}`}>{g.predikat}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Grades() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case 'GURU':
      return <GuruGradesView />;
    case 'SISWA':
      return <SiswaGradesView />;
    default:
      return <AdminGradesView />;
  }
}
