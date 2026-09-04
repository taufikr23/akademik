import { useState, useEffect } from 'react';
import { Award, Download, Filter } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable, { Column } from '../../components/DataTable';

interface GradeRecord {
  id: number;
  studentName: string;
  className: string;
  subjectName: string;
  tugasScore: number;
  utsScore: number;
  uasScore: number;
  finalScore: number;
  predikat: string;
}

export default function GradeSummary() {
  const [data, setData] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedClass, selectedSubject]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // For now, use mock data
      setData([
        { id: 1, studentName: 'Ahmad Fauzi', className: 'X TKJ 1', subjectName: 'Jaringan', tugasScore: 85, utsScore: 78, uasScore: 82, finalScore: 81.5, predikat: 'B+' },
        { id: 2, studentName: 'Budi Santoso', className: 'X TKJ 1', subjectName: 'Jaringan', tugasScore: 70, utsScore: 65, uasScore: 72, finalScore: 69.5, predikat: 'C' },
        { id: 3, studentName: 'Citra Dewi', className: 'X RPL 1', subjectName: 'Pemrograman', tugasScore: 92, utsScore: 88, uasScore: 90, finalScore: 90, predikat: 'A' },
      ]);
    } catch (error) {
      console.error('Error fetching grades:', error);
    } finally {
      setLoading(false);
    }
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

  const columns: Column<GradeRecord>[] = [
    { header: 'No', accessor: (_, index) => (index ?? 0) + 1, width: '60px' },
    { header: 'Nama Siswa', accessor: 'studentName' },
    { header: 'Kelas', accessor: 'className', width: '100px' },
    { header: 'Mata Pelajaran', accessor: 'subjectName' },
    { header: 'Tugas', accessor: 'tugasScore', width: '80px' },
    { header: 'UTS', accessor: 'utsScore', width: '80px' },
    { header: 'UAS', accessor: 'uasScore', width: '80px' },
    { header: 'Akhir', accessor: 'finalScore', width: '80px' },
    { header: 'Predikat', accessor: (row) => (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPredikatColor(row.predikat)}`}>
        {row.predikat}
      </span>
    ), width: '100px' },
  ];

  return (
    <div>
      <PageHeader
        title="Rekap Nilai"
        subtitle="Rekap nilai siswa per mata pelajaran"
        action={
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <Download size={16} />
            Export PDF
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-500" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Semua Kelas</option>
            <option value="X TKJ 1">X TKJ 1</option>
            <option value="X TKJ 2">X TKJ 2</option>
            <option value="X RPL 1">X RPL 1</option>
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Semua Mata Pelajaran</option>
            <option value="Jaringan">Jaringan</option>
            <option value="Pemrograman">Pemrograman</option>
            <option value="Matematika">Matematika</option>
          </select>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribusi Predikat</h3>
        <div className="grid grid-cols-7 gap-2">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">15%</div>
            <div className="text-sm text-gray-600">A</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">25%</div>
            <div className="text-sm text-gray-600">B+</div>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">30%</div>
            <div className="text-sm text-gray-600">B</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">15%</div>
            <div className="text-sm text-gray-600">C+</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">10%</div>
            <div className="text-sm text-gray-600">C</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">4%</div>
            <div className="text-sm text-gray-600">D</div>
          </div>
          <div className="text-center p-3 bg-red-100 rounded-lg">
            <div className="text-2xl font-bold text-red-700">1%</div>
            <div className="text-sm text-gray-600">E</div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="Cari siswa..."
      />
    </div>
  );
}
