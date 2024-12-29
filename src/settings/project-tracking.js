import { checkAndRemoveElement } from '../../other-functions/check-if-element-exists-and-remove';
import { returnProjectName } from '../../other-functions/return-gdrive-object-values';
import { getTodayDateInMetricFormat, getWeekNumber } from '../calendars/date-functions';
import { createDiv } from '../create-elements-functions/create-div';
import { createForm } from '../create-elements-functions/create-form';
import { createH2 } from '../create-elements-functions/create-h-elements';
import { createImg } from '../create-elements-functions/create-img';
import { createInput } from '../create-elements-functions/create-input';
import { createSubmitButton } from '../create-elements-functions/create-submit-button';
import { saveToGDrive } from '../google-drive/gdrive-service';
import { gdriveStorage, loadedData } from '../google-drive/gdrive-storage-functions';
import deleteImage from '../images/delete.png';
import { settings } from '../main';

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
  const projectName = loadedData['currentProject'];
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

    const createDeleteImg = createImg(
      'delete-image',
      deleteImage,
      'Icon of a trashcan',
      'image',
      currentProjectWrapper
    );
    input.after(currentProjectWrapper);
    deleteProject(createDeleteImg);
  }
}

export function trackingProjectInAppInfoWindow() {
  document.querySelector('#current-project-tracking-in-app-wrapper')?.remove();

  if (returnProjectName() != '') {
    const goalInAppWrapper = document.querySelector('#goal-in-app-wrapper');
    const wrapper = createDiv(
      'current-project-tracking-in-app-wrapper',
      'info-text-in-app-wrapper',
      document.querySelector('.main-wrapper')
    );
    if (!goalInAppWrapper) {
      settings.appHeaderWrapperSelector.after(wrapper);
    } else {
      goalInAppWrapper.after(wrapper);
    }
    createInformationAboutProject(wrapper);
  }
}

function createInformationAboutProject(wrapper) {
  createH2(
    `Tracking Project: <br> ${returnProjectName()}`,
    'tracking-project-text-in-app',
    'in-app-text',
    wrapper,
    true
  );
  createH2(
    `${calculateProjectHours(loadedData['calendarData'], returnProjectName())} hours tracked`,
    'hours-tracked-project',
    'in-app-text',
    wrapper
  );
}

function calculateProjectHours(data, searchString) {
  let totalHours = 0;

  function traverse(obj) {
    if (typeof obj !== 'object' || obj === null) return;

    for (const key in obj) {
      const value = obj[key];

      // Check if the key or value matches the search string
      if (key === 'project' && value.includes(searchString)) {
        // Add hours from dailyTime
        if (obj.dailyTime && typeof obj.dailyTime.hours === 'number') {
          totalHours += obj.dailyTime.hours;
        }
      }

      // Recursively traverse nested objects
      if (typeof value === 'object') {
        traverse(value);
      }
    }
  }

  traverse(data);
  console.log(totalHours);
  return totalHours;
}

function deleteProject(deleteImg) {
  deleteImg.addEventListener('click', () => {
    loadedData['currentProject'] = '';
    document.querySelector('#current-project-tracking-in-app-wrapper')?.remove();
    document.querySelector('#current-project-wrapper')?.remove();
    saveToGDrive(loadedData);
  });
}
