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

const EMPTY_LIST_ITEM = /^<li>\s*(?:<br\s*\/?>)?\s*<\/li>$/i;
const LIST_OPEN = /^<(ol|ul)\b[^>]*>$/i;
// The editor drops blank lines at the end of a value it is given, a
// zero-width space keeps the paragraph (it is trimmed again on save)
const EMPTY_PARAGRAPH = '<p>\u200B</p>';

/**
 * Ends a list when Enter is pressed on an empty list item.
 *
 * `react-native-enriched` keeps adding list items on every Enter, so the
 * editor calls this with the HTML from before and after the second Enter.
 * The editor writes one element per line, so the Enter shows up as a single
 * added `<li></li>` line right after the empty item the cursor was in. Both
 * are dropped and an empty paragraph takes their place, splitting the list
 * if items follow. The paragraph holds a zero-width space so the editor
 * keeps it, which also leaves the cursor position unchanged.
 *
 * @param before - Editor HTML before the Enter.
 * @param after - Editor HTML after the Enter.
 * @returns The HTML to set, or `null` when the change is not that Enter.
 */
export const exitEmptyListItem = (
  before: string,
  after: string,
): string | null => {
  const prevLines = before.split('\n');
  const nextLines = after.split('\n');
  if (nextLines.length !== prevLines.length + 1) {
    return null;
  }

  // Lines before the insertion point are shared by both versions
  let shared = 0;
  while (shared < prevLines.length && prevLines[shared] === nextLines[shared]) {
    shared++;
  }
  const insertedOnlyOneLine = prevLines
    .slice(shared)
    .every((line, i) => line === nextLines[shared + 1 + i]);
  const itemIndex = shared - 1;
  if (
    !insertedOnlyOneLine ||
    !EMPTY_LIST_ITEM.test(nextLines[shared]?.trim() ?? '') ||
    !EMPTY_LIST_ITEM.test(prevLines[itemIndex]?.trim() ?? '')
  ) {
    return null;
  }

  let openIndex = itemIndex - 1;
  while (openIndex >= 0 && !LIST_OPEN.test(prevLines[openIndex].trim())) {
    openIndex--;
  }
  const tag = openIndex >= 0 && LIST_OPEN.exec(prevLines[openIndex].trim());
  if (!tag) {
    return null;
  }
  const listTag = tag[1].toLowerCase();

  const head = prevLines.slice(0, itemIndex);
  const tail = prevLines.slice(itemIndex + 1);
  const result = [
    ...(head.length - 1 === openIndex
      ? head.slice(0, -1)
      : [...head, `</${listTag}>`]),
    EMPTY_PARAGRAPH,
    ...(tail[0]?.trim().toLowerCase() === `</${listTag}>`
      ? tail.slice(1)
      : [`<${listTag}>`, ...tail]),
  ];
  return result.join('\n');
};

// Whitespace as the editor writes it: spaces, non-breaking spaces (named or
// numeric), zero-width spaces and line breaks
const SPACE = '(?:\\s|&nbsp;|&#160;|&#xa0;|\\u200B|<br\\s*\\/?>)';
const BLANK_BLOCK = new RegExp(
  `^(?:<br\\s*\\/?>|<(p|h[1-6]|li|blockquote|codeblock)\\b[^>]*>${SPACE}*<\\/\\1>)$`,
  'i',
);
const BLANK_LIST = /^<(ol|ul)\b[^>]*>\s*<\/\1>$/i;
const OPENING_TAGS = '((?:<[a-z][^>]*>)*)';
const CLOSING_TAGS = '((?:<\\/[a-z][^>]*>)*)';

/**
 * Removes blank lines and spaces from the start and end of a note's HTML.
 *
 * Empty paragraphs, line breaks and empty list items at either end are
 * dropped, then leading spaces of the first block and trailing spaces of the
 * last one are trimmed. Lines in between are left alone.
 *
 * @param content - Note content as produced by the editor.
 * @returns The trimmed HTML, `<html>\n</html>` when nothing is left.
 */
export const trimNoteHtml = (content: string): string => {
  const html = normalizeNoteHtml(content);
  const body = html.replace(/^<html>/, '').replace(/<\/html>$/, '');
  const lines = body
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const isListOpen = (line?: string) => !!line && LIST_OPEN.test(line);
  const isListClose = (line?: string) => !!line && /^<\/(ol|ul)>$/i.test(line);

  let changed = true;
  while (changed && lines.length) {
    changed = false;
    if (BLANK_BLOCK.test(lines[0]) || BLANK_LIST.test(lines[0])) {
      lines.shift();
      changed = true;
    } else if (isListOpen(lines[0]) && BLANK_BLOCK.test(lines[1] ?? '')) {
      lines.splice(1, 1);
      changed = true;
    } else if (isListOpen(lines[0]) && isListClose(lines[1])) {
      lines.splice(0, 2);
      changed = true;
    }

    const last = lines.length - 1;
    if (last < 0) {
      break;
    }
    if (BLANK_BLOCK.test(lines[last]) || BLANK_LIST.test(lines[last])) {
      lines.pop();
      changed = true;
    } else if (
      isListClose(lines[last]) &&
      BLANK_BLOCK.test(lines[last - 1] ?? '')
    ) {
      lines.splice(last - 1, 1);
      changed = true;
    } else if (isListClose(lines[last]) && isListOpen(lines[last - 1])) {
      lines.splice(last - 1, 2);
      changed = true;
    }
  }

  if (!lines.length) {
    return '<html>\n</html>';
  }

  // The first/last line can be a list wrapper, trim the item inside it instead
  const firstIndex = isListOpen(lines[0]) ? 1 : 0;
  const lastIndex = isListClose(lines[lines.length - 1])
    ? lines.length - 2
    : lines.length - 1;
  lines[firstIndex] = lines[firstIndex].replace(
    new RegExp(`^${OPENING_TAGS}${SPACE}+`, 'i'),
    '$1',
  );
  lines[lastIndex] = lines[lastIndex].replace(
    new RegExp(`${SPACE}+${CLOSING_TAGS}$`, 'i'),
    '$1',
  );

  return `<html>\n${lines.join('\n')}\n</html>`;
};
