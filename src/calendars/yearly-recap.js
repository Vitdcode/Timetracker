import { calendar } from '../main';
import { Calendar } from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/styles/index.css';
import { createDiv } from '../create-elements-functions/create-div';
import { createButton } from '../create-elements-functions/create-button';
import { closeWindow } from '../create-elements-functions/close-window';
import { createH2 } from '../create-elements-functions/create-h-elements';
import { gdriveStorage, loadedData } from '../google-drive/gdrive-storage-functions';
import {
  convertJsMonthToEuroFormat,
  convertMetricDateToUs,
  convertUsDateToMetric,
} from './date-functions';
import { showHoursUnderCalendarWeeks } from './show-hours-under-calendar-weeks';
import { returnOverallHours } from '../other-functions/return-gdrive-object-values';
import { createTextarea } from '../create-elements-functions/create-textarea';
import { createForm } from '../create-elements-functions/create-form';
import { createSubmitButton } from '../create-elements-functions/create-submit-button';

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
  textAreaYearlyReview(calendarsAndReviewWrapper);
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
  for (const keyYear in yearData) {
    const week = yearData[keyYear];
    for (const key in week) {
      if (key != 'weeklyTime' && keyYear != 'yearReview') {
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

  mostActiveWeekAndHoursWorkedCurrentYear(yearlyTextAndReviewWrapper);

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
      if (typeof data[key] === 'object' && key != 'projects') {
        returnProjectNameHelperFunction(data[key]);
      } else if (key === 'projects') {
        const projectsData = data[key];
        for (const projectKey in projectsData) {
          if (!projectData[projectKey]) {
            projectData[projectKey] = projectsData[projectKey]['hours'];
          } else {
            projectData[projectKey]['hours'] += projectsData[projectKey]['hours'];
          }
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

function mostActiveWeekAndHoursWorkedCurrentYear(wrapper) {
  const currentYear = new Date().getFullYear();
  let hoursActiveWeek = 0;
  let hoursCurrentYear = 0;
  let week;
  function returnHoursForWeekHelperFunction(data, parentKey = null) {
    for (const key in data) {
      if (typeof data[key] === 'object' && key != 'weeklyTime') {
        returnHoursForWeekHelperFunction(data[key], key);
      } else if (key === 'weeklyTime') {
        hoursCurrentYear += data[key]['hours'];
        if (hoursActiveWeek < data[key]['hours']) {
          hoursActiveWeek = data[key]['hours'];
          week = parentKey;
        }
      }
    }
  }
  returnHoursForWeekHelperFunction(loadedData['calendarData'][currentYear]);

  createH2(
    `- You have worked ${hoursCurrentYear} hours this year <br>`,
    'hours-worked-this-year-yearly-recap-text',
    'in-app-text',
    wrapper,
    true
  );

  createH2(
    `- Your most active week was week ${week} with ${hoursActiveWeek} hours <br>`,
    'most-active-week-text',
    'in-app-text',
    wrapper,
    true
  );
}

function textAreaYearlyReview(wrapper) {
  const currentYear = new Date().getFullYear();
  const form = createForm(
    'textarea-yearly-review-form',
    'form-class',
    () => gdriveStorage.updateYearReview(textArea.value, form),
    wrapper
  );
  const textArea = createTextarea(`textarea-yearly-review`, `Review ${currentYear}`, form);
  createSubmitButton('Save', 'save-yearly-review-button', 'button', form);
  textArea.value = loadedData['calendarData'][currentYear]['yearReview'];
}
