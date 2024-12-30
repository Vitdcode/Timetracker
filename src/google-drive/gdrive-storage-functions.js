import { colorizeWeekNumsOnHoursWorked } from '../calendars/colorize-dates';
import {
  getTodayAsNumberEuroFormat,
  getTodayDateInMetricFormat,
  getWeekNumber,
} from '../calendars/date-functions';
import { showHoursUnderCalendarWeeks } from '../calendars/show-hours-under-calendar-weeks';
import { savePopupText } from '../create-elements-functions/create-saved-popup';
import { checkifDataExistsInObject, settings, stopwatch } from '../main';
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
              projects: {},
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
            projects: {},
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
          projects: {},
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
      projects: {},
      } //prettier-ignore
    }
  },

  checkIfCurrentProjectExistsInGdrive() {
    const currentProject = loadedData['currentProject'];
    if (!currentProject) {
      loadedData['currentProject'] = '';
    }
  },

  checkIfTotalTimedataExistsInGrive() {
    if (!loadedData['totalTime']) {
      loadedData['totalTime'] = {
        hours: 1331,
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

  checkIfYearReviewExists() {
    const currentYearReview = loadedData['calendarData'][new Date().getFullYear()]['yearReview'];
    if (!currentYearReview) {
      loadedData['calendarData'][new Date().getFullYear()]['yearReview'] = '';
    }
  },

  async updateYearReview(text, form) {
    loadedData['calendarData'][new Date().getFullYear()]['yearReview'] = text;
    savePopupText('Data saved', form, 'relative');
    saveToGDrive(loadedData);
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
    form,
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
    savePopupText('Data saved', form, 'relative');
    showHoursUnderCalendarWeeks();
    console.log('test');
    saveToGDrive(loadedData);
  },

  async updateProjectNameInGdriveObject(projectName, form) {
    loadedData['currentProject'] = projectName;
    const currentProjectExists =
      loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][
        getTodayDateInMetricFormat()
      ]['projects'][projectName];
    if (!currentProjectExists) {
      loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][
        getTodayDateInMetricFormat()
      ]['projects'][projectName] = {
        hours: 0,
        minutes: 0,
      };
    }

    if (form) {
      savePopupText(`Project ${projectName} saved in Google Drive`, form, 'absolute');
      saveToGDrive(loadedData);
    }
  },

  updateProjectHours() {
    const currentProject = loadedData['currentProject'];
    if (currentProject) {
      const currentYear = new Date().getFullYear();
      const currentWeek = getWeekNumber();
      const today = getTodayDateInMetricFormat();

      const todayData = loadedData['calendarData'][currentYear]?.[currentWeek]?.[today];
      const projectData = todayData?.['projects']?.[currentProject];

      if (projectData) {
        projectData.hours += stopwatch.hoursCount;
        projectData.minutes += stopwatch.minutesCount;

        this.checkIfMinutesAreBiggerThan60(projectData);
      } else {
        checkifDataExistsInObject();
        updateProjectNameInGdriveObject(currentProject);
        updateProjectHours();
      }
    }
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
