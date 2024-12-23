export function initializeStopWatch() {
  startStopwatch();
}

function startStopwatch() {
  let hoursNum = document.querySelector('#hours-number');
  let minutesNum = document.querySelector('#minutes-number');
  let secondsNum = document.querySelector('#seconds-number');
  let millisecondsSelector = document.querySelector('#milliseconds-number');

  const startBtn = document.querySelector('#start-pause-stopwatch');
  startBtn.addEventListener('click', () => {
    milliSecondsCounter(millisecondsSelector);
  });
}

function milliSecondsCounter(millisecondsSelector) {
  let count = 0;

  const interval = setInterval(() => {
    millisecondsSelector.textContent = count.toString().padStart(2, '0');
    count++;

    if (count > 99) {
      clearInterval(interval);
    }
  }, 10);
}
