export function initializeStopWatch() {
  startStopwatch();
}

function startStopwatch() {
  let hoursNum = document.querySelector('#hours-number');
  let minutesNum = document.querySelector('#minutes-number');

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
      milliSecondsCounter(millisecondsSelector);
      secondsCounter(millisecondsSelector);
    }
  }, 10); //one count happens every 10ms
}

let countSeconds = 0;
function secondsCounter(millisecondsSelector) {
  let secondsSelector = document.querySelector('#seconds-number');

  countSeconds++;
  secondsSelector.textContent = countSeconds;

  if (countSeconds > 58) {
    countSeconds = 0;
  }
}

function intervalSetup(timeSelector, functionCall) {}
