import './style.css';
import { getDataFromLocalStorage } from './local-storage-handling.js';
import { Stopwatch } from './Stopwatch/stopwatch.js';
import { settingsImgEventListener } from './settings/settings.js';
import { createCalendar } from './calendars/create-calendar.js';

/* startStopwatch();
resetStopwatch(); */
const stopwatch = new Stopwatch();

stopwatch.startStopwatchBtn();
stopwatch.resetStopWatchBtn();
settingsImgEventListener();
createCalendar();
