import { studentService, enrollmentService } from './academicService';

// Re-export with backward-compatible methods
export const studentServiceCompat = {
  ...studentService,
  getStudents: studentService.getAll,
  createStudent: studentService.create,
  updateStudent: studentService.update,
  deleteStudent: studentService.delete,
  getEnrollments: enrollmentService.getAll,
  getEnrollmentsByStudent: (studentId: number) => enrollmentService.getAll(),
  createEnrollment: enrollmentService.create,
  deleteEnrollment: enrollmentService.delete,
};

export { studentServiceCompat as studentService };
