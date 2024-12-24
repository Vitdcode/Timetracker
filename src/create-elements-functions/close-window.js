import closeImage from '../images/close.png';
import { createImg } from './create-img';

export function closeWindow(window) {
  const closeImg = createImg('close-window-button-img', closeImage, 'Icon to close window');
  window.appendChild(closeImg);

  closeImg.addEventListener('click', () => {
    if (window) {
      window.remove();
    }
  });
}
