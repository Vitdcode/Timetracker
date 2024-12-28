import { checkAndRemoveElement } from '../../other-functions/check-if-element-exists-and-remove';
import { getTodayDateInMetricFormat, getWeekNumber } from '../calendars/date-functions';
import { createDiv } from '../create-elements-functions/create-div';
import { createForm } from '../create-elements-functions/create-form';
import { createH2 } from '../create-elements-functions/create-h-elements';
import { createImg } from '../create-elements-functions/create-img';
import { createInput } from '../create-elements-functions/create-input';
import { createSubmitButton } from '../create-elements-functions/create-submit-button';
import { gdriveStorage, loadedData } from '../google-drive/gdrive-storage-functions';
import deleteImage from '../images/delete.png';

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

  createProjectNameTextAndDeleteImg(form, input);

  const submitBtn = createSubmitButton('Save', 'save-track-project-button', 'button', form);
  submitBtn.addEventListener('click', () => {
    //re-print elements when Project Name changes
    setTimeout(() => {
      //workaround to make the text appear after the project has been updated in the Object
      createProjectNameTextAndDeleteImg(form, input);
    }, 1);
  });
}

function createProjectNameTextAndDeleteImg(form, input) {
  const projectName =
    loadedData['calendarData'][new Date().getFullYear()][[getWeekNumber()]][getTodayDateInMetricFormat()]['project']; //prettier-ignore
  if (projectName != '') {
    checkAndRemoveElement(document.querySelector('#current-project-wrapper'));
    const currentProjectWrapper = createDiv(`current-project-wrapper`, 'wrapper-in-menus', form);
    createH2(
      `Current Project: <br> ${projectName}`,
      'current-project-text',
      'wrapper-in-menus-text',
      currentProjectWrapper,
      true
    );

    createImg('delete-image', deleteImage, 'Icon of a trashcan', 'img', currentProjectWrapper);
    input.after(currentProjectWrapper);
  }
}
