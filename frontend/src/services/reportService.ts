import client from '../api/client';

// ============================================
// REPORT SERVICE
// ============================================

// Statistik Sekolah
export const statisticsService = {
  getOverview: () => client.get('/api/reports/statistics/overview'),
  getAttendanceSummary: (month: number, year: number) => 
    client.get(`/api/reports/statistics/attendance?month=${month}&year=${year}`),
  getGradeSummary: (classId?: number, subjectId?: number) => {
    let url = '/api/reports/statistics/grades';
    const params = [];
    if (classId) params.push(`classId=${classId}`);
    if (subjectId) params.push(`subjectId=${subjectId}`);
    if (params.length) url += `?${params.join('&')}`;
    return client.get(url);
  },
};

// Rekap Kehadiran
export const attendanceReportService = {
  getMonthly: (month: number, year: number, classId?: number) => {
    let url = `/api/reports/attendance/monthly?month=${month}&year=${year}`;
    if (classId) url += `&classId=${classId}`;
    return client.get(url);
  },
  getByStudent: (studentId: number, month: number, year: number) =>
    client.get(`/api/reports/attendance/student/${studentId}?month=${month}&year=${year}`),
  exportPdf: (month: number, year: number, classId?: number) => {
    let url = `/api/reports/attendance/export?month=${month}&year=${year}&format=pdf`;
    if (classId) url += `&classId=${classId}`;
    return client.get(url, { responseType: 'blob' });
  },
};

// Rekap Nilai
export const gradeReportService = {
  getByClass: (classId: number, semesterId: number) =>
    client.get(`/api/reports/grades/class/${classId}?semesterId=${semesterId}`),
  getBySubject: (subjectId: number, semesterId: number) =>
    client.get(`/api/reports/grades/subject/${subjectId}?semesterId=${semesterId}`),
  getByStudent: (studentId: number, semesterId: number) =>
    client.get(`/api/reports/grades/student/${studentId}?semesterId=${semesterId}`),
  exportPdf: (classId: number, semesterId: number) =>
    client.get(`/api/reports/grades/export?classId=${classId}&semesterId=${semesterId}&format=pdf`, 
      { responseType: 'blob' }),
  exportRapor: (studentId: number, semesterId: number) =>
    client.get(`/api/reports/rapor/export?studentId=${studentId}&semesterId=${semesterId}&format=pdf`,
      { responseType: 'blob' }),
};
