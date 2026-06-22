import { useState, useRef, useEffect } from 'react'
import { useGame } from '../context/GameContext'
import { askAssistant, usingSecureBackend, type ChatMessage } from '../lib/claude'
import { GUIDE_FEATURES } from '../data/appGuide'

interface Props {
  onExit: () => void
}

const SUGGESTED = [
  '¿Qué puedo hacer en esta app?',
  '¿Cómo funciona el tutor de IA?',
  '¿Cómo mantengo mi racha?',
  '¿Qué gano con Premium?',
]

export default function Guide({ onExit }: Props) {
  const { state } = useGame()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const aiAvailable = usingSecureBackend() || !!state.claudeApiKey

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const q = text.trim()
    if (!q || loading) return
    const history = [...messages, { role: 'user', content: q } as ChatMessage]
    setMessages(history)
    setInput('')
    setLoading(true)
    setError('')
    try {
      const reply = await askAssistant({
        apiKey: state.claudeApiKey,
        model: state.claudeModel,
        history,
      })
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch (e: any) {
      setError(e.message || 'Error al contactar con el asistente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="link-btn" onClick={onExit}>
          ← Volver
        </button>
        <div className="tb-brand">❓ Guía</div>
        <span style={{ width: 60 }} />
      </header>

      <main className="content">
        <div className="guide">
          <div className="guide-hero">
            <div className="guide-fox">🦊</div>
            <h2>¿Qué puedes hacer con LinguaFox?</h2>
            <p className="muted">Aquí tienes todo explicado. ¡Y puedes preguntarle a Foxy lo que quieras!</p>
          </div>

          {/* Asistente de IA */}
          <div className="guide-assistant">
            <h3 className="guide-h3">🤖 Pregúntale a Foxy</h3>
            {!aiAvailable ? (
              <p className="muted guide-ai-note">
                Activa el asistente de IA introduciendo tu clave de Claude en la pestaña <strong>Tutor 🤖</strong>.
                Mientras tanto, abajo tienes la guía completa.
              </p>
            ) : (
              <>
                <div className="guide-chat">
                  {messages.length === 0 && (
                    <div className="chat-bubble assistant intro">
                      <span className="bubble-en">¡Hola! 🦊 Pregúntame qué puedes hacer en la app.</span>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`chat-bubble ${m.role}`}>
                      <span className="bubble-en">{m.content}</span>
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

                <div className="guide-suggested">
                  {SUGGESTED.map((s) => (
                    <button key={s} className="suggest-chip" disabled={loading} onClick={() => send(s)}>
                      {s}
                    </button>
                  ))}
                </div>

                <div className="chat-input-row">
                  <input
                    className="chat-input"
                    placeholder="Escribe tu pregunta…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && send(input)}
                    disabled={loading}
                  />
                  <button className="chat-send" onClick={() => send(input)} disabled={loading || !input.trim()}>
                    ➤
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Guía visual (siempre disponible) */}
          <h3 className="guide-h3">📋 Todas las funciones</h3>
          <div className="guide-list">
            {GUIDE_FEATURES.map((f) => (
              <div key={f.title} className="guide-card">
                <span className="guide-icon">{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
