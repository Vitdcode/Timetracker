import { createSpan } from '../create-elements-functions/create-span';
import { saveToGDrive } from '../google-drive/gdrive-service';
import { gdriveStorage, loadedData } from '../google-drive/gdrive-storage-functions';
import { calendar, settings, stopwatch } from '../main';
import { evaluateGoal } from '../settings/evaluations/goal-evaluation';
import { trackingProjectInAppInfoWindow } from '../settings/project-tracking';
import { colorizeWeekNumsOnHoursWorked } from './colorize-dates';
import { getTodayAsNumberEuroFormat } from './date-functions';
import { showHoursUnderCalendarWeeks } from './show-hours-under-calendar-weeks';

export class TimeLogging {
  constructor() {
    this.logTimeButtonSelector = document.querySelector('#log-time-button');
    this.mainWrapperSelector = document.querySelector('.main-wrapper');
  }

  logTimeBtnEventListener() {
    this.logTimeButtonSelector.addEventListener('click', () => {
      if (stopwatch.stopwatchRunning || stopwatch.stopwatchPaused) {
        calendar.logTime();
        gdriveStorage.updateHoursInGdriveObject();
        /* settings.goalsHoursPerWeek += stopwatch.hoursCount; */
        evaluateGoal();
        this.loggedTextPopup();
        colorizeWeekNumsOnHoursWorked();
        showHoursUnderCalendarWeeks();
        trackingProjectInAppInfoWindow();
        saveToGDrive(loadedData);
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
