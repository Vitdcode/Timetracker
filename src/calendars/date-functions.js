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

export function getTodayAsNumberEuroFormat() {
  const today = new Date();
  let day = today.getDay(); // Sunday = 0, Monday = 1, etc.

  // Convert to Monday = 0, Sunday = 6
  if (day === 0) {
    day = 6;
  } else {
    day = day - 1;
  }

  return day;
}

export function convertMetricDateToUs(metricDate) {
  //metric date: 25.12.2024
  //us date: 2024.12.25
  let metricSplit = metricDate.split('.');
  let usDate = '';
  usDate = `${metricSplit[2]}-${metricSplit[1]}-${metricSplit[0]}`;
  return usDate;
}
