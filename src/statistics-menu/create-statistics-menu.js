import { closeWindow } from '../create-elements-functions/close-window';
import { createDiv } from '../create-elements-functions/create-div';
import { createH1 } from '../create-elements-functions/create-h-elements';
import { settings } from '../main';
import { totalHours } from './statistics-hours';

export function statisticsMenuBtnListener() {
  const statisticsBtn = document.querySelector('#statistics-btn');
  statisticsBtn.addEventListener('click', () => {
    createStatisticsMenu();
  });
}

function createStatisticsMenu() {
  const statisticsMenu = createDiv(
    'statistics-menu-window',
    'window',
    settings.mainWrapperSelector
  );
  createHeader(statisticsMenu);
  totalHours(statisticsMenu);
  closeWindow(statisticsMenu);
}

function createHeader(statisticsMenu) {
  createH1('Statistics', 'statistics-header', 'header', statisticsMenu);
}
