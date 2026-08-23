import type { TutorReply, Message } from '@/types/learning';

import { createLocalTutorReply } from './local-tutor';


/**
 * Llama al backend (Expo API Route) que actúa como proxy seguro para OpenAI.
 */
export async function fetchTutorReply(userText: string, contextMessages: Message[] = []): Promise<TutorReply | undefined> {
  const cleanText = userText.trim();
  if (!cleanText) return undefined;

  if (process.env.EXPO_PUBLIC_TUTOR_API_ENABLED !== 'true') {
    return createLocalTutorReply(cleanText);
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: contextMessages,
      }),
    });

    if (!response.ok) {
      console.warn('Error from backend:', response.status);
      return createLocalTutorReply(cleanText);
    }

    const data = await response.json() as TutorReply;
    return data;
  } catch (error) {
    console.error('Failed to fetch tutor reply:', error);
    return createLocalTutorReply(cleanText);
  }
}

export const INITIAL_TUTOR_SUGGESTIONS: readonly string[] = [
  'Hello! How are you?',
  'My name is…',
  'I want to practice English.',
];
