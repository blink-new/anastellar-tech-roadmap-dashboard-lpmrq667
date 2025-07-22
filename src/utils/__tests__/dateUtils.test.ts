import { moveWeekendToMonday } from '../dateUtils';

describe('moveWeekendToMonday', () => {
  test('should move Saturday to Monday', () => {
    // July 19, 2025 is a Saturday
    const result = moveWeekendToMonday('July 19, 2025');
    expect(result).toBe('July 21, 2025'); // Monday
  });

  test('should move Sunday to Monday', () => {
    // July 20, 2025 is a Sunday
    const result = moveWeekendToMonday('July 20, 2025');
    expect(result).toBe('July 21, 2025'); // Monday
  });

  test('should not change weekday dates', () => {
    // July 21, 2025 is a Monday
    const result = moveWeekendToMonday('July 21, 2025');
    expect(result).toBe('July 21, 2025'); // Should remain the same
  });

  test('should not change Tuesday dates', () => {
    // July 22, 2025 is a Tuesday
    const result = moveWeekendToMonday('July 22, 2025');
    expect(result).toBe('July 22, 2025'); // Should remain the same
  });

  test('should not change Friday dates', () => {
    // July 25, 2025 is a Friday
    const result = moveWeekendToMonday('July 25, 2025');
    expect(result).toBe('July 25, 2025'); // Should remain the same
  });

  test('should handle invalid dates gracefully', () => {
    const result = moveWeekendToMonday('Invalid Date');
    expect(result).toBe('Invalid Date'); // Should return original
  });

  test('should handle month boundary correctly', () => {
    // July 26, 2025 is a Saturday, should move to July 28, 2025 (Monday)
    const result = moveWeekendToMonday('July 26, 2025');
    expect(result).toBe('July 28, 2025');
  });
});