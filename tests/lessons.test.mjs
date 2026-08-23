import assert from 'node:assert/strict';
import test from 'node:test';

import { LANGUAGE_OPTIONS, getSpeechLocale } from '../src/constants/languages.ts';
import { LESSONS_BY_LANGUAGE } from '../src/data/lessons.ts';

test('cada idioma publicado tiene ocho lecciones completas', () => {
  for (const option of LANGUAGE_OPTIONS) {
    const lessons = LESSONS_BY_LANGUAGE[option.code];

    assert.equal(lessons.length, 8, `${option.label} debe tener ocho lecciones`);
    for (const lesson of lessons) {
      assert.equal(lesson.language, option.code);
      assert.equal(lesson.words.length, 6, `${option.label}/${lesson.id} debe tener seis palabras`);
      assert.ok(lesson.title.trim());
      assert.ok(lesson.description.trim());
      assert.equal(new Set(lesson.words.map((word) => word.id)).size, lesson.words.length);
      for (const word of lesson.words) {
        assert.ok(word.source.trim());
        assert.ok(word.translation.trim());
      }
    }
  }
});

test('cada idioma publicado tiene una voz regional configurada', () => {
  for (const option of LANGUAGE_OPTIONS) {
    const locale = getSpeechLocale(option.code);
    assert.match(locale, /^[a-z]{2}-[A-Z]{2}$/);
    assert.equal(locale.slice(0, 2), option.code);
  }
});
