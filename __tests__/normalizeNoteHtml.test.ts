import { normalizeNoteHtml, sanitizeNoteContent } from '../app/utils/functions';

describe('normalizeNoteHtml', () => {
  it('leaves editor-shaped HTML untouched', () => {
    const html = '<html>\n<h3>Test</h3>\n</html>';
    expect(normalizeNoteHtml(html)).toBe(html);
  });

  it('accepts the seed format without newlines', () => {
    const html = '<html><p>Milk, eggs</p></html>';
    expect(normalizeNoteHtml(html)).toBe(html);
  });

  it('wraps bare fragments from older versions', () => {
    expect(normalizeNoteHtml('<p>Milk, eggs, bread, and butter</p>')).toBe(
      '<html>\n<p>Milk, eggs, bread, and butter</p>\n</html>',
    );
    expect(normalizeNoteHtml('<ul><li>a</li><li>b</li></ul>')).toBe(
      '<html>\n<ul><li>a</li><li>b</li></ul>\n</html>',
    );
  });

  it('turns plain text into escaped paragraphs, one per line', () => {
    expect(normalizeNoteHtml('Tom & Jerry\n1 > 0')).toBe(
      '<html>\n<p>Tom &amp; Jerry</p>\n<p>1 &gt; 0</p>\n</html>',
    );
  });

  it('gives empty content an empty paragraph', () => {
    expect(normalizeNoteHtml('   ')).toBe('<html>\n<p></p>\n</html>');
  });

  it('trims surrounding whitespace so the wrapper check still matches', () => {
    expect(normalizeNoteHtml('\n <html><p>x</p></html> \n')).toBe(
      '<html><p>x</p></html>',
    );
  });
});

describe('sanitizeNoteContent', () => {
  it('normalizes before stripping headings nested in list items', () => {
    expect(sanitizeNoteContent('<ul><li><h3>a</h3></li></ul>')).toBe(
      '<html>\n<ul><li>a</li></ul>\n</html>',
    );
  });
});
