export function createForm(formId, className, onSuccessFunctionCall, elementToAppend) {
  const form = document.createElement('form');
  form.id = formId;
  form.className = className;

  // Prevent default form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) {
      onSuccessFunctionCall();
    } else {
      return;
    }
  });

  if (elementToAppend) {
    elementToAppend.appendChild(form);
  }

  return form;
}
