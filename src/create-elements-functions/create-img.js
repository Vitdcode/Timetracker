export function createImg(idName, source, alt, className = 'image') {
  const image = document.createElement('img');
  image.id = idName;
  image.className = className;
  image.src = source;
  image.alt = alt;
  return image;
}
