import { loadedData } from '../google-drive/gdrive-storage-functions';

export function createColorPicker(inputId, wrapper, value = '') {
  const label = document.createElement('label');
  label.htmlFor = inputId;
  label.textContent = 'Color Picker';
  label.classList.add('hide-label-text');

  const input = document.createElement('input');
  input.id = inputId;
  input.className = 'color-picker';
  input.type = 'color';
  input.value = value;

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  return input;
}
