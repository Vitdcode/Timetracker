export function createButton(textContent, idName, className, elementToAppend) {
  const button = document.createElement('button');
  button.textContent = textContent;
  button.id = idName;
  button.className = className;
  elementToAppend.appendChild(button);
  return button;
}
