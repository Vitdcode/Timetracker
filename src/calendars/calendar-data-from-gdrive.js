import { loadedData } from '../google-drive/gdrive-storage-functions';
import { convertMetricDateToUs, getWeekNumber } from './date-functions';

export function pushSelectedDatesDataFromGdrive() {
  // Calendar expects dates in US format
  let selectedDates = [];
  const gdriveData = loadedData['calendarData'][new Date().getFullYear()];
  if (gdriveData) {
    for (let week in gdriveData) {
      for (let date in loadedData['calendarData'][new Date().getFullYear()][week]) {
        selectedDates.push(convertMetricDateToUs(date));
      }
    }

    return selectedDates;
  }
}
