export function createSubmitButton(textContent, IdName, className, elementToAppend) {
  const button = document.createElement('button');
  button.id = IdName;
  button.className = className;
  button.type = 'submit';
  button.textContent = textContent;
  button.setAttribute('aria-label', textContent);

  if (elementToAppend) {
    elementToAppend.appendChild(button);
  }
  return button;
}
