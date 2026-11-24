/**
 * Formats a full name from first, middle, and last name parts.
 * @param first - First name
 * @param middle - Middle name
 * @param last - Last name
 * @returns Formatted full name string
 */
export function format(first?: string, middle?: string, last?: string): string {
  return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

/**
 * Formats a timestamp into a time string.
 * @param timestamp - Unix timestamp in milliseconds
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted time string
 */
export function formatTime(timestamp: number, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp));
}

/**
 * Formats a timestamp into a date string.
 * @param timestamp - Unix timestamp in milliseconds
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(timestamp: number, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
}
