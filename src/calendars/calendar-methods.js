import { Calendar } from 'vanilla-calendar-pro';
import { createDiv } from '../create-elements-functions/create-div';
import 'vanilla-calendar-pro/styles/index.css';
import { stopwatch } from '../main';
import { getTodayDateInMetricFormat, getTodayDateInUsFormat } from './date-functions';

export class CalendarMethods {
  constructor() {
    this.calendar = {};
    this.mainWrapperSelector = document.querySelector('.main-wrapper');
    this.calendarWrapper = createDiv('calendar');
    this.options = {
      enableWeekNumbers: true,
      firstWeekday: 1,
      popups: {},
      selectedDates: [],
    };
    this.calendar = null;
    this.date = new Date().getDate();
    this.timeEntries = { [getTodayDateInMetricFormat()]: [] };
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
    this.timeEntries[getTodayDateInMetricFormat()].push(
      `<h3>${getTodayDateInMetricFormat()} <br> <br> ${stopwatch.hoursCount} Hours ${stopwatch.minutesCount} Minutes ${stopwatch.secondsCount} Seconds </h3><br>`
    );

    console.log(this.timeEntries[getTodayDateInMetricFormat()]);
    this.calendar.destroy();
    this.updatePopup(`
        <div class="timelog-popup">
          ${this.timeEntries[getTodayDateInMetricFormat()].join('')} 
        </div>
      `); //joining every entry and returning it as a String without a ",". This creates a h3 element for every entry
    this.updateSelectedDates();
    this.createCalendar();
    stopwatch.reset();
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
