import { scheduleService, eventService } from './operationalService';

// Re-export with backward-compatible methods
export const scheduleServiceCompat = {
  ...scheduleService,
  getSchedules: scheduleService.getAll,
  createSchedule: scheduleService.create,
  updateSchedule: scheduleService.update,
  deleteSchedule: scheduleService.delete,
  getEvents: eventService.getAll,
  createEvent: eventService.create,
  updateEvent: eventService.update,
  deleteEvent: eventService.delete,
};

export { scheduleServiceCompat as scheduleService };
