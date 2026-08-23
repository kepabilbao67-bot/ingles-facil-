import type { ChatCorrection, TutorReply } from '../types/learning';

const DEFAULT_SUGGESTIONS = ['I like learning English.', 'Can you help me?', 'Tell me about your day.'];

interface CorrectionRule {
  readonly pattern: RegExp;
  readonly correctedText: string;
  readonly explanation: string;
}

const CORRECTION_RULES: readonly CorrectionRule[] = [
  {
    pattern: /\bi goed\b/i,
    correctedText: 'I went',
    explanation: '“Go” es irregular en pasado: go → went.',
  },
  {
    pattern: /\bi am agree\b/i,
    correctedText: 'I agree',
    explanation: 'En inglés decimos “I agree”, sin “am”.',
  },
  {
    pattern: /\bi have (\d+) years\b/i,
    correctedText: 'I am $1 years old',
    explanation: 'Para expresar la edad en inglés usamos “I am … years old”.',
  },
  {
    pattern: /\bi no understand\b/i,
    correctedText: "I don't understand",
    explanation: 'Usa “don’t” para formar esta frase negativa.',
  },
  {
    pattern: /\bshe have\b/i,
    correctedText: 'She has',
    explanation: 'Con “she”, el verbo “have” cambia a “has”.',
  },
];

function createCorrection(userText: string): ChatCorrection | undefined {
  for (const rule of CORRECTION_RULES) {
    if (!rule.pattern.test(userText)) continue;
    return {
      correctedText: userText.replace(rule.pattern, rule.correctedText),
      explanation: rule.explanation,
    };
  }

  if (/^i\b/.test(userText.trim())) {
    return {
      correctedText: `I${userText.trim().slice(1)}`,
      explanation: 'Recuerda escribir el pronombre “I” con mayúscula.',
    };
  }

  return undefined;
}

export function createLocalTutorReply(userText: string): TutorReply {
  const correction = createCorrection(userText);
  const normalized = userText.toLowerCase();
  let text = 'Nice! Tell me one more thing about yourself. What do you enjoy doing?';
  let suggestions = DEFAULT_SUGGESTIONS;

  if (/\b(hello|hi|hey)\b/.test(normalized)) {
    text = 'Hello! I’m Fox, your English tutor. How are you feeling today?';
    suggestions = ['I am great, thanks!', 'I am a little tired.', 'I am happy today.'];
  } else if (/\b(thank|thanks)\b/.test(normalized)) {
    text = 'You’re welcome! What would you like to practice next?';
    suggestions = ['I want to practice food.', 'Let’s practice travel.', 'I want free conversation.'];
  } else if (/\b(name|called)\b/.test(normalized)) {
    text = 'Lovely to meet you! Where are you from?';
    suggestions = ['I am from Spain.', 'I am from Mexico.', 'I am from Argentina.'];
  } else if (/\b(i like|i love)\b/.test(normalized)) {
    text = 'That sounds fun! Why do you like it?';
    suggestions = ['Because it is relaxing.', 'Because it is exciting.', 'I do it with my friends.'];
  }

  return {
    text: correction ? `Good try! ${text}` : text,
    correction,
    suggestions,
  };
}
