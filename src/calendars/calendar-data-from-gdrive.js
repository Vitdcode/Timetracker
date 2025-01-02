import { loadedData } from '../google-drive/gdrive-storage-functions';
import { convertMetricDateToUs, getWeekNumber } from './date-functions';

export function pushSelectedDatesDataFromGdrive() {
  // Calendar expects dates in US format
  let selectedDates = [];
  const gdriveData = loadedData['calendarData'][new Date().getFullYear()];
  if (gdriveData) {
    for (const week in gdriveData) {
      for (const date in loadedData['calendarData'][new Date().getFullYear()][week]) {
        if (
          loadedData['calendarData'][new Date().getFullYear()][week] &&
          loadedData['calendarData'][new Date().getFullYear()][week][date]['sessions'] != ''
        )
          selectedDates.push(convertMetricDateToUs(date));
      }
    }

    return selectedDates;
  }
}
