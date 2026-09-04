import { gradeService } from './academicService';

// Re-export with backward-compatible methods
export const gradeServiceCompat = {
  ...gradeService,
  getGrades: gradeService.getAll,
};

export { gradeServiceCompat as gradeService };
