import { Calendar } from 'vanilla-calendar-pro';
import { createDiv } from '../create-elements-functions/create-div';
import 'vanilla-calendar-pro/styles/index.css';
import { stopwatch } from '../main';

function getTodayDateInUsFormat() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export class CalendarMethods {
  constructor() {
    this.calendar = {};
    this.mainWrapperSelector = document.querySelector('.main-wrapper');
    this.calendarWrapper = createDiv('calendar');
    this.options = {
      firstWeekday: 1,
      popups: {},
      selectedDates: [],
    };
    this.calendar = null;
    this.date = new Date().getDate();
  }

  markExistingDatesInCalendar() {
    let dates = [];
    const keys = Object.keys(this.options['popups']);
    if (keys.length != 0) {
      keys.forEach((key) => {
        dates.push(key);
      });
    }
    return dates;
  }

  createCalendar() {
    if (document.querySelector('#calendar')) {
      console.log('removed');
      document.querySelector('#calendar').remove();
    }
    this.mainWrapperSelector.appendChild(this.calendarWrapper);

    this.calendar = new Calendar(this.calendarWrapper, this.options);
    this.calendar.init();
  }

  logTime() {
    const example = stopwatch.secondsCount;
    this.calendar.destroy();
    this.updatePopup(`
        <div>
          ${example}
        </div>
      `);
    this.updateSelectedDates();
    this.createCalendar();
  }

  updatePopup(content) {
    this.options['popups'][getTodayDateInUsFormat()] = {
      modifier: 'bg-sponsor',
      html: content,
    };
  }

  updateSelectedDates() {
    this.options['selectedDates'] = this.markExistingDatesInCalendar();
  }
}

/* export function createCalendar() {
  const mainWrapper = document.querySelector('.main-wrapper');
  const calendarWrapper = createDiv('calendar');
  mainWrapper.appendChild(calendarWrapper);

  const options = {
    firstWeekday: 1,
  };

  const calendar = new Calendar(calendarWrapper, options);
  calendar.init();
} */
