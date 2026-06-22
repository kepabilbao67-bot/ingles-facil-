// Función serverless (Vercel): asistente de ayuda que explica la app.
// Usa ANTHROPIC_API_KEY del servidor (no expone la clave).

const ALLOWED_MODELS = new Set(['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'])

const APP_SUMMARY = `- Aprender: camino de unidades A1 a C1 con gramática y ejercicios variados.
- Tutor de IA: conversa en inglés por escenarios, con correcciones y audio.
- Repasar: repetición espaciada para no olvidar el vocabulario.
- Historias: diálogos por nivel con preguntas de comprensión.
- Ligas: competición semanal de XP (Bronce a Diamante).
- Racha y calendario: practica a diario; protege tu racha desde la tienda.
- Logros: insignias por tus avances.
- Tienda: canjea o consigue gemas (toca las gemas arriba).
- Gramática: todas las reglas reunidas en el Perfil.
- Premium: tutor ilimitado, vidas infinitas y sin anuncios.
- Recordatorios e idioma (ES/EN) en el Perfil.`

function systemPrompt() {
  return [
    'Eres Foxy 🦊, el asistente de ayuda de la app "LinguaFox" para aprender inglés.',
    'Explica en español claro y amable todo lo que el usuario puede hacer con la app.',
    'Responde breve (2-4 frases) y guía paso a paso si hace falta.',
    'Si preguntan algo ajeno a la app, redirígelos a aprender inglés con ella.',
    'Funciones de la app:',
    APP_SUMMARY,
  ].join('\n')
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Falta ANTHROPIC_API_KEY en el servidor' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { history = [], model } = body || {}
    const chosenModel = ALLOWED_MODELS.has(model) ? model : 'claude-3-5-sonnet-latest'
    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'history requerido' })
    }
    const trimmed = history.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || '').slice(0, 1000),
    }))

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: chosenModel,
        max_tokens: 350,
        system: systemPrompt(),
        messages: trimmed,
      }),
    })
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: await upstream.text() })
    }
    const data = await upstream.json()
    return res.status(200).json({ reply: data?.content?.[0]?.text ?? '' })
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Error interno' })
  }
}
