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

export function convertJsMonthToEuroFormat(month) {
  //ex.a 0 turns into 1, a 1 turns into 2 etc.
  let newMonth = month + 1;
  return newMonth;
}

export function convertMetricDateToUs(metricDate) {
  //metric date: 25.12.2024
  //us date: 2024.12.25
  let metricSplit = metricDate.split('.');
  let usDate = '';
  usDate = `${metricSplit[2]}-${metricSplit[1]}-${metricSplit[0]}`;
  return usDate;
}

export function convertUsDateToMetric(usDate) {
  let usDateSplit = usDate.split('-');
  let metricDate = `${usDateSplit[2]}.${usDateSplit[1]}.${usDateSplit[0]}`;
  return metricDate;
}

export function getWeekNumber() {
  const now = new Date();

  // Clone the current date and set to Thursday of the same week
  const thursday = new Date(now);
  thursday.setDate(now.getDate() + (4 - ((now.getDay() + 6) % 7)));

  // Calculate the first Thursday of the year
  const firstThursday = new Date(thursday.getFullYear(), 0, 4);

  // Calculate the difference in days and determine the week number
  const weekNumber = Math.ceil(((thursday - firstThursday) / (24 * 60 * 60 * 1000) + 1) / 7);

  return weekNumber;
}
