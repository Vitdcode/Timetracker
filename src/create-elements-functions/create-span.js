export function createSpan(textContent, idName, className, elementToAppend) {
  const span = document.createElement('span');
  span.textContent = textContent;
  span.id = idName;
  span.className = className;
  if (elementToAppend) {
    elementToAppend.appendChild(span);
  }
  return span;
}
