export function createTextarea(inputId, labelText, wrapper) {
  const label = document.createElement('label');
  label.htmlFor = inputId;
  label.textContent = labelText;

  const textarea = document.createElement('textarea');
  textarea.id = inputId;
  // Append elements
  wrapper.appendChild(label);
  wrapper.appendChild(textarea);

  return textarea;
}
