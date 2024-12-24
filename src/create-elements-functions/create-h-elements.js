export function createH1(textContent, idName, className, elementToAppend) {
  const h1 = document.createElement('h1');
  h1.id = idName;
  h1.className = className;
  h1.textContent = textContent;
  if (elementToAppend) {
    elementToAppend.appendChild(h1);
  }
  return h1;
}

export function createH2(textContent, idName, className, elementToAppend) {
  const h2 = document.createElement('h2');
  h2.id = idName;
  h2.className = className;
  h2.textContent = textContent;
  if (elementToAppend) {
    elementToAppend.appendChild(h2);
  }
  return h2;
}
