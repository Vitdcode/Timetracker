export class Stopwatch {
  constructor() {
    this.interval = null;
    this.millisecondsCount = 0;
    this.secondsCount = 0;
    this.minutesCount = 0;
    this.hoursCount = 0;
    this.millisecondsSelector = document.querySelector('#milliseconds-number');
    this.secondsSelector = document.querySelector('#seconds-number');
    this.minutesSelector = document.querySelector('#minutes-number');
    this.hoursSelector = document.querySelector('#hours-number');
    this.startBtnSelector = document.querySelector('#start-pause-stopwatch');
    this.resetBtnSelector = document.querySelector('#reset-stopwatch');
    this.stopwatchRunning = false;
  }

  startStopwatchBtn() {
    this.startBtnSelector.addEventListener('click', () => {
      if (!this.stopwatchRunning) {
        this.start();
      } else {
        this.pause();
      }
    });
  }

  start() {
    this.stopwatchRunning = true;
    this.startBtnSelector.textContent = 'Pause';
    if (this.interval) {
      this.clearInterval();
    }

    this.interval = setInterval(() => {
      this.millisecondsSelector.textContent = this.millisecondsCount.toString().padStart(2, '0');
      this.millisecondsCount++;

      if (this.millisecondsCount > 99) {
        this.millisecondsCount = 0;
        this.clearInterval();
        this.start();
        this.secondsCounter();
      }
    }, 10);
  }

  secondsCounter() {
    this.secondsCount++;
    this.secondsSelector.textContent = `${this.secondsCount.toString().padStart(2, '0')}.`;

    if (this.secondsCount == 60) {
      this.secondsCount = 0;
      this.secondsSelector.textContent = `${this.secondsCount.toString().padStart(2, '0')}.`;
      this.minutesCounter();
    }
  }

  minutesCounter() {
    this.minutesCount++;
    this.minutesSelector.textContent = `${this.minutesCount.toString().padStart(2, '0')}:`;

    if (this.minutesCount == 60) {
      this.minutesCount = 0;
      this.minutesSelector.textContent = `${this.minutesCount.toString().padStart(2, '0')}:`;
      this.hoursCounter();
    }
  }

  hoursCounter() {
    this.hoursCount++;
    this.hoursSelector.textContent = `${this.hoursCount.toString().padStart(2, '0')}`;
  }

  clearInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }

  resetStopWatchBtn() {
    this.resetBtnSelector.addEventListener('click', () => {
      this.reset();
    });
  }

  reset() {
    this.stopwatchRunning = false;
    this.startBtnSelector.textContent = 'Start';
    this.clearInterval();
    this.millisecondsSelector.textContent = '00';
    this.secondsSelector.textContent = '00.';
    this.minutesSelector.textContent = '00:';
    this.hoursSelector.textContent = '00:';
    this.millisecondsCount = 0;
    this.secondsCount = 0;
    this.minutesCount = 0;
    this.hoursCount = 0;
  }

  pause() {
    this.stopwatchRunning = false;
    this.startBtnSelector.textContent = 'Resume';
    this.clearInterval();
  }
}
