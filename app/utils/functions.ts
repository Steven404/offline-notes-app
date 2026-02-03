/**
 * Sanitizes note content by removing unsupported nested tags.
 *
 * Specifically, it removes `<h3>` tags that are nested inside `<li>` tags.
 * This is necessary because the `react-native-enriched` component's native parser
 * can misinterpret these nested tags when setting values, leading to duplicated
 * or empty list items.
 *
 * @param content - The HTML content string to sanitize.
 * @returns The sanitized HTML string.
 */
export const sanitizeNoteContent = (content: string): string =>
  content.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, match =>
    match.replace(/<\/?h3\b[^>]*>/gi, ''),
  );

/**
 * Returns a relative time string from a timestamp.
 * @param timestamp - The timestamp to format.
 * @param now - Current timestamp (optional, defaults to Date.now()).
 * @returns A relative time string.
 */
export const getRelativeTime = (
  timestamp: number,
  now: number = Date.now(),
): string => {
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (seconds < 60) {
    return 'Just now';
  } else if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else if (days < 30) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else if (months < 12) {
    return `${months} month${months === 1 ? '' : 's'} ago`;
  } else {
    return 'Long time ago';
  }
};
