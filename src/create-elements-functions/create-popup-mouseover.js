import { createH2 } from './create-h-elements';

export function popupMouseOver(textContent, relativeElement) {
  relativeElement.addEventListener('mouseenter', () => {
    setTimeout(() => {
      const text = createH2(textContent, 'popup-mouseover', 'popup-mouseover', relativeElement);
      text.style.position = 'absolute';
    }, 500);
  });

  relativeElement.addEventListener('mouseleave', () => {
    const popup = document.querySelector('#popup-mouseover');
    if (popup) {
      popup.remove();
    }
  });
}
