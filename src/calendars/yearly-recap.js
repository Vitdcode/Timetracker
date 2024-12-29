import { calendar } from '../main';
import { Calendar } from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/styles/index.css';
import { createDiv } from '../create-elements-functions/create-div';
import { createButton } from '../create-elements-functions/create-button';
import { closeWindow } from '../create-elements-functions/close-window';
import { createH2 } from '../create-elements-functions/create-h-elements';
import { loadedData } from '../google-drive/gdrive-storage-functions';
import {
  convertJsMonthToEuroFormat,
  convertMetricDateToUs,
  convertUsDateToMetric,
} from './date-functions';

export function showYearlyRecapBtn() {
  const calendarWrapper = document.querySelector('#calendar');
  const yearlyRecapBtn = createButton(
    'Yearly Recap',
    'yearly-recap-button',
    'button',
    calendarWrapper
  );

  yearlyRecapBtn.addEventListener('click', () => {
    showYearlyRecap();
  });
}

function showYearlyRecap() {
  const window = createDiv('yearly-recap-wrapper', 'window', document.body);
  closeWindow(window);
  createH2(
    `Yearly Recap ${new Date().getFullYear()}`,
    'yearly-recap-window-header',
    'header',
    window
  );
  createYearlyRecapCalendars(window);
}

function createYearlyRecapCalendars(window) {
  const calendarsWraper = createDiv('calendars-wrapper-yearly-recap', '', window);
  for (let i = 0; i < 12; i++) {
    const calendars = createDiv(`calendars-wrapper-yearly-recap${i}`, 'calendar', calendarsWraper);
    const markedDays = selectedDates(i);
    const popups = {};

    for (const day of markedDays) {
      const session = sessionsForEachDay(day);
      if (session) {
        popups[day] = {
          modifier: 'bg-sponsor',
          html: `
           <div class="timelog-popup">
            ${session} 
            </div>  
          `,
        };
      }
    }

    const options = {
      enableWeekNumbers: true,
      firstWeekday: 1,
      popups: popups,
      selectedDates: markedDays,
      disableToday: true,
      selectionDatesMode: false,
      selectionMonthsMode: false,
      selectionYearsMode: false,
      selectedMonth: i,
      selectedYear: new Date().getFullYear(),
    };

    const calendar = new Calendar(calendars, options);
    calendar.init();
  }
}

function selectedDates(month) {
  let formattedMonthToEuro = convertJsMonthToEuroFormat(month);
  formattedMonthToEuro = formattedMonthToEuro.toString().padStart(2, '0');
  let datesArray = [];
  const yearData = loadedData['calendarData'][new Date().getFullYear()];
  for (const key in yearData) {
    const week = yearData[key];
    for (const key in week) {
      if (key != 'weeklyTime') {
        const keyDateSplit = key.split('.')[1]; // returns just the day date ex. 24
        if (keyDateSplit.includes(formattedMonthToEuro)) {
          const usDate = convertMetricDateToUs(key);
          datesArray.push(usDate);
        }
      }
    }
  }
  return datesArray;
}

function sessionsForEachDay(day) {
  const yearData = loadedData['calendarData'][new Date().getFullYear()];
  const metricDate = convertUsDateToMetric(day);
  let session;
  function traverseObj(data) {
    for (const key in data) {
      if (key === metricDate) {
        session = data[key]['sessions'].join('');
      } else if (typeof data[key] === 'object' && key != day) {
        traverseObj(data[key]);
      }
    }
  }
  traverseObj(yearData);
  return session;
}
