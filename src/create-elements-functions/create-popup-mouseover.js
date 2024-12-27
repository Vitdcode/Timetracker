import { createH2 } from './create-h-elements';

let timeOutId;
export function popupMouseOver(textContent, relativeElement, position = 'absolute') {
  relativeElement.addEventListener('mouseenter', () => {
    timeOutId = setTimeout(() => {
      const popup = document.querySelector('#popup-mouseover');
      if (!popup) {
        relativeElement.style.position = position; //standard postition is absolute but can be chosen depending on situation
        const text = createH2(textContent, 'popup-mouseover', 'popup-mouseover', relativeElement);
        text.style.position = 'absolute';
      }
    }, 500);
  });

  relativeElement.addEventListener('mouseleave', () => {
    clearTimeout(timeOutId);
    const popup = document.querySelector('#popup-mouseover');
    if (popup) {
      popup.remove();
    }
  });
}
