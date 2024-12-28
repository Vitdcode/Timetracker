import { getWeekNumber } from '../calendars/date-functions';
import { closeWindow } from '../create-elements-functions/close-window';
import { createButton } from '../create-elements-functions/create-button';
import { createColorPicker } from '../create-elements-functions/create-color-picker';
import { createDiv } from '../create-elements-functions/create-div';
import { createForm } from '../create-elements-functions/create-form';
import { createH1, createH2 } from '../create-elements-functions/create-h-elements';
import { createImg } from '../create-elements-functions/create-img';
import { createInput } from '../create-elements-functions/create-input';
import { popupMouseOver } from '../create-elements-functions/create-popup-mouseover';
import { createSpan } from '../create-elements-functions/create-span';
import { createSubmitButton } from '../create-elements-functions/create-submit-button';
import { saveToGDrive } from '../google-drive/gdrive-service';
import { gdriveStorage, loadedData } from '../google-drive/gdrive-storage-functions';
import settingsImage from '../images/settings.png';
import { evaluateGoal } from './evaluations/goal-evaluation';
import infoImage from '../images/info.png';
import appIconImage from '../images/app-icon/app-icon-512.png';
import { trackProject } from './project-tracking';

export class Settings {
  constructor() {
    this.mainWrapperSelector = document.querySelector('.main-wrapper');
    this.appHeaderWrapperSelector = document.querySelector('#app-header-settings-wrapper');
    this.appIcon = createImg(
      'app-icon',
      appIconImage,
      'Stop Watch Icon which is the App Icon',
      'image',
      this.appHeaderWrapperSelector
    );
    this.settingsImg = createImg(
      'settings-img',
      settingsImage,
      'Settings Icon',
      'image',
      this.appHeaderWrapperSelector
    );
    this.cleanupSettingsWindow = this.cleanupSettingsWindow.bind(this); //ensure this refers to the Settings instance
  }

  settingsImgButton() {
    this.settingsImg.addEventListener('click', () => {
      this.openSettings();
      this.goalPerWeek();
      trackProject(this.settingsWindow);
      this.chooseGoalHourRange();
      this.deleteStoragebtn();
    });
  }

  openSettings() {
    this.settingsWindow = createDiv('settings-window', 'window');
    this.mainWrapperSelector.appendChild(this.settingsWindow);
    this.settingsHeader = createH1('Settings', 'settings-header', 'header');

    closeWindow(this.settingsWindow, this.cleanup);
    this.settingsWindow.appendChild(this.settingsHeader);
  }

  goalPerWeek() {
    this.goalHoursPerWeekWrapper = createDiv('hours-per-week-settings-wrapper', 'wrapper-in-menus');
    this.settingsWindow.appendChild(this.goalHoursPerWeekWrapper);
    createH2(
      'Goals',
      'goals-settings-header',
      'wrapper-in-menus-header',
      this.goalHoursPerWeekWrapper
    );
    const form = createForm('goals-form', 'form-class', () =>
      this.saveGoalPerWeekInput(goalsInput)
    );
    const goalsInput = createInput('goal-hours-per-week', 'Goal hours/week', form, true, 'number');
    createSubmitButton('Save', 'save-goals-per-week-button', 'button', form);
    this.goalHoursPerWeekWrapper.appendChild(form);
  }

  saveGoalPerWeekInput(input) {
    gdriveStorage.updateGoalHoursPerWeek(parseInt(input.value));

    this.savePopupText(
      `Saved goal ${loadedData['goalHoursPerWeekData']['hoursHighest']} hours/week`
    );
    this.insertGoalIntoApp(loadedData['goalHoursPerWeekData']['hoursHighest']);
  }

  insertGoalIntoApp(hoursPerWeek) {
    if (hoursPerWeek) {
      const goalInAppWrapper = createDiv('goal-in-app-wrapper', 'info-text-in-app-wrapper');
      createSpan(
        `Goal: ${hoursPerWeek} hours/week`,
        'goal-in-app-text',
        'in-app-text',
        goalInAppWrapper
      );
      this.deleteGoal(goalInAppWrapper);
      const appHeaderWrapper = document.querySelector('#app-header-settings-wrapper');
      if (document.querySelector('#goal-in-app-wrapper')) {
        document.querySelector('#goal-in-app-wrapper').remove();
      }
      if (appHeaderWrapper) {
        appHeaderWrapper.after(goalInAppWrapper);
      }
      evaluateGoal();
    }
  }

  deleteGoal(goalInAppWrapper) {
    const deleteGoalBtn = createButton('X', 'delete-goal-button', 'button', goalInAppWrapper);
    popupMouseOver('Delete Goal', deleteGoalBtn, 'absolute');
    deleteGoalBtn.addEventListener('click', () => {
      /*      this.goalsHoursPerWeek = null; */
      const gdriveHoursPerWeek = loadedData['goalHoursPerWeekData']['hoursHighest'];
      if (gdriveHoursPerWeek) {
        loadedData['goalHoursPerWeekData']['hoursHighest'] = 0;
        loadedData['goalHoursPerWeekData']['hoursMiddle'] = 0;
        loadedData['goalHoursPerWeekData']['hoursLowest'] = 0;
      }
      if (goalInAppWrapper) {
        goalInAppWrapper.remove();
      }
      saveToGDrive(loadedData);
    });
  }

  chooseGoalHourRange() {
    const chooseGoalrangesAndColorsForm = createForm(
      'goal-ranges-and-colors-form',
      'wrapper-in-menus',
      () => gdriveStorage.updateGoalHoursPerWeekRangesAndColors(),
      this.settingsWindow
    );

    const header = createH2(
      'Choose Colors for goal hour ranges',
      'choose-goal-ranges-header',
      'wrapper-in-menus-header',
      chooseGoalrangesAndColorsForm
    );

    const informationPopup = createImg(
      'information-popup-hour-ranges',
      infoImage,
      'information icon',
      'information-text-element',
      header
    );

    popupMouseOver(
      'Choose a color and a hours for each goal range and this color will be displayed at each calendar week indicating your performance for that week',
      informationPopup,
      'relative',
      true
    );

    const highestGoalRangeWrapper = createDiv(
      'goal-range-highest-wrapper',
      'wrapper-in-menus',
      chooseGoalrangesAndColorsForm
    );

    createSpan(
      `Goal: ${loadedData['goalHoursPerWeekData']['hoursHighest']} hours/week`,
      'goal-range-highest-settings',
      'wrapper-in-menus-text',
      highestGoalRangeWrapper
    );
    createColorPicker(
      'color-picker-highest-goal-range',
      highestGoalRangeWrapper,
      loadedData['goalHoursPerWeekData']['highestColor']
    );

    const middleGoalRangeWrapper = createDiv(
      'goal-range-highest-wrapper',
      'wrapper-in-menus',
      chooseGoalrangesAndColorsForm
    );
    createInput(
      'choose-goal-ranges-middle',
      `${loadedData['goalHoursPerWeekData']['hoursMiddle']} hours range middle`,
      middleGoalRangeWrapper,
      false,
      'number'
    );
    createColorPicker(
      'color-picker-middle-goal-range',
      middleGoalRangeWrapper,
      loadedData['goalHoursPerWeekData']['middleColor']
    );

    const lowGoalRangeWrapper = createDiv(
      'goal-range-low-wrapper',
      'wrapper-in-menus',
      chooseGoalrangesAndColorsForm
    );
    createInput(
      'choose-goal-ranges-low',
      `${loadedData['goalHoursPerWeekData']['hoursLowest']} hours range lowest`,
      lowGoalRangeWrapper,
      false,
      'number'
    );
    createColorPicker(
      'color-picker-low-goal-range',
      lowGoalRangeWrapper,
      loadedData['goalHoursPerWeekData']['lowestColor']
    );

    createSubmitButton(
      'Save',
      'submit-goal-hour-ranges-and-colors',
      'button',
      chooseGoalrangesAndColorsForm
    );
  }

  savePopupText(text) {
    const saveText = createSpan(text, 'hours-per-week-popup-settings', 'popup-text');

    this.settingsWindow.appendChild(saveText);

    saveText.addEventListener('animationend', (e) => {
      if (e.animationName === 'fadeOut') {
        saveText.remove();
      }
      setTimeout(() => {
        if (saveText) {
          saveText.style.animation = 'fadeOut 200ms ease-out';
        }
      }, 2000);
    });
  }

  deleteStoragebtn() {
    const settingsWrapper = document.querySelector('#settings-window');
    const deleteButton = createButton(
      'Delete Storage',
      'delete-storage-btn',
      'button',
      settingsWrapper
    );
    deleteButton.addEventListener('click', () => {
      if (confirm('This will delete the Storage on Google Drive!')) {
        gdriveStorage.emptyObject();
      }
    });
  }

  cleanupSettingsWindow() {
    // Clear references
    this.settingsWindow = null;
    this.settingsHeader = null;
    /*     this.trackProjectWrapper = null; */
  }
}
