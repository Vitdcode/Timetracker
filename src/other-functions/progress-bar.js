import { createDiv } from '../create-elements-functions/create-div';
import { createSpan } from '../create-elements-functions/create-span';

export function progressBar(goalValue, currentValue, wrapper) {
  const progressBarWrapper = createDiv('progress-bar-wrapper', 'progress-bar-wrapper', wrapper);
  const progressBar = createDiv('progres-bar', 'progress-bar', progressBarWrapper);
  const progressBarWidth = (100 / goalValue) * currentValue;
  progressBar.style.width = `${progressBarWidth}%`;
}

export function progressBarWithCheckmark(
  goalValue,
  currentValue,
  wrapper,
  idNameBar = 'progress-bar',
  idNameCheckmark = 'checkmark',
  idNameWrapper = 'progress-bar-and-checkmark-wrapper'
) {
  const progressBarAndCheckMarkWrapper = createDiv(
    idNameWrapper,
    'progress-bar-and-checkmark-wrapper',
    wrapper
  );
  const progressBarWrapper = createDiv(
    'progress-bar-wrapper',
    'progress-bar-wrapper',
    progressBarAndCheckMarkWrapper
  );
  const progressBar = createDiv(idNameBar, 'progress-bar', progressBarWrapper);
  const checkmark = createSpan('✓', idNameCheckmark, 'checkmark', progressBarAndCheckMarkWrapper);
  /*   let progressBarWidth = (100 / goalValue) * currentValue;
  progressBarWidth = Math.min(progressBarWidth, 100);
  progressBar.style.width = `${progressBarWidth}%`;

  if (progressBarWidth === 100) {
    checkmark.style.backgroundColor = 'rgba(84, 163, 120, 0.993)';
    progressBar.style.backgroundColor = 'rgba(84, 163, 120, 0.993)';
  } */

  updateProgressBar(goalValue, currentValue, progressBar, checkmark);
}

export function updateProgressBar(
  goalValue,
  currentValue,
  progressBar = document.querySelector('.progress-bar'),
  checkmark = document.querySelector('.checkmark')
) {
  let progressBarWidth = (100 / goalValue) * currentValue;
  progressBarWidth = Math.min(progressBarWidth, 100);
  progressBar.style.width = `${progressBarWidth}%`;

  if (progressBarWidth === 100) {
    checkmark.style.backgroundColor = 'rgba(84, 163, 120, 0.993)';
    progressBar.style.backgroundColor = 'rgba(84, 163, 120, 0.993)';
  }
}
