import { checkAndRemoveElement } from '../other-functions/check-if-element-exists-and-remove';
import { createSpan } from '../create-elements-functions/create-span';
import { loadedData } from '../google-drive/gdrive-storage-functions';

export function showHoursUnderCalendarWeeks() {
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
}
