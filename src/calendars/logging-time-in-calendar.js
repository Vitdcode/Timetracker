import { calendar } from '../main';
export function logTimeBtnEventListener() {
  const logTimeBtn = document.querySelector('#log-time-button');

  logTimeBtn.addEventListener('click', () => {
    calendar.logTime();
  });
}
