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
    this.stopwatchPaused = false;
    this.startTime = 0;
    this.elapsedTime = 0;
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
    this.startTime = performance.now() - this.elapsedTime; // Adjust for any previously elapsed time
    this.stopwatchPaused = false;
    this.stopwatchRunning = true;
    this.startBtnSelector.textContent = 'Pause';

    this.interval = setInterval(() => {
      const currentTime = performance.now();
      this.elapsedTime = currentTime - this.startTime;

      this.updateTimeDisplay(this.elapsedTime);
    }, 10);
  }

  updateTimeDisplay(elapsedTime) {
    const totalMilliseconds = Math.floor(elapsedTime);
    const totalSeconds = Math.floor(totalMilliseconds / 1000);

    this.millisecondsCount = Math.floor((totalMilliseconds % 1000) / 10);
    this.secondsCount = totalSeconds % 60;
    this.minutesCount = Math.floor(totalSeconds / 60) % 60;
    this.hoursCount = Math.floor(totalSeconds / 3600);

    this.millisecondsSelector.textContent = this.millisecondsCount.toString().padStart(2, '0');
    this.secondsSelector.textContent = this.secondsCount.toString().padStart(2, '0') + '.';
    this.minutesSelector.textContent = this.minutesCount.toString().padStart(2, '0') + ':';
    this.hoursSelector.textContent = this.hoursCount.toString().padStart(2, '0') + ':';
  }

  resetStopWatchBtn() {
    this.resetBtnSelector.addEventListener('click', () => {
      this.reset();
    });
  }

  reset() {
    this.stopwatchRunning = false;
    this.stopwatchPaused = false;
    this.startBtnSelector.textContent = 'Start';
    clearInterval(this.interval);
    this.millisecondsSelector.textContent = '00';
    this.secondsSelector.textContent = '00.';
    this.minutesSelector.textContent = '00:';
    this.hoursSelector.textContent = '00:';
    this.startTime = 0;
    this.elapsedTime = 0;
  }

  pause() {
    this.stopwatchRunning = false;
    this.stopwatchPaused = true;
    this.startBtnSelector.textContent = 'Resume';
    clearInterval(this.interval);
  }
}
