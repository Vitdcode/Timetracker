import { createImg } from '../create-elements-functions/create-img';
import settingsImage from '../images/settings.png';

export function settingsImgEventListener() {
  const appHeaderWrapper = document.querySelector('#app-header-settings-wrapper');
  const settingsImg = createImg('settings-img', settingsImage, 'image');

  appHeaderWrapper.appendChild(settingsImg);
}
