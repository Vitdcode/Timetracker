import { createDiv } from './create-div';
import { createH2 } from './create-h-elements';

export function createLoadingAnimation() {
  const loadingWindow = createDiv('loading-window');
  document.body.appendChild(loadingWindow);

  const loadingWrapper = createDiv('loading-wrapper');
  const loadingHeader = createH2('Loading Data from Google Drive');
  const loadingAnimation = createDiv('loader');

  loadingWrapper.append(loadingHeader, loadingAnimation);
  loadingWindow.appendChild(loadingWrapper);
}

export function fadeoutAnimation() {
  const loadingWindow = document.querySelector('#loading-window');
  loadingWindow.classList.add('fade-out-loading-animation');
  loadingWindow.addEventListener('animationend', (e) => {
    if (e.animationName === 'fadeOut') {
      loadingWindow.remove();
    }
  });
}
