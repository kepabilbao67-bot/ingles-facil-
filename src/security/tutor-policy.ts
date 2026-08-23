import type { TutorReply } from '@/types/learning';

export const MAX_TUTOR_BODY_LENGTH = 8_192;
export const MAX_TUTOR_MESSAGES = 10;
export const MAX_TUTOR_MESSAGE_LENGTH = 500;

const FORBIDDEN_CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export interface TutorMessagePayload {
  readonly role: 'user' | 'tutor';
  readonly text: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function parseTutorMessages(value: unknown): TutorMessagePayload[] | undefined {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_TUTOR_MESSAGES) {
    return undefined;
  }

  const messages: TutorMessagePayload[] = [];
  for (const candidate of value) {
    if (!isRecord(candidate)) return undefined;

    const { role, text } = candidate;
    if (
      (role !== 'user' && role !== 'tutor') ||
      typeof text !== 'string' ||
      text.length > MAX_TUTOR_MESSAGE_LENGTH ||
      FORBIDDEN_CONTROL_CHARACTERS.test(text)
    ) {
      return undefined;
    }

    const cleanText = text.trim();
    if (!cleanText) return undefined;
    messages.push({ role, text: cleanText });
  }

  return messages;
}

export function parseTutorReplyPayload(value: unknown): TutorReply | undefined {
  if (!isRecord(value) || typeof value.text !== 'string' || value.text.length > 500) {
    return undefined;
  }

  if (
    !Array.isArray(value.suggestions) ||
    value.suggestions.length !== 3 ||
    !value.suggestions.every(
      (suggestion) =>
        typeof suggestion === 'string' &&
        suggestion.trim().length > 0 &&
        suggestion.length <= 120 &&
        !FORBIDDEN_CONTROL_CHARACTERS.test(suggestion),
    )
  ) {
    return undefined;
  }

  let correction: TutorReply['correction'];
  if (value.correction !== null && value.correction !== undefined) {
    if (
      !isRecord(value.correction) ||
      typeof value.correction.correctedText !== 'string' ||
      typeof value.correction.explanation !== 'string' ||
      value.correction.correctedText.length > 500 ||
      value.correction.explanation.length > 500
    ) {
      return undefined;
    }
    correction = {
      correctedText: value.correction.correctedText.trim(),
      explanation: value.correction.explanation.trim(),
    };
  }

  return {
    text: value.text.trim(),
    suggestions: value.suggestions.map((suggestion) => suggestion.trim()),
    correction,
  };
}
