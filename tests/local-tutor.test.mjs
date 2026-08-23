import assert from 'node:assert/strict';
import test from 'node:test';

import { createLocalTutorReply } from '../src/services/local-tutor.ts';

test('corrige la edad con el verbo to be', () => {
  const reply = createLocalTutorReply('i have 50 years');

  assert.equal(reply.correction?.correctedText, 'I am 50 years old');
  assert.match(reply.correction?.explanation ?? '', /edad/i);
  assert.equal(reply.suggestions.length, 3);
});

test('corrige el pasado irregular de go', () => {
  const reply = createLocalTutorReply('i goed to the store');

  assert.equal(reply.correction?.correctedText, 'I went to the store');
  assert.match(reply.correction?.explanation ?? '', /irregular/i);
});

test('mantiene una respuesta local útil cuando no hay error', () => {
  const reply = createLocalTutorReply('Hello');

  assert.equal(reply.correction, undefined);
  assert.match(reply.text, /Fox/);
  assert.deepEqual(reply.suggestions, [
    'I am great, thanks!',
    'I am a little tired.',
    'I am happy today.',
  ]);
});

