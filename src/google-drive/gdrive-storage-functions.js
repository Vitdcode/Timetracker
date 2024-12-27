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

  checkIfDataExistsInGdrive() {
    if (!loadedData['calendarData']) {
      loadedData['calendarData'] = {
        [new Date().getFullYear()]: {
          [getWeekNumber()]: {
            weeklyTime: {
              hours: 0,
              minutes: 0,
            },
            [getTodayDateInMetricFormat()]: {
              dailyTime: {
                hours: 0,
                minutes: 0,
              },
              sessions: [],
              project: [],
            },
          },
        },
      };
      saveToGDrive(loadedData);
    }
  },

  checkIfCurrentYearExistsInGdrive() {
    const currentYear = loadedData['calendarData'][new Date().getFullYear()];
    if (!currentYear) {
      loadedData['calendarData'][new Date().getFullYear()] = {
        [getWeekNumber()]: {
          weeklyTime: {
            hours: 0,
            minutes: 0,
          },
          [getTodayDateInMetricFormat()]: {
            dailyTime: {
              hours: 0,
              minutes: 0,
            },
            sessions: [],
            project: [],
          },
        },
      };
      saveToGDrive(loadedData);
    }
  },

  checkIfCurrentWeekExistsInGrive() {
    const currentWeek = loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]];
    if (!currentWeek) {
      loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]] = {
        weeklyTime: {
          hours: 0,
          minutes: 0,
        },
        [getTodayDateInMetricFormat()]: {
          dailyTime: {
            hours: 0,
            minutes: 0,
          },
          sessions: [],
          project: [],
        },
      };
      saveToGDrive(loadedData);
    }
  },

  checkIfCurrentDateExistsInGdrive() {
    const currentDate = loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]; //prettier-ignore
    if (!currentDate) {
      loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()] = { 
        dailyTime: {
          hours: 0,
          minutes: 0,
        },
      sessions: [],
      project: [],
      } //prettier-ignore
    }
  },

  checkIfTotalTimedataExistsInGrive() {
    if (!loadedData['totalTime']) {
      loadedData['totalTime'] = {
        hours: 0,
        minutes: 0,
      };
    }
  },

  updateTodayDateEuroEntries(entry) {
    this.checkIfCurrentYearExistsInGdrive();
    this.checkIfCurrentWeekExistsInGrive();
    this.checkIfCurrentDateExistsInGdrive();
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['sessions'].push(entry); //prettier-ignore
    return loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['sessions']; //prettier-ignore
  },

  updateHoursInGdriveObject() {
    //updating daily time
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['dailyTime']['hours'] += stopwatch.hoursCount; //prettier-ignore
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['dailyTime']['minutes'] += stopwatch.secondsCount; //prettier-ignore
    this.checkIfMinutesAreBiggerThan60(
      loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['dailyTime']
    ) //prettier-ignore

    //updating weekly hours
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]]['weeklyTime']['hours'] += stopwatch.hoursCount; //prettier-ignore
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]]['weeklyTime']['minutes'] += stopwatch.secondsCount; //prettier-ignore
    this.checkIfMinutesAreBiggerThan60(
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]]['weeklyTime']
    ) //prettier-ignore

    //updating total time
    loadedData['totalTime']['hours'] += stopwatch.hoursCount;
    loadedData['totalTime']['minutes'] += stopwatch.secondsCount;

    this.checkIfMinutesAreBiggerThan60(loadedData['totalTime']);
  },

  async updateGoalHoursPerWeek(hours) {
    if (!loadedData['goalHoursPerWeekData']) {
      loadedData['goalHoursPerWeekData'] = {
        hoursHighest: 0,
        hoursMiddle: 0,
        hoursLowest: 0,
        highestColor: '',
        middleColor: '',
        lowestColor: '',
      };
    } else {
      loadedData['goalHoursPerWeekData']['hoursHighest'] = hours;
    }
    saveToGDrive(loadedData);
  },

  checkIfMinutesAreBiggerThan60(objectData) {
    if (objectData.minutes >= 60) {
      objectData.minutes -= 60;
      objectData.hours += 1;
    }
  },

  async emptyObject() {
    loadedData = await loadFromGDrive();
    loadedData = {};
    saveToGDrive(loadedData);
  },
};
