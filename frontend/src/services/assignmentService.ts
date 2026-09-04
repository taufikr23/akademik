import { assignmentService } from './operationalService';

// Re-export with backward-compatible methods
export const assignmentServiceCompat = {
  ...assignmentService,
  getAssignments: assignmentService.getAll,
  create: assignmentService.create,
  update: assignmentService.update,
  delete: assignmentService.delete,
};

export { assignmentServiceCompat as assignmentService };
