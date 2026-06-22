// Cliente para la API de Claude (Anthropic) usable directamente desde el navegador.
// IMPORTANTE: en produccion, para una app a la venta, lo ideal es usar un backend
// proxy que guarde la clave de forma segura. Aqui permitimos llamada directa
// (header anthropic-dangerous-direct-browser-access) para una demo/MVP.

import { APP_SUMMARY } from '../data/appGuide'

const API_URL = 'https://api.anthropic.com/v1/messages'

// Si defines VITE_API_BASE (ej. https://tu-app.vercel.app) el tutor usará tu
// backend seguro (/api/tutor) y NO expondrá la clave en el navegador.
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || ''

export function usingSecureBackend(): boolean {
  return !!API_BASE
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface TutorReply {
  reply: string // respuesta del tutor en ingles
  correction?: string // correccion/feedback en espanol (opcional)
  translation?: string // traduccion al espanol de la respuesta
}

function systemPrompt(scenario: string, level: string): string {
  return [
    `You are Foxy, a friendly English tutor for Spanish speakers. The student's level is ${level}.`,
    `Scenario: ${scenario}.`,
    `Rules:`,
    `- Always reply in simple English appropriate for the student's level.`,
    `- Keep replies short (1-3 sentences) and ask a follow-up question to keep the conversation going.`,
    `- Stay in character for the scenario.`,
    `- If the student makes grammar or vocabulary mistakes, gently note them.`,
    `Respond ONLY with a valid JSON object (no markdown) with this exact shape:`,
    `{"reply": "<your English reply>", "correction": "<brief feedback in Spanish about mistakes, or empty string if none>", "translation": "<Spanish translation of your reply>"}`,
  ].join('\n')
}

function parseReply(text: string): TutorReply {
  try {
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}')
    const slice = text.slice(jsonStart, jsonEnd + 1)
    const parsed = JSON.parse(slice)
    return {
      reply: parsed.reply || text,
      correction: parsed.correction || undefined,
      translation: parsed.translation || undefined,
    }
  } catch {
    return { reply: text }
  }
}

export async function sendToTutor(opts: {
  apiKey: string
  model: string
  scenario: string
  level: string
  history: ChatMessage[]
}): Promise<TutorReply> {
  const { apiKey, model, scenario, level, history } = opts

  // --- Modo producción: backend seguro ---
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/tutor`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model, scenario, level, history }),
    })
    if (!res.ok) {
      let detail = ''
      try {
        detail = (await res.json())?.error || ''
      } catch {
        detail = await res.text()
      }
      throw new Error(`Error ${res.status}: ${detail}`)
    }
    const data = await res.json()
    return { reply: data.reply, correction: data.correction, translation: data.translation }
  }

  // --- Modo demo: llamada directa con clave del usuario ---
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 400,
      system: systemPrompt(scenario, level),
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  if (!res.ok) {
    let detail = ''
    try {
      const err = await res.json()
      detail = err?.error?.message || JSON.stringify(err)
    } catch {
      detail = await res.text()
    }
    throw new Error(`Error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  const text: string = data?.content?.[0]?.text ?? ''
  return parseReply(text)
}

// ---- Asistente de ayuda: explica qué puedes hacer con la app ----
function assistantSystemPrompt(): string {
  return [
    'Eres Foxy 🦊, el asistente de ayuda de la app "LinguaFox" para aprender inglés.',
    'Tu trabajo es explicar, en español claro y amable, todo lo que el usuario puede hacer con la app.',
    'Responde de forma breve (2-4 frases), concreta y guía al usuario paso a paso si lo necesita.',
    'Si preguntan algo que no es sobre la app, redirígelos amablemente a aprender inglés con ella.',
    'Estas son las funciones de la app:',
    APP_SUMMARY,
  ].join('\n')
}

export async function askAssistant(opts: {
  apiKey: string
  model: string
  history: ChatMessage[]
}): Promise<string> {
  const { apiKey, model, history } = opts

  // Modo producción: backend seguro
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/api/assistant`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model, history }),
    })
    if (!res.ok) {
      let detail = ''
      try {
        detail = (await res.json())?.error || ''
      } catch {
        detail = await res.text()
      }
      throw new Error(`Error ${res.status}: ${detail}`)
    }
    return (await res.json()).reply
  }

  // Modo demo: llamada directa con la clave del usuario
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 350,
      system: assistantSystemPrompt(),
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  })
  if (!res.ok) {
    let detail = ''
    try {
      detail = (await res.json())?.error?.message || ''
    } catch {
      detail = await res.text()
    }
    throw new Error(`Error ${res.status}: ${detail}`)
  }
  const data = await res.json()
  return data?.content?.[0]?.text ?? ''
}
