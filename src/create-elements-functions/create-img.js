export function createImg(idName, source, alt, className = 'image', elementToAppend) {
  const image = document.createElement('img');
  image.id = idName;
  image.className = className;
  image.src = source;
  image.alt = alt;
  if (elementToAppend) {
    elementToAppend.appendChild(image);
  }
  return image;
}
