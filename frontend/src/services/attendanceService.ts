import { attendanceService } from './operationalService';

// Re-export with backward-compatible methods
export const attendanceServiceCompat = {
  ...attendanceService,
  getAttendances: attendanceService.getAll,
  getTeacherClasses: attendanceService.getTeacherClasses,
  getClassStudents: attendanceService.getClassStudents,
  getClassAttendance: attendanceService.getClassAttendance,
  batchSubmit: attendanceService.batchSubmit,
  getHistory: attendanceService.getHistory,
};

export { attendanceServiceCompat as attendanceService };
