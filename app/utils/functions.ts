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
