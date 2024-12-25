import { createDiv } from '../create-elements-functions/create-div';
import { createH2 } from '../create-elements-functions/create-h-elements';
import { loadedData } from '../google-drive/gdrive-storage-functions';

export function totalHours(settingsWindow) {
  const hoursWrapper = createDiv(
    'hours-wrapper-statistics-window',
    'wrapper-in-menus',
    settingsWindow
  );
  createH2(
    `Total Hours: ${loadedData['timeData']['totalHours']}`,
    'total-hours-text',
    'wrapper-in-menus-header',
    hoursWrapper
  );
}
