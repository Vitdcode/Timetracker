import { loadedData } from '../google-drive/gdrive-storage-functions';
import { convertMetricDateToUs, getWeekNumber } from './date-functions';

export function pushSelectedDatesDataFromGdrive() {
  // Calendar expects dates in US format
  let selectedDates = [];

  for (let week in loadedData['calendarData'][new Date().getFullYear()]) {
    for (let date in loadedData['calendarData'][new Date().getFullYear()][week]) {
      selectedDates.push(convertMetricDateToUs(date));
    }
  }
  return selectedDates;
}
