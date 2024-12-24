import './style.css';
import { getDataFromLocalStorage } from './local-storage-handling.js';
import { Stopwatch } from './Stopwatch/stopwatch.js';
import { Settings, settingsImgEventListener } from './settings/settings.js';
import { CalendarMethods } from './calendars/calendar-methods.js';
import { logTimeBtnEventListener } from './calendars/logging-time-in-calendar.js';

export const stopwatch = new Stopwatch();
export const calendar = new CalendarMethods();
export const settings = new Settings();

stopwatch.startStopwatchBtn();
stopwatch.resetStopWatchBtn();
settings.settingsImgButton();
calendar.createCalendar();
logTimeBtnEventListener();
