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
  normalizeNoteHtml(content).replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, match =>
    match.replace(/<\/?h3\b[^>]*>/gi, ''),
  );

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Brings stored note content into the shape `react-native-enriched` parses.
 *
 * The editor only treats its value as HTML when the trimmed string starts with
 * `<html>` and ends with `</html>`; anything else is shown as literal text, tags
 * included. Notes saved by older versions were stored as bare fragments such as
 * `<p>…</p>` or `<ul>…</ul>`, and very old ones as plain text, so both are
 * converted here on the way in. The stored note is left untouched; it is
 * rewritten in the wrapped form the next time the editor saves it.
 *
 * @param content - The note content as stored.
 * @returns HTML wrapped in `<html>` tags, ready for the editor.
 */
export const normalizeNoteHtml = (content: string): string => {
  const trimmed = content.trim();

  if (!trimmed) {
    return '<html>\n<p></p>\n</html>';
  }
  if (trimmed.startsWith('<html>') && trimmed.endsWith('</html>')) {
    return trimmed;
  }

  // Any tag means it is already HTML, just missing the wrapper
  const body = /<[a-z][\s\S]*>/i.test(trimmed)
    ? trimmed
    : trimmed
        .split(/\r?\n/)
        .map(line => `<p>${escapeHtml(line)}</p>`)
        .join('\n');

  return `<html>\n${body}\n</html>`;
};

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

/**
 * Formats a timestamp into a readable date and time string like "Feb 6 2026 09:30".
 * @param timestamp - The timestamp to format.
 * @returns A formatted date and time string.
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${month} ${day} ${year} ${hours}:${minutes}`;
};

/**
 * Formats a date into a string with the format "dd/mm/yyyy - hh:mm PM/AM".
 * @param dateInput - The date or timestamp to format.
 * @returns A formatted date and time string.
 */
export const formatDateTime = (dateInput: Date | number): string => {
  const date = typeof dateInput === 'number' ? new Date(dateInput) : dateInput;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year} - ${strHours}:${minutes} ${ampm}`;
};
