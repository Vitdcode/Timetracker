export function createH1(textContent, idName, className) {
  const h1 = document.createElement('h1');
  h1.id = idName;
  h1.className = className;
  h1.textContent = textContent;
  return h1;
}
