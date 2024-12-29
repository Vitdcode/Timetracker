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
import { showHoursUnderCalendarWeeks } from './show-hours-under-calendar-weeks';
import { returnOverallHours } from '../other-functions/return-gdrive-object-values';

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
  const calendarsAndReviewWrapper = createDiv(
    'calendars-and-yearly-review-wrapper',
    'window',
    window
  );
  createYearlyRecapCalendars(calendarsAndReviewWrapper);
  yearlyRecapTextAndReview(calendarsAndReviewWrapper);
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
  showHoursUnderCalendarWeeks('yearly-recap');
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

function yearlyRecapTextAndReview(window) {
  const yearlyTextAndReviewWrapper = createDiv(
    'yearly-text-and-review-wrapper',
    'wrapper-in-menus',
    window
  );
  createH2(
    'Statistics for the year',
    'yearly-statistics-header',
    'wrapper-in-menus-header',
    yearlyTextAndReviewWrapper
  );

  createH2(
    `- You have worked ${returnOverallHours()} hours in total <br>`,
    'yearly-statistics-text',
    'in-app-text',
    yearlyTextAndReviewWrapper,
    true
  );

  mostActiveWeek(yearlyTextAndReviewWrapper);

  createH2(
    `Projects you have worked on: <br>`,
    'yearly-statistics-text-projects',
    'in-app-text',
    yearlyTextAndReviewWrapper,
    true
  );
  projectYearlyInfo(yearlyTextAndReviewWrapper);
}

function projectYearlyInfo(wrapper) {
  let projectData = {};

  function returnProjectNameHelperFunction(data) {
    for (const key in data) {
      if (typeof data[key] === 'object') {
        returnProjectNameHelperFunction(data[key]);
      } else if (typeof key === 'string' && key === 'project') {
        if (!projectData[data[key]]) {
          projectData[data[key]] = data['dailyTime']['hours'];
        } else {
          projectData[data[key]]['hours'] += data['dailyTime']['hours'];
        }
      }
    }
  }

  returnProjectNameHelperFunction(loadedData['calendarData']);
  printProjectsAndHours(projectData, wrapper);
}

function printProjectsAndHours(projectData, wrapper) {
  for (const key in projectData) {
    createH2(
      `${key}: ${projectData[key]} hours<br>`,
      'yearly-recap-project-and-hours-text',
      'in-app-text',
      wrapper,
      true
    );
  }
}

function mostActiveWeek(wrapper) {
  let hours = 0;
  let week;
  function returnHoursForWeekHelperFunction(data, parentKey = null) {
    for (const key in data) {
      if (typeof data[key] === 'object' && key != 'weeklyTime') {
        console.log(key);
        returnHoursForWeekHelperFunction(data[key], key);
      } else if (key === 'weeklyTime') {
        if (hours < data[key]['hours']) {
          hours = data[key]['hours'];
          week = parentKey;
        }
      }
    }
  }
  returnHoursForWeekHelperFunction(loadedData['calendarData']);

  createH2(
    `- Your most active week was week ${week} with ${hours} hours <br>`,
    'most-active-week-text',
    'in-app-text',
    wrapper,
    true
  );
}
