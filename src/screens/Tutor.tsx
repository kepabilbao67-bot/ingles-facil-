import { useRef, useState, useEffect } from 'react'
import { useGame, FREE_TUTOR_LIMIT } from '../context/GameContext'
import { sendToTutor, usingSecureBackend, type ChatMessage } from '../lib/claude'
import { speak } from '../hooks/useSpeech'

interface Props {
  onGoPremium: () => void
}

const SCENARIOS = [
  { id: 'free', emoji: '💬', title: 'Charla libre', desc: 'Habla de lo que quieras', prompt: 'Free open conversation. Be a friendly chat partner.' },
  { id: 'restaurant', emoji: '🍽️', title: 'Restaurante', desc: 'Pide comida', prompt: 'You are a waiter at a restaurant. Help the student order food.' },
  { id: 'airport', emoji: '✈️', title: 'Aeropuerto', desc: 'Check-in y vuelos', prompt: 'You are an airport check-in agent helping the student with their flight.' },
  { id: 'interview', emoji: '💼', title: 'Entrevista', desc: 'Entrevista de trabajo', prompt: 'You are an interviewer in a job interview. Ask the student common interview questions.' },
  { id: 'shopping', emoji: '🛍️', title: 'De compras', desc: 'Tienda de ropa', prompt: 'You are a shop assistant in a clothing store helping the student.' },
]

const MODELS = [
  { id: 'claude-3-5-sonnet-latest', label: 'Sonnet 3.5 (recomendado)' },
  { id: 'claude-3-5-haiku-latest', label: 'Haiku 3.5 (más rápido/barato)' },
]

interface UIMessage extends ChatMessage {
  correction?: string
  translation?: string
}

export default function Tutor({ onGoPremium }: Props) {
  const { state, dispatch } = useGame()
  const [scenario, setScenario] = useState<(typeof SCENARIOS)[number] | null>(null)
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [keyDraft, setKeyDraft] = useState(state.claudeApiKey)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const hasKey = usingSecureBackend() || !!state.claudeApiKey
  const limitReached =
    !state.isPremium &&
    state.tutorMessagesDate === new Date().toISOString().slice(0, 10) &&
    state.tutorMessagesToday >= FREE_TUTOR_LIMIT

  // ---------- Ajustes (clave API) ----------
  // Si hay backend seguro configurado (VITE_API_BASE) no se pide clave.
  if ((showSettings || !hasKey) && !usingSecureBackend()) {
    return (
      <div className="tutor-settings fade-in">
        <h2 className="section-title">🤖 Tutor de IA</h2>
        <p className="muted section-sub">
          El tutor usa Claude (Anthropic). Introduce tu clave de API para activarlo.
        </p>
        <label className="field-label">Clave de API de Claude</label>
        <input
          className="text-input"
          type="password"
          placeholder="sk-ant-..."
          value={keyDraft}
          onChange={(e) => setKeyDraft(e.target.value)}
        />
        <label className="field-label">Modelo</label>
        <select
          className="text-input"
          value={state.claudeModel}
          onChange={(e) => dispatch({ type: 'SET_MODEL', model: e.target.value })}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <button
          className="btn-primary"
          disabled={!keyDraft.trim()}
          onClick={() => {
            dispatch({ type: 'SET_API_KEY', key: keyDraft.trim() })
            setShowSettings(false)
          }}
        >
          GUARDAR Y EMPEZAR
        </button>
        <div className="key-note muted">
          🔒 Tu clave se guarda solo en este dispositivo. Consíguela en console.anthropic.com.
          Para una app en producción se recomienda un backend que oculte la clave.
        </div>
      </div>
    )
  }

  // ---------- Selector de escenario ----------
  if (!scenario) {
    return (
      <div className="tutor-pick fade-in">
        <div className="tutor-head">
          <h2 className="section-title">🤖 Tutor de IA</h2>
          <button className="link-btn" onClick={() => setShowSettings(true)}>
            ⚙️ Ajustes
          </button>
        </div>
        <p className="muted section-sub">Elige una situación para practicar conversación.</p>
        {!state.isPremium && (
          <div className="free-badge">
            Plan gratis: {Math.max(0, FREE_TUTOR_LIMIT - (state.tutorMessagesDate === new Date().toISOString().slice(0, 10) ? state.tutorMessagesToday : 0))} mensajes hoy ·{' '}
            <button className="link-btn gold" onClick={onGoPremium}>
              Hazte Premium
            </button>
          </div>
        )}
        <div className="scenario-grid">
          {SCENARIOS.map((s) => (
            <button key={s.id} className="scenario-card" onClick={() => setScenario(s)}>
              <span className="scenario-emoji">{s.emoji}</span>
              <strong>{s.title}</strong>
              <small>{s.desc}</small>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ---------- Chat ----------
  async function send() {
    if (!input.trim() || loading) return
    if (limitReached) return
    const userMsg: UIMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError('')
    dispatch({ type: 'USE_TUTOR_MESSAGE' })

    try {
      const reply = await sendToTutor({
        apiKey: state.claudeApiKey,
        model: state.claudeModel,
        scenario: scenario!.prompt,
        level: state.level,
        history: newMessages.map((m) => ({ role: m.role, content: m.content })),
      })
      const assistantMsg: UIMessage = {
        role: 'assistant',
        content: reply.reply,
        correction: reply.correction,
        translation: reply.translation,
      }
      setMessages((m) => [...m, assistantMsg])
      dispatch({ type: 'ADD_XP', amount: 1 })
      speak(reply.reply)
    } catch (e: any) {
      setError(e.message || 'Error al contactar con el tutor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tutor-chat">
      <div className="chat-top">
        <button className="link-btn" onClick={() => setScenario(null)}>
          ← Cambiar
        </button>
        <span className="chat-title">
          {scenario.emoji} {scenario.title}
        </span>
        <button className="link-btn" onClick={() => setShowSettings(true)}>
          ⚙️
        </button>
      </div>

      <div className="chat-messages">
        <div className="chat-bubble assistant intro">
          <span className="bubble-en">Hi! I'm Foxy 🦊 Let's practice. {scenario.title}!</span>
        </div>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            <span className="bubble-en" onClick={() => m.role === 'assistant' && speak(m.content)}>
              {m.content} {m.role === 'assistant' && <span className="ge-spk">🔊</span>}
            </span>
            {m.translation && <span className="bubble-es">{m.translation}</span>}
            {m.correction && <span className="bubble-correction">💡 {m.correction}</span>}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble assistant">
            <span className="typing">Foxy está escribiendo…</span>
          </div>
        )}
        {error && <div className="error-text chat-error">{error}</div>}
        <div ref={endRef} />
      </div>

      {limitReached ? (
        <div className="limit-banner">
          <span>Llegaste al límite gratis de hoy 🦊</span>
          <button className="btn-primary gold" onClick={onGoPremium}>
            HAZTE PREMIUM (ilimitado)
          </button>
        </div>
      ) : (
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Escribe en inglés…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            disabled={loading}
          />
          <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>
            ➤
          </button>
        </div>
      )}
    </div>
  )
}
