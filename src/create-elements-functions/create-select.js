export function createSelectElement(options, selectId, wrapper) {
  // Create the <select> element
  const select = document.createElement('select');
  select.id = selectId;

  // Create and append <option> elements
  options.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option; // Set the value attribute
    opt.textContent = option; // Set the display text
    select.appendChild(opt);
  });

  // Append the <select> element to the wrapper
  if (wrapper) {
    wrapper.appendChild(select);
  }

  return select;
}
