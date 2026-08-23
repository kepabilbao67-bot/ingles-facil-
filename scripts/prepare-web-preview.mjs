import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const server = join('dist', 'server');
const client = join('dist', 'client');

cpSync(server, client, { recursive: true });

const dynamicRoutes = [
  ['call/[characterId].html', '_dynamic/call.html'],
  ['character/[characterId].html', '_dynamic/character.html'],
  ['lesson/[lessonId].html', '_dynamic/lesson.html'],
  ['quiz/[lessonId].html', '_dynamic/quiz.html'],
  ['result/[lessonId].html', '_dynamic/result.html'],
];

for (const [source, destination] of dynamicRoutes) {
  const output = join(client, destination);
  mkdirSync(dirname(output), { recursive: true });
  cpSync(join(server, source), output);
}
