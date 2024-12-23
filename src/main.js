import './style.css';
import { getDataFromLocalStorage } from './local-storage-handling.js';
import { Stopwatch } from './Stopwatch/stopwatch.js';
import { settingsImgEventListener } from './settings/settings.js';
import { CalendarMethods, createCalendar } from './calendars/create-calendar.js';
import { logTimeBtnEventListener } from './calendars/logging-time-in-calendar.js';

export const stopwatch = new Stopwatch();
export const calendar = new CalendarMethods();

stopwatch.startStopwatchBtn();
stopwatch.resetStopWatchBtn();
settingsImgEventListener();
calendar.createCalendar();
logTimeBtnEventListener();
