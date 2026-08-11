/**
 * @param {{ dueDate: string|null, completed: number|boolean }} todo
 * @param {Date} [referenceDate] - defaults to `new Date()` (current local date)
 * @returns {boolean}
 */
export function isOverdue(todo, referenceDate = new Date()) {
  if (todo.completed) {
    return false;
  }

  if (!todo.dueDate) {
    return false;
  }

  // Parse the date-only string as local calendar components (avoids UTC-midnight
  // parsing shifting the day in negative-UTC-offset timezones).
  const [year, month, day] = todo.dueDate.slice(0, 10).split('-').map(Number);
  const dueCalendarDate = new Date(year, month - 1, day);
  const referenceCalendarDate = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  return dueCalendarDate < referenceCalendarDate;
}
