import { getTodayDateInMetricFormat, getWeekNumber } from '../calendars/date-functions';
import { createDiv } from '../create-elements-functions/create-div';
import { createForm } from '../create-elements-functions/create-form';
import { createH2 } from '../create-elements-functions/create-h-elements';
import { createInput } from '../create-elements-functions/create-input';
import { createSubmitButton } from '../create-elements-functions/create-submit-button';
import { gdriveStorage, loadedData } from '../google-drive/gdrive-storage-functions';

export function trackProject(settingsWindow) {
  /*   const trackProjectWrapper = createDiv('track-project-settings-wrapper', 'wrapper-in-menus');
  settingsWindow.appendChild(trackProjectWrapper); */

  const form = createForm(
    'track-project-form',
    'wrapper-in-menus',
    () => gdriveStorage.updateProjectNameInGdriveObject(input.value),
    settingsWindow
  );
  createH2('Track Project', 'track-project-settings-header', 'wrapper-in-menus-header', form);
  const input = createInput('track-project-input', 'Project Name', form, true);
  createSubmitButton('Save', 'save-track-project-button', 'button', form);
}
