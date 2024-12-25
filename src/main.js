import './style.css';
import { Stopwatch } from './Stopwatch/stopwatch.js';
import { Settings } from './settings/settings.js';
import { CalendarMethods } from './calendars/calendar-methods.js';
import { TimeLogging } from './calendars/logging-time-in-calendar.js';
import { initializeDriveStorage } from './google-drive/gdrive-service.js';
import { gdriveStorage, loadedData } from './google-drive/gdrive-storage-functions.js';
import {
  pushCalendarDataFromGdrive,
  pushSelectedDatesDataFromGdrive,
} from './calendars/calendar-data-from-gdrive.js';
import { statisticsMenuBtnListener } from './statistics-menu/create-statistics-menu.js';

export const stopwatch = new Stopwatch();
export const calendar = new CalendarMethods();
export const settings = new Settings();
export const timeLog = new TimeLogging();

stopwatch.startStopwatchBtn();
stopwatch.resetStopWatchBtn();
settings.settingsImgButton();
timeLog.logTimeBtnEventListener();
statisticsMenuBtnListener();

async function initializeApp() {
  try {
    await initializeDriveStorage();
    await gdriveStorage.loadData();
    calendar.options['selectedDates'] = pushSelectedDatesDataFromGdrive();
    calendar.createPopupsOnInit();
    calendar.createCalendar();
    if (loadedData['goalHoursPerWeek'] != '0') {
      settings.insertGoalIntoApp(loadedData['goalHoursPerWeek']);
    }
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
}

initializeApp();
