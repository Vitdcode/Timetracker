import { createSpan } from '../create-elements-functions/create-span';
import { calendar, stopwatch } from '../main';
import { evaluateGoal } from '../settings/evaluations/goal-evaluation';
import { getTodayAsNumberEuroFormat } from './date-functions';

export class TimeLogging {
  constructor() {
    this.logTimeButtonSelector = document.querySelector('#log-time-button');
    this.mainWrapperSelector = document.querySelector('.main-wrapper');
    this.loggedHoursWholeWeek = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    };
  }

  logTimeBtnEventListener() {
    this.logTimeButtonSelector.addEventListener('click', () => {
      console.log(stopwatch.stopwatchPaused);
      if (stopwatch.stopwatchRunning || stopwatch.stopwatchPaused) {
        const today = getTodayAsNumberEuroFormat(); //returns today-number in Europe format, ex. 0 = Monday;
        this.loggedHoursWholeWeek[today].push(stopwatch.secondsCount);
        calendar.logTime();
        evaluateGoal();
        this.loggedTextPopup();
      } else {
        return;
      }
    });
  }

  loggedTextPopup() {
    const loggedText = createSpan(
      `${stopwatch.hoursCount} hours ${stopwatch.minutesCount} minutes logged`,
      'logged-time-popup',
      'popup-text'
    );

    this.mainWrapperSelector.appendChild(loggedText);

    // Add animationend listener for cleanup
    loggedText.addEventListener('animationend', (e) => {
      if (e.animationName === 'fadeOut') {
        loggedText.remove();
      }
    });

    // Start fade out after 2 seconds
    setTimeout(() => {
      loggedText.style.animation = 'fadeOut 300ms ease-in forwards';
    }, 2000);
  }
}
