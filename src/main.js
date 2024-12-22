import './style.css';
import { getDataFromLocalStorage } from './local-storage-handling.js';

/* document.addEventListener('DOMContentLoaded', () => {
  const localStorageDiaries = getDataFromLocalStorage();
  if (localStorageDiaries) {
    const parsedDiaries = JSON.parse(localStorageDiaries);
    parsedDiaries.forEach((diary) => {
      pushToDiariesArray(
        diary.name,
        diary.id,
        diary.description,
        diary.timestamp,
        diary.entries,
        diary.pinnedEntries,
        diary.entriesColor
      );
    });
  }
}); */
