import { closeWindow } from '../create-elements-functions/close-window';
import { createDiv } from '../create-elements-functions/create-div';
import { createH1, createH2 } from '../create-elements-functions/create-h-elements';
import { createImg } from '../create-elements-functions/create-img';
import { createInput } from '../create-elements-functions/create-input';
import { createSubmitButton } from '../create-elements-functions/create-submit-button';
import settingsImage from '../images/settings.png';

export class Settings {
  constructor() {
    this.mainWrapperSelector = document.querySelector('.main-wrapper');
    this.appHeaderWrapperSelector = document.querySelector('#app-header-settings-wrapper');
    this.settingsImg = createImg('settings-img', settingsImage, 'Settings Icon');
    this.cleanupSettingsWindow = this.cleanupSettingsWindow.bind(this); //ensure this refers to the Settings instance
  }

  settingsImgButton() {
    this.appHeaderWrapperSelector.appendChild(this.settingsImg);
    this.settingsImg.addEventListener('click', () => {
      this.openSettings();
      this.goalPerWeek();
      this.trackProject();
    });
  }

  openSettings() {
    this.settingsWindow = createDiv('settings-window');
    this.mainWrapperSelector.appendChild(this.settingsWindow);
    this.settingsHeader = createH1('Settings', 'settings-header', 'header');

    closeWindow(this.settingsWindow, this.cleanup);
    this.settingsWindow.appendChild(this.settingsHeader);
  }

  goalPerWeek() {
    this.goalHoursPerWeekWrapper = createDiv(
      'hours-per-week-settings-wrapper',
      'settings-property-wrapper'
    );
    this.settingsWindow.appendChild(this.goalHoursPerWeekWrapper);
    createH2(
      'Goals',
      'goals-settings-header',
      'settings-options-header',
      this.goalHoursPerWeekWrapper
    );
    createInput('goal-hours-per-week', 'Goal hours/week', this.goalHoursPerWeekWrapper, 'number');
    createSubmitButton(
      'Save',
      'save-goals-per-week-button',
      'button',
      this.goalHoursPerWeekWrapper
    );
  }

  trackProject() {
    this.trackProjectWrapper = createDiv(
      'track-project-settings-wrapper',
      'settings-property-wrapper'
    );
    this.settingsWindow.appendChild(this.trackProjectWrapper);
    createH2(
      'Track Project',
      'track-project-settings-header',
      'settings-options-header',
      this.trackProjectWrapper
    );
    createInput('track-project-input', 'Project Name', this.trackProjectWrapper);
    createSubmitButton('Save', 'save-track-project-button', 'button', this.trackProjectWrapper);
  }

  cleanupSettingsWindow() {
    // Remove event listeners
    this.settingsImg.removeEventListener('click', this.openSettings);

    // Clear references

    this.settingsWindow = null;
    this.settingsHeader = null;
    this.trackProjectWrapper = null;
  }
}
