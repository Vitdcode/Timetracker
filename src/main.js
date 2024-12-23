import './style.css';
import { getDataFromLocalStorage } from './local-storage-handling.js';
import { Stopwatch } from './Stopwatch/stopwatch.js';
import { settingsImgEventListener } from './settings/settings.js';

/* startStopwatch();
resetStopwatch(); */
const stopwatch = new Stopwatch();

stopwatch.startStopwatchBtn();
stopwatch.resetStopWatchBtn();
settingsImgEventListener();
