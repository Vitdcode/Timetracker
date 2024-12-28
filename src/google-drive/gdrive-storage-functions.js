import { colorizeWeekNumsOnHoursWorked } from '../calendars/colorize-dates';
import {
  getTodayAsNumberEuroFormat,
  getTodayDateInMetricFormat,
  getWeekNumber,
} from '../calendars/date-functions';
import { settings, stopwatch } from '../main';
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

  checkIfGoalHoursExistInGdrive() {
    if (!loadedData['goalHoursPerWeekData']) {
      loadedData['goalHoursPerWeekData'] = {
        hoursHighest: 0,
        hoursMiddle: 0,
        hoursLowest: 0,
        highestColor: '',
        middleColor: '',
        lowestColor: '',
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
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['dailyTime']['minutes'] += stopwatch.minutesCount; //prettier-ignore
    this.checkIfMinutesAreBiggerThan60(
      loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['dailyTime']
    ) //prettier-ignore

    //updating weekly hours
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]]['weeklyTime']['hours'] += stopwatch.hoursCount; //prettier-ignore
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]]['weeklyTime']['minutes'] += stopwatch.minutesCount; //prettier-ignore
    this.checkIfMinutesAreBiggerThan60(
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]]['weeklyTime']
    ) //prettier-ignore

    //updating total time
    loadedData['totalTime']['hours'] += stopwatch.hoursCount;
    loadedData['totalTime']['minutes'] += stopwatch.minutesCount;

    this.checkIfMinutesAreBiggerThan60(loadedData['totalTime']);
  },

  async updateGoalHoursPerWeek(hours) {
    this.checkIfGoalHoursExistInGdrive();
    loadedData['goalHoursPerWeekData']['hoursHighest'] = hours;
    document.querySelector('#goal-range-highest-settings').textContent =
      `Goal: ${loadedData['goalHoursPerWeekData']['hoursHighest']} hours/week`;

    saveToGDrive(loadedData);
  },

  async updateGoalHoursPerWeekRangesAndColors(
    hoursHighest = loadedData['goalHoursPerWeekData']['hoursHighest']
  ) {
    const highestColor = document.querySelector('#color-picker-highest-goal-range').value;
    const middleColor = document.querySelector('#color-picker-middle-goal-range').value;
    const lowestColor = document.querySelector('#color-picker-low-goal-range').value;
    const hoursMiddle = parseInt(document.querySelector('#choose-goal-ranges-middle').value);
    const hoursLowest = parseInt(document.querySelector('#choose-goal-ranges-low').value);

    if (hoursHighest === 0) {
      settings.savePopupText('Goal cannot be 0, create a goal first');
      return;
    } else if (hoursMiddle >= hoursHighest || hoursMiddle == 0) {
      settings.savePopupText(
        'Middle hour range cannot be equal or bigger than the goal hours and cannot be 0'
      );
      return;
    } else if (hoursLowest >= hoursMiddle || hoursLowest == 0) {
      settings.savePopupText(
        'Lowest hour range cannot be equal or bigger than the middle hour range and cannot be 0'
      );
      return;
    }

    if (!loadedData['goalHoursPerWeekData']) {
      loadedData['goalHoursPerWeekData'] = {
        hoursHighest: hoursHighest,
        hoursMiddle: 0,
        hoursLowest: 0,
        highestColor: '',
        middleColor: '',
        lowestColor: '',
      };
    }
    loadedData['goalHoursPerWeekData'] = {
      hoursHighest: hoursHighest,
      hoursMiddle: hoursMiddle,
      hoursLowest: hoursLowest,
      highestColor: highestColor,
      middleColor: middleColor,
      lowestColor: lowestColor,
    };
    settings.savePopupText('Data saved');
    colorizeWeekNumsOnHoursWorked();
    saveToGDrive(loadedData);
  },

  async updateProjectNameInGdriveObject(projectName) {
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['project'] = projectName; //prettier-ignore
    settings.savePopupText(`Project ${projectName} saved in Google Drive`);
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
