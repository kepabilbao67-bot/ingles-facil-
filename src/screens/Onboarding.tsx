import { useState } from 'react'
import { useGame } from '../context/GameContext'
import type { CEFRLevel } from '../types'

const LEVELS: { level: CEFRLevel; label: string; desc: string }[] = [
  { level: 'A1', label: 'Principiante', desc: 'Empiezo desde cero' },
  { level: 'A2', label: 'Básico', desc: 'Sé algunas palabras y frases' },
  { level: 'B1', label: 'Intermedio', desc: 'Puedo mantener conversaciones simples' },
  { level: 'B2', label: 'Intermedio Alto', desc: 'Me defiendo bien en la mayoría de situaciones' },
  { level: 'C1', label: 'Avanzado', desc: 'Entiendo textos complejos y me expreso con fluidez' },
]

const GOALS = [
  { min: 10, label: 'Casual', desc: '10 XP / día' },
  { min: 30, label: 'Regular', desc: '30 XP / día' },
  { min: 50, label: 'Serio', desc: '50 XP / día' },
  { min: 100, label: 'Intenso', desc: '100 XP / día' },
]

export default function Onboarding() {
  const { dispatch } = useGame()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [level, setLevel] = useState<CEFRLevel>('A1')
  const [goal, setGoal] = useState(30)

  return (
    <div className="onboarding">
      <div className="ob-mascot">🦊</div>
      {step === 0 && (
        <div className="ob-card fade-in">
          <h1>¡Hola! Soy Foxy 🦊</h1>
          <p className="muted">Tu compañero para aprender inglés. ¿Cómo te llamas?</p>
          <input
            className="text-input"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
          <button className="btn-primary" disabled={!name.trim()} onClick={() => setStep(1)}>
            CONTINUAR
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="ob-card fade-in">
          <h1>¿Cuál es tu nivel, {name}?</h1>
          <p className="muted">Personalizaremos tus lecciones.</p>
          <div className="ob-options">
            {LEVELS.map((l) => (
              <button
                key={l.level}
                className={`ob-option ${level === l.level ? 'selected' : ''}`}
                onClick={() => setLevel(l.level)}
              >
                <span className="ob-badge">{l.level}</span>
                <span>
                  <strong>{l.label}</strong>
                  <small>{l.desc}</small>
                </span>
              </button>
            ))}
          </div>
          <button className="btn-primary" onClick={() => setStep(2)}>
            CONTINUAR
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="ob-card fade-in">
          <h1>Tu meta diaria</h1>
          <p className="muted">¿Cuánto quieres practicar al día?</p>
          <div className="ob-options">
            {GOALS.map((g) => (
              <button
                key={g.min}
                className={`ob-option ${goal === g.min ? 'selected' : ''}`}
                onClick={() => setGoal(g.min)}
              >
                <span>
                  <strong>{g.label}</strong>
                  <small>{g.desc}</small>
                </span>
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            onClick={() => dispatch({ type: 'ONBOARD', name: name.trim(), level, dailyGoal: goal })}
          >
            ¡EMPEZAR A APRENDER!
          </button>
        </div>
      )}

      <div className="ob-dots">
        {[0, 1, 2].map((i) => (
          <span key={i} className={`dot ${i === step ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  )
}
