import { loadedData } from '../google-drive/gdrive-storage-functions';
import { convertMetricDateToUs } from './date-functions';

export function pushSelectedDatesDataFromGdrive() {
  // Calendar expects dates in US format
  let selectedDates = [];

  for (let date in loadedData['calendarData']) {
    selectedDates.push(convertMetricDateToUs(date));
  }
  return selectedDates;
}
