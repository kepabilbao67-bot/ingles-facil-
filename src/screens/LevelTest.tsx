import { useState } from 'react'
import type { CEFRLevel } from '../types'

interface Props {
  onComplete: (level: CEFRLevel) => void
  onSkip: () => void
}

interface TestQuestion {
  level: CEFRLevel
  question: string
  options: string[]
  answer: string
}

// Preguntas ordenadas de menor a mayor dificultad.
const QUESTIONS: TestQuestion[] = [
  {
    level: 'A1',
    question: 'Choose: "___ name is John."',
    options: ['My', 'Me', 'I', 'Mine'],
    answer: 'My',
  },
  {
    level: 'A2',
    question: 'Choose the past: "Yesterday I ___ to the park."',
    options: ['go', 'goed', 'went', 'going'],
    answer: 'went',
  },
  {
    level: 'B1',
    question: 'Choose: "If it rains, I ___ stay home."',
    options: ['will', 'am', 'would have', 'was'],
    answer: 'will',
  },
  {
    level: 'B2',
    question: 'Choose: "She suggested ___ a break."',
    options: ['to take', 'taking', 'take', 'took'],
    answer: 'taking',
  },
  {
    level: 'C1',
    question: 'Choose: "___ had I arrived when the phone rang."',
    options: ['No sooner', 'Hardly when', 'As soon', 'Just then'],
    answer: 'No sooner',
  },
]

const LEVEL_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

export default function LevelTest({ onComplete, onSkip }: Props) {
  const [index, setIndex] = useState(0)
  const [correctByLevel, setCorrectByLevel] = useState<Record<string, boolean>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  const q = QUESTIONS[index]
  const progress = (index / QUESTIONS.length) * 100

  function choose(opt: string) {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
    setCorrectByLevel((c) => ({ ...c, [q.level]: opt === q.answer }))
  }

  function next() {
    if (index + 1 >= QUESTIONS.length) {
      // Nivel = el más alto consecutivo respondido correctamente desde A1
      let level: CEFRLevel = 'A1'
      for (const lvl of LEVEL_ORDER) {
        if (correctByLevel[lvl]) level = lvl
        else break
      }
      onComplete(level)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  return (
    <div className="level-test fade-in">
      <div className="lesson-top">
        <button className="close-btn" onClick={onSkip} aria-label="Saltar">
          ✕
        </button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="lt-count">
          {index + 1}/{QUESTIONS.length}
        </span>
      </div>

      <div className="lesson-body">
        <span className="lt-badge">{q.level}</span>
        <h2 className="ex-prompt">{q.question}</h2>
        <div className="choice-grid">
          {q.options.map((opt) => {
            const isCorrect = opt === q.answer
            const cls = answered
              ? isCorrect
                ? 'choice correct'
                : selected === opt
                  ? 'choice wrong'
                  : 'choice'
              : `choice ${selected === opt ? 'selected' : ''}`
            return (
              <button key={opt} className={cls} disabled={answered} onClick={() => choose(opt)}>
                {opt}
              </button>
            )
          })}
        </div>
      </div>

      <div className="lesson-footer">
        {answered ? (
          <button className="btn-primary" onClick={next}>
            {index + 1 >= QUESTIONS.length ? 'VER MI NIVEL' : 'CONTINUAR'}
          </button>
        ) : (
          <button className="btn-ghost" onClick={onSkip}>
            Saltar test
          </button>
        )}
      </div>
    </div>
  )
}
