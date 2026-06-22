// Función serverless (Vercel) que actúa de proxy seguro hacia Claude.
// La clave de API vive SOLO en el servidor (variable de entorno ANTHROPIC_API_KEY),
// nunca en el navegador. Despliega esto en Vercel/Netlify y apunta el cliente con
// VITE_API_BASE a tu dominio.

const ALLOWED_MODELS = new Set([
  'claude-3-5-sonnet-latest',
  'claude-3-5-haiku-latest',
])

function systemPrompt(scenario, level) {
  return [
    `You are Foxy, a friendly English tutor for Spanish speakers. The student's level is ${level}.`,
    `Scenario: ${scenario}.`,
    `Rules:`,
    `- Always reply in simple English appropriate for the student's level.`,
    `- Keep replies short (1-3 sentences) and ask a follow-up question.`,
    `- Stay in character for the scenario.`,
    `- Gently note grammar or vocabulary mistakes.`,
    `Respond ONLY with a valid JSON object (no markdown) shaped like:`,
    `{"reply": "<English reply>", "correction": "<brief Spanish feedback or empty>", "translation": "<Spanish translation of reply>"}`,
  ].join('\n')
}

export default async function handler(req, res) {
  // CORS básico (ajusta el origen a tu dominio en producción)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Falta ANTHROPIC_API_KEY en el servidor' })

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const { scenario = 'free conversation', level = 'A1', history = [], model } = body || {}
    const chosenModel = ALLOWED_MODELS.has(model) ? model : 'claude-3-5-sonnet-latest'

    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'history requerido' })
    }
    // Limitar tamaño para controlar costes
    const trimmed = history.slice(-12).map((m) => ({
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
        max_tokens: 400,
        system: systemPrompt(scenario, level),
        messages: trimmed,
      }),
    })

    if (!upstream.ok) {
      const errText = await upstream.text()
      return res.status(upstream.status).json({ error: errText })
    }

    const data = await upstream.json()
    const text = data?.content?.[0]?.text ?? ''
    let parsed = { reply: text }
    try {
      const s = text.indexOf('{')
      const e = text.lastIndexOf('}')
      const obj = JSON.parse(text.slice(s, e + 1))
      parsed = {
        reply: obj.reply || text,
        correction: obj.correction || undefined,
        translation: obj.translation || undefined,
      }
    } catch {
      // dejar reply en texto plano
    }
    return res.status(200).json(parsed)
  } catch (e) {
    return res.status(500).json({ error: e?.message || 'Error interno' })
  }
}
