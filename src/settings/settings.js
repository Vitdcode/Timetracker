import { closeWindow } from '../create-elements-functions/close-window';
import { createDiv } from '../create-elements-functions/create-div';
import { createH1 } from '../create-elements-functions/create-h1';
import { createImg } from '../create-elements-functions/create-img';
import settingsImage from '../images/settings.png';

export class Settings {
  constructor() {
    this.mainWrapperSelector = document.querySelector('.main-wrapper');
    this.appHeaderWrapperSelector = document.querySelector('#app-header-settings-wrapper');
    this.settingsImg = createImg('settings-img', settingsImage, 'Settings Icon');
    this.settingsWindow = createDiv('settings-window');
    this.settingsHeader = createH1('Settings', 'settings-header', 'header');
  }

  settingsImgButton() {
    this.appHeaderWrapperSelector.appendChild(this.settingsImg);
    this.settingsImg.addEventListener('click', () => {
      this.openSettings();
    });
  }

  openSettings() {
    this.mainWrapperSelector.appendChild(this.settingsWindow);
    closeWindow(this.settingsWindow);
    this.settingsWindow.appendChild(this.settingsHeader);
  }
}
