import { createSpan } from '../create-elements-functions/create-span';
import { calendar, stopwatch } from '../main';
export function logTimeBtnEventListener() {
  const logTimeBtn = document.querySelector('#log-time-button');

  logTimeBtn.addEventListener('click', () => {
    calendar.logTime();
    loggedTextPopup();
  });
}

function loggedTextPopup() {
  const mainWrapper = document.querySelector('.main-wrapper');
  const loggedText = createSpan(
    `${stopwatch.hoursCount} hours ${stopwatch.minutesCount} minutes logged`,
    'logged-time-popup'
  );

  mainWrapper.appendChild(loggedText);

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
