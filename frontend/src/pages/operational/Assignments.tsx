import { useState, useEffect, useRef } from 'react';
import PageHeader from '../../components/PageHeader';
import Modal from '../../components/Modal';
import ConfirmDelete from '../../components/ConfirmDelete';
import { assignmentService } from '../../services/assignmentService';
import { academicService } from '../../services/academicService';
import { useAuth } from '../../context/AuthContext';
import { Edit, Trash2, Upload, FileText, Download, CheckCircle, Clock, Eye, Star } from 'lucide-react';

interface Assignment {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  subjectName: string;
  teacherId: number;
  teacherName: string;
  classId: number;
  className: string;
  dueDate: string;
  maxScore: number;
  assignmentType: string;
  materialFile: string | null;
  isActive: boolean;
  createdAt: string;
}

interface TeacherClass {
  teacher_subject_id: number;
  teacher_id: number;
  class_id: number;
  class_name: string;
  subject_id: number;
  subject_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
}

interface Submission {
  id: number;
  assignmentId: number;
  studentId: number;
  studentName: string;
  studentNis: string;
  fileName: string;
  filePath: string;
  notes: string;
  score: number;
  feedback: string;
  status: string;
  createdAt: string;
}

function GuruAssignmentView() {
  const { user } = useAuth();
  const [teacherClasses, setTeacherClasses] = useState<TeacherClass[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Assignment | null>(null);
  const [deleteItem, setDeleteItem] = useState<Assignment | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [submissionsModal, setSubmissionsModal] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [gradeModal, setGradeModal] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState(0);
  const [gradeFeedback, setGradeFeedback] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [materialFile, setMaterialFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: 0,
    classId: 0,
    dueDate: '',
    maxScore: 100,
    assignmentType: 'TUGAS',
    materialFile: '',
  });

  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  useEffect(() => {
    if (!user) return;
    assignmentService.getTeacherClassesByUsername(user.username).then(res => {
      setTeacherClasses(res.data || []);
    }).catch(e => console.error(e));
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await assignmentService.getByUsername(user.username);
      setAssignments(res.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, [user]);

  const uniqueClasses = Array.from(
    teacherClasses.reduce((map, tc) => {
      if (!map.has(tc.class_id)) map.set(tc.class_id, { id: tc.class_id, name: tc.class_name });
      return map;
    }, new Map<number, { id: number; name: string }>()).values()
  );

  const subjectsForClass = selectedClassId
    ? Array.from(new Map(teacherClasses.filter(tc => tc.class_id === selectedClassId).map(tc => [tc.subject_id, { id: tc.subject_id, name: tc.subject_name }])).values())
    : [];

  const scheduleForClass = selectedClassId ? teacherClasses.filter(tc => tc.class_id === selectedClassId) : [];

  const assignmentsForClass = selectedClassId ? assignments.filter(a => a.classId === selectedClassId) : [];

  const handleSelectClass = (classId: number) => {
    setSelectedClassId(classId);
    setShowForm(false);
    setEditItem(null);
    setFormData({ title: '', description: '', subjectId: 0, classId, dueDate: '', maxScore: 100, assignmentType: 'TUGAS', materialFile: '' });
    setMaterialFile(null);
  };

  const handleSubmit = async () => {
    setError('');
    setSaving(true);
    try {
      let serverFileName = formData.materialFile || null;
      if (materialFile) {
        const fd = new FormData();
        fd.append('file', materialFile);
        const uploadRes = await fetch('/api/assignment/upload', { method: 'POST', body: fd });
        const uploadData = await uploadRes.json();
        if (uploadData.success) serverFileName = uploadData.data;
      }
      const tc = teacherClasses.find(t => t.class_id === formData.classId && t.subject_id === formData.subjectId);
      const payload: any = { ...formData, teacherId: tc ? tc.teacher_id : 0, materialFile: serverFileName };
      if (editItem) {
        await assignmentService.update(editItem.id, payload);
      } else {
        await assignmentService.create(payload);
      }
      setShowForm(false);
      setEditItem(null);
      setFormData({ title: '', description: '', subjectId: 0, classId: selectedClassId || 0, dueDate: '', maxScore: 100, assignmentType: 'TUGAS', materialFile: '' });
      setMaterialFile(null);
      loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  const handleEdit = (item: Assignment) => {
    setEditItem(item);
    setSelectedClassId(item.classId);
    setFormData({
      title: item.title, description: item.description, subjectId: item.subjectId,
      classId: item.classId, dueDate: item.dueDate, maxScore: item.maxScore,
      assignmentType: item.assignmentType, materialFile: item.materialFile || '',
    });
    setMaterialFile(null);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try { await assignmentService.delete(deleteItem.id); setDeleteItem(null); loadData(); }
    catch (err: any) { alert(err?.response?.data?.message || 'Gagal menghapus'); }
  };

  const handleViewSubmissions = async (assignment: Assignment) => {
    setSubmissionsModal(assignment);
    setLoadingSubmissions(true);
    try { const res = await assignmentService.getSubmissions(assignment.id); setSubmissions(res.data || []); }
    catch (e) { console.error(e); }
    finally { setLoadingSubmissions(false); }
  };

  const handleGrade = async () => {
    if (!gradeModal) return;
    try {
      await assignmentService.gradeSubmission(gradeModal.id, gradeScore, gradeFeedback);
      setGradeModal(null);
      if (submissionsModal) { const res = await assignmentService.getSubmissions(submissionsModal.id); setSubmissions(res.data || []); }
    } catch (err: any) { alert(err?.response?.data?.message || 'Gagal menilai'); }
  };

  if (!selectedClassId) {
    return (
      <div>
        <PageHeader title="Buat Tugas" subtitle="Pilih kelas terlebih dahulu" />
        {loading ? (
          <div className="text-center py-8 text-slate-400">Memuat data...</div>
        ) : uniqueClasses.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <FileText size={48} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400">Tidak ada kelas yang ditugaskan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueClasses.map(c => {
              const mapelCount = teacherClasses.filter(tc => tc.class_id === c.id).length;
              const tugasCount = assignments.filter(a => a.classId === c.id).length;
              const schedule = teacherClasses.filter(tc => tc.class_id === c.id);
              return (
                <button key={c.id} onClick={() => handleSelectClass(c.id)}
                  className="bg-slate-800 rounded-xl border-2 border-slate-700 p-5 text-left hover:border-primary-500 hover:shadow-xl hover:shadow-black/30 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary-900/30 rounded-xl flex items-center justify-center group-hover:bg-primary-900/40 transition-colors">
                      <span className="text-xl">🎓</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200 text-lg group-hover:text-primary-300 transition-colors">{c.name}</h3>
                      <p className="text-xs text-slate-500">{mapelCount} Mata Pelajaran</p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-3">
                    {schedule.slice(0, 3).map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                        <span>{s.subject_name}</span>
                        <span className="text-slate-600">•</span>
                        <span>{dayNames[s.day_of_week]} {s.start_time}-{s.end_time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                    <span className="text-xs text-slate-500">{tugasCount} Tugas</span>
                    <span className="text-xs font-medium text-primary-300 group-hover:text-primary-300">Pilih →</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const selectedClass = uniqueClasses.find(c => c.id === selectedClassId);

  return (
    <div>
      <PageHeader
        title={selectedClass?.name || 'Kelas'}
        subtitle={`${subjectsForClass.length} Mata Pelajaran • ${assignmentsForClass.length} Tugas`}
        action={
          <div className="flex gap-2">
            <button onClick={() => { setSelectedClassId(null); setShowForm(false); }}
              className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700/50 text-sm text-slate-300">
              ← Kembali
            </button>
            {!showForm && (
              <button onClick={() => { setEditItem(null); setFormData({ title: '', description: '', subjectId: 0, classId: selectedClassId!, dueDate: '', maxScore: 100, assignmentType: 'TUGAS', materialFile: '' }); setMaterialFile(null); setShowForm(true); }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 text-sm">
                + Buat Tugas
              </button>
            )}
          </div>
        }
      />

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-4">
        <h4 className="text-sm font-semibold text-slate-300 mb-2">📚 Jadwal Mengajar di {selectedClass?.name}</h4>
        <div className="flex flex-wrap gap-2">
          {scheduleForClass.map((s, i) => (
            <span key={i} className="text-xs bg-primary-900/30 text-primary-300 px-3 py-1.5 rounded-full">
              {s.subject_name} • {dayNames[s.day_of_week]} {s.start_time}-{s.end_time}
            </span>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-5 mb-4">
          <h4 className="font-semibold text-slate-200 mb-4">{editItem ? 'Edit Tugas' : 'Buat Tugas Baru'}</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Judul Tugas</label>
                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Contoh: Tugas Praktikum 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Mata Pelajaran</label>
                <select value={formData.subjectId} onChange={e => setFormData({ ...formData, subjectId: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500">
                  <option value={0}>Pilih Mapel</option>
                  {subjectsForClass.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Deskripsi</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2}
                className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500" placeholder="Deskripsi tugas..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tipe</label>
                <select value={formData.assignmentType} onChange={e => setFormData({ ...formData, assignmentType: e.target.value })}
                  className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500">
                  <option value="TUGAS">Tugas</option>
                  <option value="PRAKTIKUM">Praktikum</option>
                  <option value="UJIAN">Ujian</option>
                  <option value="QUIZ">Quiz</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Deadline</label>
                <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nilai Maks</label>
                <input type="number" value={formData.maxScore} onChange={e => setFormData({ ...formData, maxScore: Number(e.target.value) })}
                  className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">File Materi (Opsional)</label>
              <input ref={fileInputRef} type="file" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) { setMaterialFile(f); setFormData({ ...formData, materialFile: f.name }); }
              }} />
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-600 rounded-lg hover:border-primary-500 text-sm text-slate-400">
                <Upload size={16} /> {materialFile ? materialFile.name : 'Pilih file materi'}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => { setShowForm(false); setEditItem(null); }} className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700/50 text-sm text-slate-300">Batal</button>
              <button onClick={handleSubmit} disabled={saving || !formData.title || !formData.subjectId}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      <h4 className="font-semibold text-slate-300 mb-3">Daftar Tugas</h4>
      {assignmentsForClass.length === 0 ? (
        <div className="text-center py-8 bg-slate-800 rounded-lg border border-slate-700 text-slate-500">
          <FileText size={36} className="mx-auto mb-2" />
          <p>Belum ada tugas di kelas ini</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignmentsForClass.map(a => (
            <div key={a.id} className="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:shadow-xl hover:shadow-black/30 transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-900/40 text-primary-300 font-medium">{a.assignmentType}</span>
                    <span className="text-xs text-slate-500">{a.subjectName}</span>
                  </div>
                  <h3 className="font-semibold text-slate-200">{a.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">{a.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                    <span>📅 Deadline: {a.dueDate}</span>
                    <span>⭐ Max: {a.maxScore}</span>
                    <span>📝 {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {a.materialFile && (
                      <a href={`/api/assignment/files/${encodeURIComponent(a.materialFile)}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-900/30 text-emerald-400 rounded hover:bg-emerald-900/40 transition-colors">
                        <FileText size={11} /> Materi
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <button onClick={() => handleEdit(a)} className="p-1.5 text-slate-500 hover:text-primary-300 rounded hover:bg-primary-900/30"><Edit size={14} /></button>
                  <button onClick={() => setDeleteItem(a)} className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-red-900/30"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700">
                <button onClick={() => handleViewSubmissions(a)}
                  className="text-sm py-1.5 px-3 bg-slate-700/50 rounded hover:bg-slate-700 flex items-center gap-1 w-full justify-center text-slate-300">
                  <Eye size={14} /> Pengumpulan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!submissionsModal} onClose={() => { setSubmissionsModal(null); setSubmissions([]); }}
        title={`Pengumpulan: ${submissionsModal?.title || ''}`}>
        {loadingSubmissions ? (
          <div className="text-center py-4 text-slate-400">Memuat...</div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-6 text-slate-500">Belum ada pengumpulan</div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {submissions.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-100">{s.studentName} <span className="text-sm text-slate-500">({s.studentNis})</span></p>
                  <p className="text-xs text-slate-500">{new Date(s.createdAt).toLocaleString('id-ID')}</p>
                  {s.fileName && (
                    <a href={`/api/assignment/files/${encodeURIComponent(s.filePath || s.fileName)}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-primary-300 hover:text-primary-200 hover:underline flex items-center gap-1 mt-1">
                      <FileText size={12} /> {s.fileName}
                    </a>
                  )}
                  {s.notes && <p className="text-xs text-slate-400 mt-1">Catatan: {s.notes}</p>}
                </div>
                <div className="text-right">
                  {s.status === 'GRADED' ? (
                    <span className="text-emerald-400 font-semibold text-lg">{s.score}</span>
                  ) : (
                    <button onClick={() => { setGradeModal(s); setGradeScore(0); setGradeFeedback(''); }}
                      className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
                      Nilai
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal isOpen={!!gradeModal} onClose={() => setGradeModal(null)} title={`Nilai: ${gradeModal?.studentName || ''}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nilai (0 - {submissionsModal?.maxScore || 100})</label>
            <input type="number" value={gradeScore} onChange={e => setGradeScore(Number(e.target.value))} min={0} max={submissionsModal?.maxScore || 100}
              className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Feedback (Opsional)</label>
            <textarea value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)} rows={3}
              className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" placeholder="Feedback untuk siswa..." />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setGradeModal(null)} className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700/50 text-slate-300">Batal</button>
            <button onClick={handleGrade} className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800">Simpan Nilai</button>
          </div>
        </div>
      </Modal>

      <ConfirmDelete isOpen={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete}
        title="Hapus Tugas" message="Yakin ingin menghapus tugas ini?" />
    </div>
  );
}

function SiswaAssignmentView() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitModal, setSubmitModal] = useState<Assignment | null>(null);
  const [submitFile, setSubmitFile] = useState<File | null>(null);
  const [submitNotes, setSubmitNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [mySubmissions, setMySubmissions] = useState<Record<number, Submission>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await assignmentService.getStudentAssignmentsByUsername(user.username);
      setAssignments(res.data || []);
      for (const a of (res.data || [])) {
        try {
          const subRes = await assignmentService.getSubmissions(a.id);
          const mySub = (subRes.data || []).find((s: Submission) => s.studentName);
          if (mySub) {
            setMySubmissions(prev => ({ ...prev, [a.id]: mySub }));
          }
        } catch {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [user]);

  const handleSubmit = async () => {
    if (!submitModal || !user) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('studentId', String(user.id));
      if (submitNotes) formData.append('notes', submitNotes);
      if (submitFile) formData.append('file', submitFile);
      await assignmentService.submit(submitModal.id, formData);
      setSubmitModal(null);
      setSubmitFile(null);
      setSubmitNotes('');
      loadData();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Gagal mengumpulkan tugas');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (assignmentId: number) => {
    const sub = mySubmissions[assignmentId];
    if (!sub) return <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded-full">Belum dikumpulkan</span>;
    if (sub.status === 'GRADED') return <span className="text-xs px-2 py-1 bg-emerald-900/40 text-emerald-400 rounded-full flex items-center gap-1"><Star size={12} /> Nilai: {sub.score}</span>;
    return <span className="text-xs px-2 py-1 bg-yellow-900/40 text-yellow-400 rounded-full flex items-center gap-1"><Clock size={12} /> Sudah dikumpulkan</span>;
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  return (
    <div>
      <PageHeader title="Tugas Saya" />

      {loading ? (
        <div className="text-center py-8 text-slate-400">Memuat tugas...</div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <FileText size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">Belum ada tugas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => (
            <div key={a.id} className={`bg-slate-800 rounded-lg border border-slate-700 p-4 ${isOverdue(a.dueDate) && !mySubmissions[a.id] ? 'border-red-600 bg-red-900/20' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-900/40 text-primary-300 font-medium">{a.assignmentType}</span>
                    {isOverdue(a.dueDate) && !mySubmissions[a.id] && <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/40 text-red-400">Terlambat</span>}
                    {getStatusBadge(a.id)}
                  </div>
                  <h3 className="font-semibold text-slate-200">{a.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{a.description}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                    <span>📚 {a.subjectName}</span>
                    <span>👩‍🏫 {a.teacherName}</span>
                    <span>📅 Deadline: {new Date(a.dueDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    <span>⭐ Max: {a.maxScore}</span>
                    <span>📝 Dibuat: {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  {a.materialFile && (
                    <div className="mt-2">
                      <a href={`/api/assignment/files/${encodeURIComponent(a.materialFile)}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded text-xs hover:bg-emerald-900/40 transition-colors">
                        <FileText size={11} /> Materi
                      </a>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  {!mySubmissions[a.id] && (
                    <button onClick={() => { setSubmitModal(a); setSubmitFile(null); setSubmitNotes(''); }}
                      className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 flex items-center gap-2">
                      <Upload size={16} /> Kumpulkan
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!submitModal} onClose={() => setSubmitModal(null)} title={`Kumpulkan: ${submitModal?.title || ''}`}>
        <div className="space-y-4">
          <div className="bg-primary-900/30 p-3 rounded-lg text-sm">
            <p className="font-medium text-primary-200">{submitModal?.subjectName}</p>
            <p className="text-primary-300">Deadline: {submitModal?.dueDate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">File Jawaban</label>
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) setSubmitFile(f);
              }} />
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-600 rounded-lg hover:border-primary-500 text-sm text-slate-400 w-full">
                <Upload size={16} /> {submitFile ? submitFile.name : 'Pilih file jawaban (PDF, DOC, dll)'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Catatan (Opsional)</label>
            <textarea value={submitNotes} onChange={e => setSubmitNotes(e.target.value)} rows={3}
              className="w-full bg-slate-800 text-slate-100 border border-slate-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500" placeholder="Tulis catatan untuk guru..." />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setSubmitModal(null)} className="px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700/50 text-slate-300">Batal</button>
            <button onClick={handleSubmit} disabled={submitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {submitting ? 'Mengumpulkan...' : 'Kumpulkan'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AdminAssignmentView() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assignmentService.getAll().then(res => {
      setAssignments(res.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Semua Tugas" />
      {loading ? (
        <div className="text-center py-8 text-slate-400">Memuat...</div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
          <FileText size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">Belum ada tugas</p>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Judul</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Mapel</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Kelas</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Guru</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Deadline</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Tipe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {assignments.map(a => (
                <tr key={a.id} className="hover:bg-slate-700/50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-100">{a.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{a.subjectName}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{a.className}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{a.teacherName}</td>
                  <td className="px-4 py-3 text-sm text-slate-400">{a.dueDate}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-0.5 rounded-full bg-primary-900/40 text-primary-300 text-xs">{a.assignmentType}</span>
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

export default function Assignments() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role) {
    case 'GURU':
      return <GuruAssignmentView />;
    case 'SISWA':
      return <SiswaAssignmentView />;
    default:
      return <AdminAssignmentView />;
  }
}
