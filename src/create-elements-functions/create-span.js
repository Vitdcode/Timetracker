export function createSpan(textContent, idName, className) {
  const span = document.createElement('span');
  span.textContent = textContent;
  span.id = idName;
  span.className = className;
}
