import { closeWindow } from '../create-elements-functions/close-window';
import { createButton } from '../create-elements-functions/create-button';
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

export class Settings {
  constructor() {
    this.mainWrapperSelector = document.querySelector('.main-wrapper');
    this.appHeaderWrapperSelector = document.querySelector('#app-header-settings-wrapper');
    this.settingsImg = createImg('settings-img', settingsImage, 'Settings Icon');
    this.goalsHoursPerWeek = null;
    this.cleanupSettingsWindow = this.cleanupSettingsWindow.bind(this); //ensure this refers to the Settings instance
  }

  settingsImgButton() {
    this.appHeaderWrapperSelector.appendChild(this.settingsImg);
    this.settingsImg.addEventListener('click', () => {
      this.openSettings();
      this.goalPerWeek();
      this.trackProject();
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
    this.goalsHoursPerWeek = input.value;
    gdriveStorage.updateGoalHoursPerWeek(this.goalsHoursPerWeek);
    const saveText = createSpan(
      `Saved goal ${this.goalsHoursPerWeek} hours/week`,
      'hours-per-week-popup-settings',
      'popup-text'
    );
    this.savePopupText(saveText);
    this.insertGoalIntoApp(this.goalsHoursPerWeek);
  }

  insertGoalIntoApp(hoursPerWeek) {
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
  }

  deleteGoal(goalInAppWrapper) {
    const deleteGoalBtn = createButton('X', 'delete-goal-button', 'button', goalInAppWrapper);
    popupMouseOver('Delete Goal', deleteGoalBtn);
    deleteGoalBtn.addEventListener('click', () => {
      this.goalsHoursPerWeek = null;
      const gdriveHoursPerWeek = loadedData['goalHoursPerWeek'];
      if (gdriveHoursPerWeek) {
        loadedData['goalHoursPerWeek'] = 0;
      }
      if (goalInAppWrapper) {
        goalInAppWrapper.remove();
      }
      saveToGDrive(loadedData);
    });
  }

  trackProject() {
    this.trackProjectWrapper = createDiv('track-project-settings-wrapper', 'wrapper-in-menus');
    this.settingsWindow.appendChild(this.trackProjectWrapper);
    createH2(
      'Track Project',
      'track-project-settings-header',
      'wrapper-in-menus-header',
      this.trackProjectWrapper
    );
    createInput('track-project-input', 'Project Name', this.trackProjectWrapper);
    createSubmitButton('Save', 'save-track-project-button', 'button', this.trackProjectWrapper);
  }

  savePopupText(text) {
    this.settingsWindow.appendChild(text);

    text.addEventListener('animationend', (e) => {
      if (e.animationName === 'fadeOut') {
        text.remove();
      }
      setTimeout(() => {
        if (text) {
          text.style.animation = 'fadeOut 200ms ease-out';
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
    this.trackProjectWrapper = null;
  }
}
