/**
 * Utility functions for date manipulation
 */

/**
 * Moves a date to the nearest Monday if it falls on a weekend
 * @param dateString - Date string in format "Month DD, YYYY"
 * @returns Date string moved to nearest Monday if it was a weekend
 */
export function moveWeekendToMonday(dateString: string): string {
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid
  }
  
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  
  // If it's already Monday-Friday (1-5), return as is
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    return dateString;
  }
  
  // If it's Saturday (6), move to Monday (+2 days)
  if (dayOfWeek === 6) {
    date.setDate(date.getDate() + 2);
  }
  
  // If it's Sunday (0), move to Monday (+1 day)
  if (dayOfWeek === 0) {
    date.setDate(date.getDate() + 1);
  }
  
  // Format back to "Month DD, YYYY" format
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Processes an array of tasks to move weekend due dates to Monday
 * @param tasks - Array of tasks with estimatedDate property
 * @returns Array of tasks with weekend dates moved to Monday
 */
export function processTaskDates<T extends { estimatedDate: string }>(tasks: T[]): T[] {
  return tasks.map(task => ({
    ...task,
    estimatedDate: moveWeekendToMonday(task.estimatedDate)
  }));
}