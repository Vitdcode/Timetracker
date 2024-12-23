export function createDiv(IdName, className) {
  const div = document.createElement('div');
  div.id = IdName;
  div.className = className;
  return div;
}
