import { createDiv } from './create-div';

export function createInput(inputId, placeholder, wrapper, ariaRequired = false, type = 'text') {
  const label = document.createElement('label');
  label.htmlFor = inputId;
  label.textContent = placeholder;
  label.classList.add('hide-label-text'); //header label text is not needed as there is already a placeholder in the input itself

  const input = document.createElement('input');
  input.id = inputId;
  input.type = type;
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('aria-label', placeholder);
  input.setAttribute('name', inputId);
  input.required = ariaRequired;
  if (ariaRequired) {
    input.setAttribute('aria-required', 'true');
  }
  input.placeholder = placeholder;

  // Append elements
  wrapper.appendChild(label);
  wrapper.appendChild(input);

  return input;
}
