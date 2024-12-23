export function createImg(idName, source, className) {
  const image = document.createElement('img');
  image.id = idName;
  image.className = className;
  image.src = source;
  return image;
}
