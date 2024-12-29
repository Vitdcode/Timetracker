import { checkAndRemoveElement } from '../other-functions/check-if-element-exists-and-remove';
import { createSpan } from '../create-elements-functions/create-span';
import { loadedData } from '../google-drive/gdrive-storage-functions';
import { colorizeWeekNumsOnHoursWorked } from './colorize-dates';

/* export function showHoursUnderCalendarWeeks() {
  const weekNums = document.querySelectorAll('.vc-week-number');
  const yearInCalendar = document.querySelector('.vc-year').textContent;
  weekNums.forEach((weekNum) => {
    const weekNumText = weekNum.textContent;
    const weekHoursInDrive = loadedData?.['calendarData']?.[yearInCalendar]?.[weekNumText]?.['weeklyTime']?.['hours']; //prettier-ignore
    if (weekHoursInDrive) {
      checkAndRemoveElement(document.querySelector(`#hours-under-week${weekNumText}`));
      createSpan(
        `${weekHoursInDrive} h`,
        `hours-under-week${weekNumText}`,
        'text-under-calendar-element',
        weekNum
      );
    }
  });
} */

/* export function showHoursUnderCalendarWeeks() { //using getatrribute
  const weekNums = document.querySelectorAll('.vc-week-number');
  const yearInCalendar = document.querySelectorAll('[data-vc-year]');
  yearInCalendar.forEach((year) => {
    weekNums.forEach((weekNum) => {
      const weekNumText = weekNum.textContent;
      const yearText = year.getAttribute('data-vc-week-year');
      const weekHoursInDrive = loadedData?.['calendarData']?.[yearText]?.[weekNumText]?.['weeklyTime']?.['hours']; //prettier-ignore
      if (weekHoursInDrive) {
        checkAndRemoveElement(document.querySelector(`#hours-under-week${weekNumText}`));
        createSpan(
          `${weekHoursInDrive} h`,
          `hours-under-week${weekNumText}`,
          'text-under-calendar-element',
          weekNum
        );
      }
    });
  });
} */

export function showHoursUnderCalendarWeeks(additionalStringForWeekNum = 'calendar') {
  //additionalStringForWeekNum is used if 2 calendars exist twice in the document. The caller can create a different id for the week hour text
  const weekNums = document.querySelectorAll('.vc-week-number');
  const yearInCalendar = document.querySelectorAll('.vc-year');
  yearInCalendar.forEach((year) => {
    weekNums.forEach((weekNum) => {
      const weekNumText = weekNum.textContent;
      const yearText = year.textContent;
      const weekHoursInDrive = loadedData?.['calendarData']?.[yearText]?.[weekNumText]?.['weeklyTime']?.['hours']; //prettier-ignore
      if (weekHoursInDrive) {
        checkAndRemoveElement(document.querySelector(`#hours-under-week${weekNumText}`));
        createSpan(
          `${weekHoursInDrive} h`,
          `hours-under-week${weekNumText}-${additionalStringForWeekNum}`,
          'text-under-calendar-element',
          weekNum
        );
        colorizeWeekNumsOnHoursWorked(weekNum);
      }
    });
  });
}
