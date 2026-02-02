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
 * Formats a timestamp into a dd/mm/yyyy, hh:mm AM/PM string.
 * @param timestamp - The timestamp to format.
 * @returns The formatted date string.
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hoursStr = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} ${hoursStr}:${minutes} ${ampm}`;
};
