export function createDiv(IdName, className, elementToAppend) {
  const div = document.createElement('div');
  div.id = IdName;
  div.className = className;
  if (elementToAppend) {
    elementToAppend.appendChild(div);
  }
  return div;
}
