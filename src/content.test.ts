import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_CONTENT, decodeContent, encodeContent, makeShareUrl, normalizeContent, readContent } from './content.ts';

test('personal links preserve multilingual names, paragraphs, and punctuation', () => {
  const content = { ...DEFAULT_CONTENT, to: 'శ్రావ్య 💕', from: 'Vamshi', letter: 'హలో!\n\nYou + me? ♡\nI’m here.' };
  assert.deepEqual(decodeContent(encodeContent(content)), content);
  const url = new URL(makeShareUrl('https://example.com/?old=1#letter', content));
  assert.equal(url.search, '');
  assert.deepEqual(readContent({ hash: url.hash }), content);
});
test('invalid or oversized shared content fails safely', () => {
  for (const invalid of ['', 'not valid!', 'a'.repeat(43000), btoa('[]'), btoa('null')]) assert.equal(decodeContent(invalid), null);
  assert.deepEqual(readContent({ hash: '#love=broken' }, { getItem: () => JSON.stringify({ to: 'Previous visitor' }) }), DEFAULT_CONTENT);
});
test('a received personal link takes priority over browser-local edits', () => {
  const mine = { ...DEFAULT_CONTENT, to: 'Alice', from: 'Bob' };
  const another = { ...DEFAULT_CONTENT, to: 'Different name' };
  assert.deepEqual(readContent({ hash: `#love=${encodeContent(mine)}` }, { getItem: () => JSON.stringify(another) }), mine);
});
test('empty fields, malformed storage, and blocked storage retain a usable proposal', () => {
  assert.deepEqual(normalizeContent({ to: ' ', reasons: null }), DEFAULT_CONTENT);
  assert.deepEqual(readContent({ hash: '' }, { getItem: () => { throw new Error('blocked'); } }), DEFAULT_CONTENT);
  assert.deepEqual(readContent({ hash: '' }, { getItem: () => 'invalid' }), DEFAULT_CONTENT);
});
test('custom text is bounded and retained as plain text', () => {
  const result = normalizeContent({ to: '<img onerror=alert(1)>', from: 'x'.repeat(100), question: 'q'.repeat(200), reasons: ['r'.repeat(700)] });
  assert.equal(result.to, '<img onerror=alert(1)>');
  assert.equal(result.from.length, 60);
  assert.equal(result.question.length, 120);
  assert.equal(result.reasons[0].length, 400);
  assert.equal(result.reasons[1], DEFAULT_CONTENT.reasons[1]);
});
