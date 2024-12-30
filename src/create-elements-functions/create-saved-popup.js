import { createSpan } from './create-span';

export function savePopupText(textContent, relativeElement, position, imageElement = false) {
  if (imageElement) {
    relativeElement = relativeElement.parentElement;
  }

  const saveText = createSpan(
    textContent,
    'hours-per-week-popup-settings',
    'popup',
    relativeElement
  );
  saveText.style.position = position;
  saveText.addEventListener('animationend', (e) => {
    if (e.animationName === 'fadeOut') {
      saveText.remove();
    }
    setTimeout(() => {
      if (saveText) {
        saveText.style.animation = 'fadeOut 200ms ease-out';
      }
    }, 2000);
  });
}
