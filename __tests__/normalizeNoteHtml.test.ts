import {
  exitEmptyListItem,
  normalizeNoteHtml,
  sanitizeNoteContent,
  trimNoteHtml,
} from '../app/utils/functions';

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

describe('exitEmptyListItem', () => {
  const wrap = (...lines: string[]) =>
    ['<html>', ...lines, '</html>'].join('\n');

  it('ends the list when Enter is pressed on the last, empty item', () => {
    const before = wrap('<ol>', '<li>Test</li>', '<li></li>', '</ol>');
    const after = wrap(
      '<ol>',
      '<li>Test</li>',
      '<li></li>',
      '<li></li>',
      '</ol>',
    );
    expect(exitEmptyListItem(before, after)).toBe(
      wrap('<ol>', '<li>Test</li>', '</ol>', '<p>\u200B</p>'),
    );
  });

  it('splits the list when items follow', () => {
    const before = wrap(
      '<ul>',
      '<li>a</li>',
      '<li></li>',
      '<li>b</li>',
      '</ul>',
    );
    const after = wrap(
      '<ul>',
      '<li>a</li>',
      '<li></li>',
      '<li></li>',
      '<li>b</li>',
      '</ul>',
    );
    expect(exitEmptyListItem(before, after)).toBe(
      wrap(
        '<ul>',
        '<li>a</li>',
        '</ul>',
        '<p>\u200B</p>',
        '<ul>',
        '<li>b</li>',
        '</ul>',
      ),
    );
  });

  it('drops the list entirely when its only item was empty', () => {
    const before = wrap('<p>x</p>', '<ul>', '<li></li>', '</ul>');
    const after = wrap('<p>x</p>', '<ul>', '<li></li>', '<li></li>', '</ul>');
    expect(exitEmptyListItem(before, after)).toBe(
      wrap('<p>x</p>', '<p>\u200B</p>'),
    );
  });

  it('ignores an Enter that left a non-empty item', () => {
    const before = wrap('<ol>', '<li>Test</li>', '</ol>');
    const after = wrap('<ol>', '<li>Test</li>', '<li></li>', '</ol>');
    expect(exitEmptyListItem(before, after)).toBeNull();
  });
});

describe('trimNoteHtml', () => {
  it('drops blank blocks and list items at both ends', () => {
    expect(
      trimNoteHtml(
        '<html>\n<p></p>\n<br>\n<ol>\n<li>Test</li>\n<li></li>\n<li></li>\n</ol>\n<p></p>\n</html>',
      ),
    ).toBe('<html>\n<ol>\n<li>Test</li>\n</ol>\n</html>');
  });

  it('keeps blank lines in the middle', () => {
    const html = '<html>\n<p>a</p>\n<p></p>\n<p>b</p>\n</html>';
    expect(trimNoteHtml(html)).toBe(html);
  });

  it('trims spaces at the start of the first and end of the last block', () => {
    expect(
      trimNoteHtml('<html>\n<p>  <b>hi</b></p>\n<p>there &nbsp; </p>\n</html>'),
    ).toBe('<html>\n<p><b>hi</b></p>\n<p>there</p>\n</html>');
  });

  it('trims numeric non-breaking spaces the editor writes', () => {
    expect(trimNoteHtml('<html>\n<p>&#160; Test&#160;</p>\n</html>')).toBe(
      '<html>\n<p>Test</p>\n</html>',
    );
  });

  it('drops the zero-width space left when a list was ended', () => {
    expect(
      trimNoteHtml('<html>\n<ul>\n<li>a</li>\n</ul>\n<p>\u200B</p>\n</html>'),
    ).toBe('<html>\n<ul>\n<li>a</li>\n</ul>\n</html>');
  });

  it('returns an empty document when nothing is left', () => {
    expect(
      trimNoteHtml('<html>\n<p> </p>\n<ul>\n<li></li>\n</ul>\n</html>'),
    ).toBe('<html>\n</html>');
  });
});
