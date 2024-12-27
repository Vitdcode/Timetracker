import { loadedData } from '../google-drive/gdrive-storage-functions';
import { getTodayDateInMetricFormat, getWeekNumber } from './date-functions';

export function colorizeDatesOnHoursWorked() {
  //NOTE - remove later if not used
  const calendarDates = document.querySelectorAll('.vc-date__btn');

  /*     let counter = 0;  */
  const dailyHours = loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['dailyTime']['hours']; //prettier-ignore
  const hoursHighest = loadedData['goalHoursPerWeekData']['hoursHighest'];
  const hoursMiddle = loadedData['goalHoursPerWeekData']['hoursMiddle'];
  const hoursLowest = loadedData['goalHoursPerWeekData']['hoursLowest'];
  const highestColor = loadedData['goalHoursPerWeekData']['highestColor'];
  const middleColor = loadedData['goalHoursPerWeekData']['middleColor'];
  const lowestColor = loadedData['goalHoursPerWeekData']['lowestColor'];

  for (let i = 0; i <= calendarDates.length - 1; i++) {
    if (calendarDates[i].getAttribute('aria-selected') === 'true' && dailyHours >= hoursHighest) {
      calendarDates[i].style.cssText += `background-color: ${highestColor} !important;`;
      /*        counter++; */
    } else if (
      calendarDates[i].getAttribute('aria-selected') === 'true' &&
      dailyHours >= hoursMiddle
    ) {
      /*         counter++ */
      calendarDates[i].style.cssText += `background-color: ${middleColor} !important;`;
    } else if (
      calendarDates[i].getAttribute('aria-selected') === 'true' &&
      dailyHours <= hoursLowest
    ) {
      /*         counter++ */
      calendarDates[i].style.cssText += `background-color: ${lowestColor} !important;`;
    }
  }
}

export function colorizeWeekNumsOnHoursWorked() {
  const hoursHighest = loadedData['goalHoursPerWeekData']['hoursHighest'];
  const hoursMiddle = loadedData['goalHoursPerWeekData']['hoursMiddle'];
  const hoursLowest = loadedData['goalHoursPerWeekData']['hoursLowest'];
  const highestColor = loadedData['goalHoursPerWeekData']['highestColor'];
  const middleColor = loadedData['goalHoursPerWeekData']['middleColor'];
  const lowestColor = loadedData['goalHoursPerWeekData']['lowestColor'];

  const weekNumsInCalendar = document.querySelectorAll('.vc-week-number');
  weekNumsInCalendar.forEach((week) => {
    const weekToNum = parseInt(week.textContent);
    const weekNumInGdrive = loadedData['calendarData'][new Date().getFullYear()][weekToNum];
    if (weekNumInGdrive) {
      const weeklyHours =
        loadedData['calendarData'][new Date().getFullYear()][weekToNum]['weeklyTime']['hours'];
      if (weeklyHours >= hoursHighest) {
        week.style.cssText += `background-color: ${highestColor} !important;`;
      } else if (weeklyHours >= hoursMiddle) {
        week.style.cssText += `background-color: ${middleColor} !important;`;
      } else if (weeklyHours <= hoursLowest) {
        week.style.cssText += `background-color: ${lowestColor} !important;`;
      }
    }
  });
}
