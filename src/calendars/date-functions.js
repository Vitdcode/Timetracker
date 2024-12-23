export function getTodayDateInUsFormat() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getTodayDateInMetricFormat() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
  const year = today.getFullYear();

  return `${day}.${month}.${year}`;
}
