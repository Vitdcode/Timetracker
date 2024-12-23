import { Calendar } from 'vanilla-calendar-pro';
import { createDiv } from '../create-elements-functions/create-div';
import 'vanilla-calendar-pro/styles/index.css';

export function createCalendar() {
  const mainWrapper = document.querySelector('.main-wrapper');
  const calendarWrapper = createDiv('calendar');
  mainWrapper.appendChild(calendarWrapper);

  const options = {
    firstWeekday: 1,
  };

  const calendar = new Calendar(calendarWrapper, options);
  calendar.init();
}
