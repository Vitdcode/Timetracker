import { createSpan } from '../create-elements-functions/create-span';
import { saveToGDrive } from '../google-drive/gdrive-service';
import { gdriveStorage, loadedData } from '../google-drive/gdrive-storage-functions';
import { calendar, stopwatch } from '../main';
import { updateProgressBar } from '../other-functions/progress-bar';
import { returnGoalHours, returnWeeklyHours } from '../other-functions/return-gdrive-object-values';
import { evaluateGoal } from '../settings/evaluations/goal-evaluation';
import { trackingProjectInAppInfoWindow } from '../settings/project-tracking';
import { showHoursUnderCalendarWeeks } from './show-hours-under-calendar-weeks';
import { showYearlyRecapBtn } from './yearly-recap';

export class TimeLogging {
  constructor() {
    this.logTimeButtonSelector = document.querySelector('#log-time-button');
    this.mainWrapperSelector = document.querySelector('.main-wrapper');
  }

  async logTimeBtnEventListener() {
    this.logTimeButtonSelector.addEventListener('click', async () => {
      if (stopwatch.stopwatchRunning || stopwatch.stopwatchPaused) {
        calendar.logTime();
        gdriveStorage.updateHoursInGdriveObject();
        evaluateGoal();
        this.loggedTextPopup();
        showHoursUnderCalendarWeeks();
        showYearlyRecapBtn();
        gdriveStorage.updateProjectHours();
        trackingProjectInAppInfoWindow();
        try {
          await saveToGDrive(loadedData);
          stopwatch.reset();
          updateProgressBar(returnGoalHours(), returnWeeklyHours());
        } catch (error) {
          console.error('Error saving to Google Drive:', error);
          // Don't reset stopwatch if save fails
        }
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
