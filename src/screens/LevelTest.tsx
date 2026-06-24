import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { playCorrect, playWrong, playComplete } from '../hooks/useSounds'
import type { CEFRLevel } from '../types'

interface TestQuestion {
  level: CEFRLevel
  question: string
  options: string[]
  answer: string
}

const QUESTIONS: TestQuestion[] = [
  // A1
  { level: 'A1', question: '"Hello, how are you?" means...', options: ['Hola, ¿cómo estás?', '¿Cómo te llamas?', '¿De dónde eres?', '¿Qué hora es?'], answer: 'Hola, ¿cómo estás?' },
  { level: 'A1', question: 'She ___ a student.', options: ['is', 'are', 'am', 'be'], answer: 'is' },
  // A2
  { level: 'A2', question: 'I ___ to the cinema yesterday.', options: ['went', 'go', 'goes', 'going'], answer: 'went' },
  { level: 'A2', question: 'There are ___ apples on the table.', options: ['some', 'a', 'an', 'much'], answer: 'some' },
  // B1
  { level: 'B1', question: 'If I ___ more time, I would travel more.', options: ['had', 'have', 'has', 'will have'], answer: 'had' },
  { level: 'B1', question: 'She has been working here ___ 2019.', options: ['since', 'for', 'from', 'during'], answer: 'since' },
  // B2
  { level: 'B2', question: '"To give up" means...', options: ['rendirse', 'dar', 'levantar', 'regalar'], answer: 'rendirse' },
  { level: 'B2', question: 'The report ___ by the team last week.', options: ['was written', 'wrote', 'has wrote', 'is writing'], answer: 'was written' },
  // C1
  { level: 'C1', question: '"Nevertheless" is similar to...', options: ['however / sin embargo', 'therefore / por lo tanto', 'moreover / además', 'meanwhile / mientras tanto'], answer: 'however / sin embargo' },
  { level: 'C1', question: 'The research ___ light on the issue.', options: ['sheds', 'makes', 'does', 'gives'], answer: 'sheds' },
  // C2
  { level: 'C2', question: '"The elephant in the room" means...', options: ['An obvious problem nobody mentions', 'A large animal', 'A messy place', 'Something funny'], answer: 'An obvious problem nobody mentions' },
  { level: 'C2', question: '"Ubiquitous" means...', options: ['present everywhere', 'very rare', 'extremely fast', 'completely silent'], answer: 'present everywhere' },
]

function calculateLevel(correctByLevel: Record<string, number>): CEFRLevel {
  // Needs at least 1 correct per level to "pass" that level
  if ((correctByLevel['C2'] || 0) >= 1 && (correctByLevel['C1'] || 0) >= 1) return 'C2'
  if ((correctByLevel['C1'] || 0) >= 1 && (correctByLevel['B2'] || 0) >= 1) return 'C1'
  if ((correctByLevel['B2'] || 0) >= 1 && (correctByLevel['B1'] || 0) >= 1) return 'B2'
  if ((correctByLevel['B1'] || 0) >= 1 && (correctByLevel['A2'] || 0) >= 1) return 'B1'
  if ((correctByLevel['A2'] || 0) >= 1) return 'A2'
  return 'A1'
}

const LEVEL_DESCRIPTIONS: Record<CEFRLevel, string> = {
  'A1': 'Principiante — Empezarás desde lo básico. ¡Perfecto para construir bases sólidas!',
  'A2': 'Básico — Conoces lo fundamental. ¡Ahora a ampliar vocabulario y fluidez!',
  'B1': 'Intermedio — Te comunicas bien. ¡Hora de perfeccionar gramática y expresiones!',
  'B2': 'Intermedio Alto — Te defiendes genial. ¡Vamos a por los phrasal verbs y matices!',
  'C1': 'Avanzado — Dominas el idioma. ¡A pulir el estilo y las expresiones nativas!',
  'C2': 'Maestría — Nivel casi nativo. ¡Impresionante! A por los últimos detalles.',
}

interface Props {
  onComplete: (level: CEFRLevel) => void
}

export default function LevelTest({ onComplete }: Props) {
  const { state } = useGame()
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctByLevel, setCorrectByLevel] = useState<Record<string, number>>({})
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState<CEFRLevel>('A1')

  const total = QUESTIONS.length
  const current = QUESTIONS[index]
  const progress = ((index) / total) * 100

  function handleAnswer(opt: string) {
    if (answered) return
    setSelected(opt)
    setAnswered(true)
    const correct = opt === current.answer
    if (correct) {
      setScore(s => s + 1)
      setCorrectByLevel(prev => ({
        ...prev,
        [current.level]: (prev[current.level] || 0) + 1
      }))
      if (state.soundEnabled) playCorrect()
    } else {
      if (state.soundEnabled) playWrong()
    }
  }

  function next() {
    if (index + 1 >= total) {
      const finalCorrect = { ...correctByLevel }
      if (selected === current.answer) {
        finalCorrect[current.level] = (finalCorrect[current.level] || 0)
      }
      const level = calculateLevel(finalCorrect)
      setResult(level)
      setFinished(true)
      if (state.soundEnabled) playComplete()
    } else {
      setIndex(i => i + 1)
      setAnswered(false)
      setSelected(null)
    }
  }

  if (finished) {
    return (
      <div className="level-test fade-in">
        <div className="lt-result">
          <span className="big-emoji">🎓</span>
          <h1>Tu nivel es: {result}</h1>
          <p className="lt-desc">{LEVEL_DESCRIPTIONS[result]}</p>
          <div className="lt-score">
            <span>{score}/{total} respuestas correctas</span>
          </div>
          <div className="lt-levels">
            {(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[]).map(lvl => (
              <span key={lvl} className={`lt-level-dot ${lvl === result ? 'current' : lvl < result ? 'passed' : ''}`}>
                {lvl}
              </span>
            ))}
          </div>
          <button className="btn-primary" onClick={() => onComplete(result)}>
            ¡EMPEZAR CON NIVEL {result}!
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="level-test fade-in">
      <div className="lt-header">
        <h2>🎓 Test de Nivel</h2>
        <span className="muted">{index + 1} / {total}</span>
      </div>

      <div className="progress-bar" style={{ margin: '12px 0' }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="lt-question">
        <span className="lt-q-level">{current.level}</span>
        <h3>{current.question}</h3>
      </div>

      <div className="choice-grid">
        {current.options.map(opt => {
          const isCorrect = opt === current.answer
          const cls = answered
            ? (isCorrect ? 'choice correct' : selected === opt ? 'choice wrong' : 'choice')
            : `choice ${selected === opt ? 'selected' : ''}`
          return (
            <button key={opt} className={cls} disabled={answered} onClick={() => handleAnswer(opt)}>
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <button className={`btn-primary ${selected === current.answer ? '' : 'btn-danger'}`} onClick={next}>
          CONTINUAR
        </button>
      )}
    </div>
  )
}
