import './style.css';
import { Stopwatch } from './Stopwatch/stopwatch.js';
import { Settings } from './settings/settings.js';
import { CalendarMethods } from './calendars/calendar-methods.js';
import { TimeLogging } from './calendars/logging-time-in-calendar.js';
import { initializeDriveStorage } from './google-drive/gdrive-service.js';
import { gdriveStorage } from './google-drive/gdrive-storage-functions.js';

export const stopwatch = new Stopwatch();
export const calendar = new CalendarMethods();
export const settings = new Settings();
export const timeLog = new TimeLogging();

calendar.opt;

stopwatch.startStopwatchBtn();
stopwatch.resetStopWatchBtn();
settings.settingsImgButton();
calendar.createCalendar();
timeLog.logTimeBtnEventListener();

async function initializeApp() {
  try {
    await initializeDriveStorage();
    console.log('Google Drive initialized');
    const deleteButton = document.querySelector('#delete-storage-btn');
    deleteButton.addEventListener('click', () => {
      if (confirm('This will delete the Storage on Google Drive!')) {
        gdriveStorage.emptyObject();
      }
    });
    /*     gdriveStorage.saveTestData();
        gdriveStorage.loadTestData(); */
  } catch (error) {
    console.error('Error during app initialization:', error);
  }
}

initializeApp();

/* // Load data
try {
  const data = await loadFromGDrive();
  console.log('Loaded data:', data);
} catch (error) {
  console.log('No existing data found or error loading');
} */

/* window.addEventListener('beforeunload', (event) => {
  event.preventDefault();
  event.returnValue = '';
  return 'Are you sure you want to leave?';
});
 */
