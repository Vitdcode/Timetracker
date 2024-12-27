import { loadedData } from '../google-drive/gdrive-storage-functions';
import { getTodayDateInMetricFormat, getWeekNumber } from './date-functions';

export function colorizeDatesOnHoursWorked() {
  const calendarDates = document.querySelectorAll('.vc-date__btn');

  /*     let counter = 0;  */
  const dailyHours = loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['dailyTime']['hours']; //prettier-ignore
  for (let i = 0; i <= calendarDates.length - 1; i++) {
    if (calendarDates[i].getAttribute('aria-selected') === 'true' && dailyHours >= 3) {
      calendarDates[i].style.cssText += 'background-color: #3fe4979a !important;';
      /*        counter++; */
    } else if (calendarDates[i].getAttribute('aria-selected') === 'true' && dailyHours >= 2) {
      /*         counter++ */
      calendarDates[i].style.cssText += 'background-color: #e7cb4d96 !important;';
    } else if (calendarDates[i].getAttribute('aria-selected') === 'true' && dailyHours <= 1) {
      /*         counter++ */
      calendarDates[i].style.cssText += 'background-color: #b1a0c7 !important;';
    }
  }
}

export function colorizeWeekNumsOnHoursWorked() {
  const weekNumsInCalendar = document.querySelectorAll('.vc-week-number');
  weekNumsInCalendar.forEach((week) => {
    const weekToNum = parseInt(week.textContent);
    const weekNumInGdrive = loadedData['calendarData'][new Date().getFullYear()][weekToNum];
    if (weekNumInGdrive) {
      const weeklyHours =
        loadedData['calendarData'][new Date().getFullYear()][weekToNum]['weeklyTime']['hours'];
      if (weeklyHours >= 3) {
        week.style.cssText += 'background-color: #3fe4979a !important;';
      } else if (weeklyHours >= 2) {
        week.style.cssText += 'background-color: #e7cb4d96 !important;';
      } else if (weeklyHours <= 1) {
        week.style.cssText += 'background-color: #b1a0c7 !important;';
      }
    }
  });
}
