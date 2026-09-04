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
    case 'A': return 'bg-green-100 text-green-800';
    case 'B+': return 'bg-blue-100 text-blue-800';
    case 'B': return 'bg-indigo-100 text-indigo-800';
    case 'C+': return 'bg-yellow-100 text-yellow-800';
    case 'C': return 'bg-orange-100 text-orange-800';
    case 'D': return 'bg-red-100 text-red-800';
    case 'E': return 'bg-red-200 text-red-900';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getScoreColor = (score: number) => score >= 70 ? 'text-green-600' : score > 0 ? 'text-red-600' : 'text-gray-400';

// ============================================
// GURU VIEW — Input UTS/UAS + Lihat Nilai Tugas Otomatis
// ============================================
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
        <div className="text-center py-8 text-gray-500">Memuat...</div>
      ) : grades.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Belum ada nilai</p>
          <p className="text-sm text-gray-400">Nilai akan muncul setelah Anda menilai tugas siswa</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">No</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Siswa</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Kelas</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Mapel</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Tugas (30%)</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">UTS (30%)</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">UAS (40%)</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Akhir</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Predikat</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {grades.map((g, i) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{g.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{g.className}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{g.subjectName}</td>
                  <td className="px-4 py-3 text-sm text-center"><span className={`font-semibold ${getScoreColor(g.tugasScore)}`}>{g.tugasScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className={getScoreColor(g.utsScore)}>{g.utsScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className={getScoreColor(g.uasScore)}>{g.uasScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className="font-bold text-gray-800">{(g.finalScore ?? 0).toFixed(1)}</span></td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getPredikatColor(g.predikat)}`}>{g.predikat}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => { setEditModal(g); setUtsScore(g.utsScore || 0); setUasScore(g.uasScore || 0); }}
                      className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100">
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
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="font-medium text-blue-800">{editModal.subjectName} — {editModal.className}</p>
              <p className="text-blue-600">Nilai Tugas: <span className="font-semibold">{editModal.tugasScore ?? 0}</span> (otomatis dari penilaian tugas)</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UTS (30%)</label>
                <input type="number" value={utsScore} onChange={e => setUtsScore(Number(e.target.value))} min={0} max={100}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UAS (40%)</label>
                <input type="number" value={uasScore} onChange={e => setUasScore(Number(e.target.value))} min={0} max={100}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-sm text-gray-600">Perhitungan: </span>
              <span className="text-sm">Tugas ({editModal.tugasScore ?? 0} × 30%) + UTS ({utsScore} × 30%) + UAS ({uasScore} × 40%) = </span>
              <span className="text-lg font-bold text-blue-600">{((editModal.tugasScore ?? 0) * 0.3 + utsScore * 0.3 + uasScore * 0.4).toFixed(1)}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${getPredikatColor(getPredikat((editModal.tugasScore ?? 0) * 0.3 + utsScore * 0.3 + uasScore * 0.4))}`}>
                {getPredikat((editModal.tugasScore ?? 0) * 0.3 + utsScore * 0.3 + uasScore * 0.4)}
              </span>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditModal(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={handleSaveUtsUas} disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================
// SISWA VIEW — Lihat Nilai Sendiri
// ============================================
function SiswaGradesView() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    gradeService.getAll().then(res => {
      const all = res.data || [];
      setGrades(all.filter((g: Grade) => g.studentId === user.id));
    }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  return (
    <div>
      <PageHeader title="Nilai Saya" subtitle="Lihat rekap nilai semua mata pelajaran" />
      {loading ? (
        <div className="text-center py-8 text-gray-500">Memuat...</div>
      ) : grades.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Belum ada nilai</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grades.map(g => (
            <div key={g.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{g.subjectName}</h3>
                  <p className="text-xs text-gray-400">{g.className}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPredikatColor(g.predikat)}`}>{g.predikat}</span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">Tugas</p>
                  <p className={`text-lg font-bold ${getScoreColor(g.tugasScore)}`}>{g.tugasScore ?? '-'}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">UTS</p>
                  <p className={`text-lg font-bold ${getScoreColor(g.utsScore)}`}>{g.utsScore ?? '-'}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-400">UAS</p>
                  <p className={`text-lg font-bold ${getScoreColor(g.uasScore)}`}>{g.uasScore ?? '-'}</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-500">Akhir</p>
                  <p className="text-lg font-bold text-blue-700">{(g.finalScore ?? 0).toFixed(1)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// ADMIN VIEW — Lihat Semua Nilai
// ============================================
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
        <div className="text-center py-8 text-gray-500">Memuat...</div>
      ) : grades.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Belum ada nilai</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">No</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Siswa</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Kelas</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Mapel</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Tugas</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">UTS</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">UAS</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Akhir</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {grades.map((g, i) => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{g.studentName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{g.className}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{g.subjectName}</td>
                  <td className="px-4 py-3 text-sm text-center"><span className={getScoreColor(g.tugasScore)}>{g.tugasScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className={getScoreColor(g.utsScore)}>{g.utsScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className={getScoreColor(g.uasScore)}>{g.uasScore ?? 0}</span></td>
                  <td className="px-4 py-3 text-sm text-center"><span className="font-bold">{(g.finalScore ?? 0).toFixed(1)}</span></td>
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

// ============================================
// MAIN COMPONENT
// ============================================
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
