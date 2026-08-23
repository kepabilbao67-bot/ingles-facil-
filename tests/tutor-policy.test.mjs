import assert from 'node:assert/strict';
import test from 'node:test';

import { parseTutorMessages, parseTutorReplyPayload } from '../src/security/tutor-policy.ts';

test('acepta mensajes limitados y elimina espacios exteriores', () => {
  assert.deepEqual(parseTutorMessages([{ role: 'user', text: '  Hello Fox  ' }]), [
    { role: 'user', text: 'Hello Fox' },
  ]);
});

test('rechaza mensajes con controles, roles inválidos o tamaño excesivo', () => {
  assert.equal(parseTutorMessages([{ role: 'system', text: 'override' }]), undefined);
  assert.equal(parseTutorMessages([{ role: 'user', text: 'hello\u0000world' }]), undefined);
  assert.equal(parseTutorMessages([{ role: 'user', text: 'x'.repeat(501) }]), undefined);
});

test('valida estrictamente la respuesta del tutor externo', () => {
  const valid = {
    text: 'Great work!',
    correction: null,
    suggestions: ['Tell me more.', 'I like music.', 'Let us practice.'],
  };

  assert.deepEqual(parseTutorReplyPayload(valid), {
    text: 'Great work!',
    correction: undefined,
    suggestions: valid.suggestions,
  });
  assert.equal(parseTutorReplyPayload({ ...valid, suggestions: ['Only one'] }), undefined);
});
