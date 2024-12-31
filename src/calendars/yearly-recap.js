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
import { createSelectElement } from '../create-elements-functions/create-select';

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
  const yearsArray = returnAllYearsInObject();
  closeWindow(window);
  createH2(`Yearly Recap`, 'yearly-recap-window-header', 'header', window);
  const selectYear = createSelectElement(yearsArray, 'years-select', window);
  const calendarsAndReviewWrapper = createDiv(
    'calendars-and-yearly-review-wrapper',
    'window',
    window
  );

  function updateYearlyRecapData(year = new Date().getFullYear()) {
    createYearlyRecapCalendars(calendarsAndReviewWrapper, year);
    yearlyRecapTextAndReview(calendarsAndReviewWrapper, year);
    textAreaYearlyReview(calendarsAndReviewWrapper, year);
  }

  updateYearlyRecapData();

  selectYear.addEventListener('change', () => {
    console.log(selectYear.value);
    updateYearlyRecapData(selectYear.value);
  });
}

function returnAllYearsInObject() {
  let years = [];
  for (const key in loadedData['calendarData']) {
    years.push(key);
  }

  return years;
}

function createYearlyRecapCalendars(window, year) {
  window.innerHTML = '';
  const calendarsWraper = createDiv('calendars-wrapper-yearly-recap', '', window);
  for (let i = 0; i < 12; i++) {
    const calendars = createDiv(`calendars-wrapper-yearly-recap${i}`, 'calendar', calendarsWraper);
    const markedDays = selectedDates(i, year);
    const popups = {};

    for (const day of markedDays) {
      const session = sessionsForEachDay(day, year);
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
      selectedYear: year,
    };

    const calendar = new Calendar(calendars, options);
    calendar.init();
  }
  showHoursUnderCalendarWeeks('yearly-recap');
}

function selectedDates(month, year) {
  let formattedMonthToEuro = convertJsMonthToEuroFormat(month);
  formattedMonthToEuro = formattedMonthToEuro.toString().padStart(2, '0');
  let datesArray = [];
  const yearData = loadedData['calendarData'][year];
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

function sessionsForEachDay(day, year) {
  const yearData = loadedData['calendarData'][year];
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

function yearlyRecapTextAndReview(window, year) {
  const yearlyTextAndReviewWrapper = createDiv(
    'yearly-text-and-review-wrapper',
    'wrapper-in-menus',
    window
  );
  createH2(
    'Statistics',
    'yearly-statistics-header',
    'wrapper-in-menus-header',
    yearlyTextAndReviewWrapper
  );
  const overAllHours = returnOverallHours();

  createH2(
    `- You started on the 25th February 2024 <br>  
    - You have worked ${returnOverallHours()} hours in total, that's around ${Math.floor(overAllHours / 52)} hours per week. <br>
     
     `,
    'yearly-statistics-text',
    'in-app-text',
    yearlyTextAndReviewWrapper,
    true
  );

  statsCurrentYear(yearlyTextAndReviewWrapper, year);

  createH2(
    `Projects you have worked on this year: <br>`,
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
            projectData[projectKey] += projectsData[projectKey]['hours'];
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

function statsCurrentYear(wrapper, year) {
  let hoursActiveWeek = 0;
  let hoursCurrentYear = 0;
  const goalCompletedAmountWeeks = goalCompleted();
  const goal = loadedData['goalHoursPerWeekData']?.['hoursHighest'];
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
  returnHoursForWeekHelperFunction(loadedData['calendarData'][year]);

  createH2(
    `- You have worked ${hoursCurrentYear} hours this year <br>`,
    'hours-worked-this-year-yearly-recap-text',
    'in-app-text',
    wrapper,
    true
  );

  createH2(
    `- You completed the goal of ${goal} hours on ${goalCompletedAmountWeeks} / 52 weeks<br>`,
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

function textAreaYearlyReview(wrapper, year) {
  const form = createForm(
    'textarea-yearly-review-form',
    'form-class',
    () => gdriveStorage.updateYearReview(textArea.value, form),
    wrapper
  );
  const textArea = createTextarea(`textarea-yearly-review`, `Review ${year}`, form);
  createSubmitButton('Save', 'save-yearly-review-button', 'button', form);
  textArea.value = loadedData['calendarData'][year]['yearReview'];
}

function goalCompleted() {
  //returns the amount of weeks where the goal set in settings is met
  let amountWeeks = 0;
  const goal = loadedData?.['goalHoursPerWeekData']?.['hoursHighest'];
  function findWeeksWhereGoalCompletedHelperFunction(data) {
    for (const key in data) {
      if (key != 'weeklyTime' && typeof data[key] === 'object') {
        findWeeksWhereGoalCompletedHelperFunction(data[key]);
      } else if (key === 'weeklyTime' && data[key]['hours'] >= goal) {
        amountWeeks += 1;
      }
    }
  }

  findWeeksWhereGoalCompletedHelperFunction(loadedData['calendarData']);
  return amountWeeks;
}
