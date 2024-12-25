import {
  getTodayAsNumberEuroFormat,
  getTodayDateInMetricFormat,
} from '../calendars/date-functions';
import { stopwatch } from '../main';
import { saveToGDrive, loadFromGDrive } from './gdrive-service';
export let loadedData;
export const gdriveStorage = {
  async saveData() {
    try {
      const testData = {
        [getTodayDateInMetricFormat()]: ['entry1'],
        [getTodayAsNumberEuroFormat()]: ['entry1'],
      };
      await saveToGDrive(testData);
      console.log('Test data saved');
    } catch (error) {
      console.error('Error saving Data to Google Drive');
    }
  },

  async loadData() {
    try {
      // Then try to load it
      loadedData = await loadFromGDrive();
      console.log('Loaded data:', loadedData);
    } catch (error) {
      console.log('Error with Drive operations:', error);
    }
  },

  async updateTodayDateEuroEntries(entry) {
    if (!loadedData['calendarData']) {
      loadedData['calendarData'] = {};
    }
    if (!loadedData['calendarData'][getTodayDateInMetricFormat()]) {
      loadedData['calendarData'][getTodayDateInMetricFormat()] = [];
      loadedData['calendarData'][getTodayDateInMetricFormat()].push(entry);
    } else {
      loadedData['calendarData'][getTodayDateInMetricFormat()].push(entry);
    }
  },

  async updateTotalHours() {
    if (!loadedData['timeData']) {
      loadedData['timeData'] = {};
    }
    if (!loadedData['timeData']['totalHours']) {
      loadedData['timeData']['totalHours'] = stopwatch.secondsCount;
      console.log(loadedData);
    } else {
      loadedData['timeData']['totalHours'] += stopwatch.secondsCount;
    }
  },

  async updateGoalHoursPerWeek(hours) {
    if (!loadedData['goalHoursPerWeek']) {
      loadedData['goalHoursPerWeek'] = hours;
    } else {
      loadedData['goalHoursPerWeek'] = hours;
    }
    console.log(loadedData);
    saveToGDrive(loadedData);
  },

  async emptyObject() {
    loadedData = await loadFromGDrive();
    loadedData = {};
    saveToGDrive(loadedData);
  },
};
