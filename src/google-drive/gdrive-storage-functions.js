import {
  getTodayAsNumberEuroFormat,
  getTodayDateInMetricFormat,
} from '../calendars/date-functions';
import { saveToGDrive, loadFromGDrive } from './gdrive-service';
export let loadedData;
export const gdriveStorage = {
  async saveTestData() {
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

  async loadTestData() {
    try {
      // Then try to load it
      loadedData = await loadFromGDrive();
      console.log('Loaded data:', loadedData);
    } catch (error) {
      console.log('Error with Drive operations:', error);
    }
  },

  async updateTodayDateEuroEntries(entry) {
    loadedData = await loadFromGDrive();
    if (!loadedData[getTodayDateInMetricFormat()]) {
      loadedData[getTodayDateInMetricFormat()] = [];
      loadedData[getTodayDateInMetricFormat()].push(entry);
      await saveToGDrive(loadedData);
    } else {
      loadedData[getTodayDateInMetricFormat()].push(entry);
      await saveToGDrive(loadedData);
    }
  },

  async emptyObject() {
    loadedData = await loadFromGDrive();
    loadedData = {};
    saveToGDrive(loadedData);
  },
};
