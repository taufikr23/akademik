import { useState, useEffect } from 'react';
import { ClipboardCheck, Download, Filter } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import DataTable, { Column } from '../../components/DataTable';

interface AttendanceRecord {
  id: number;
  studentName: string;
  className: string;
  totalDays: number;
  present: number;
  sick: number;
  leave: number;
  absent: number;
  attendanceRate: number;
}

export default function AttendanceSummary() {
  const [data, setData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // For now, use mock data
      setData([
        { id: 1, studentName: 'Ahmad Fauzi', className: 'X TKJ 1', totalDays: 20, present: 18, sick: 1, leave: 1, absent: 0, attendanceRate: 90 },
        { id: 2, studentName: 'Budi Santoso', className: 'X TKJ 1', totalDays: 20, present: 15, sick: 2, leave: 1, absent: 2, attendanceRate: 75 },
        { id: 3, studentName: 'Citra Dewi', className: 'X RPL 1', totalDays: 20, present: 19, sick: 0, leave: 1, absent: 0, attendanceRate: 95 },
      ]);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<AttendanceRecord>[] = [
    { header: 'No', accessor: (_, index) => (index ?? 0) + 1, width: '60px' },
    { header: 'Nama Siswa', accessor: 'studentName' },
    { header: 'Kelas', accessor: 'className' },
    { header: 'Hari', accessor: 'totalDays', width: '80px' },
    { header: 'Hadir', accessor: 'present', width: '80px' },
    { header: 'Sakit', accessor: 'sick', width: '80px' },
    { header: 'Izin', accessor: 'leave', width: '80px' },
    { header: 'Alpa', accessor: 'absent', width: '80px' },
    { header: 'Persentase', accessor: (row) => `${row.attendanceRate}%`, width: '100px' },
  ];

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  return (
    <div>
      <PageHeader
        title="Rekap Kehadiran"
        subtitle="Rekap kehadiran siswa per bulan"
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
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            {months.map((month, index) => (
              <option key={index} value={index + 1}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded-lg px-3 py-2"
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">85%</div>
          <div className="text-sm text-gray-600">Rata-rata Kehadiran</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">8%</div>
          <div className="text-sm text-gray-600">Izin</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">5%</div>
          <div className="text-sm text-gray-600">Sakit</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">2%</div>
          <div className="text-sm text-gray-600">Alpa</div>
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
