import {
  getTodayAsNumberEuroFormat,
  getTodayDateInMetricFormat,
  getWeekNumber,
} from '../calendars/date-functions';
import { stopwatch } from '../main';
import { saveToGDrive, loadFromGDrive } from './gdrive-service';
export let loadedData;
export const gdriveStorage = {
  async loadData() {
    try {
      // Then try to load it
      loadedData = await loadFromGDrive();
      console.log('Loaded data:', loadedData);
    } catch (error) {
      console.log('Error with Drive operations:', error);
    }
  },

  updateTodayDateEuroEntries(entry) {
    if (!loadedData['calendarData']) {
      loadedData['calendarData'] = {
        [new Date().getFullYear()]: {
          [getWeekNumber()]: {
            [getTodayDateInMetricFormat()]: {
              hours: 0,
              sessions: [],
              project: [],
            },
          },
        },
      };
    }
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['sessions'].push(entry); //prettier-ignore
    return loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['sessions']; //prettier-ignore
  },

  updateTotalHours() {
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

  updateWeeklyHours() {
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['hours'] += stopwatch.secondsCount; //prettier-ignore
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
