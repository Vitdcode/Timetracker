import { getWeekNumber } from '../calendars/date-functions';
import { loadedData } from '../google-drive/gdrive-storage-functions';

export function returnProjectName() {
  return loadedData['currentProject'];
}

export function returnOverallHours() {
  return loadedData?.['totalTime']?.['hours'];
}

export function returnWeeklyHours() {
  return loadedData['calendarData']?.[new Date().getFullYear()]?.[[getWeekNumber()]]?.['weeklyTime']['hours']; //prettier-ignore
}

export function returnGoalHours() {
  return loadedData['goalHoursPerWeekData']?.['hoursHighest'];
}
