export function saveToLocalStorage() {
  localStorage.setItem('objectToSave', JSON.stringify(diaries));
}

export function getDataFromLocalStorage() {
  const getLocalStorage = localStorage.getItem('objectToSave');
  return getLocalStorage;
}
