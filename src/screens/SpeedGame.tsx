import { useCallback, useEffect, useMemo, useState } from 'react'
import { useGame } from '../context/GameContext'
import { UNITS } from '../data/lessons'
import { playCorrect, playWrong, playComplete } from '../hooks/useSounds'

interface QuizItem {
  en: string
  es: string
  options: string[]
}

function generateQuiz(): QuizItem[] {
  const allVocab = UNITS.flatMap((u) => u.lessons.flatMap((l) => l.vocab))
  const shuffled = [...allVocab].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 30).map((item) => {
    // Get 3 wrong options
    const wrongs = allVocab
      .filter((v) => v.es !== item.es)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v) => v.es)
    const options = [...wrongs, item.es].sort(() => Math.random() - 0.5)
    return { en: item.en, es: item.es, options }
  })
}

export default function SpeedGame() {
  const { state, dispatch } = useGame()
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready')
  const [quiz, setQuiz] = useState<QuizItem[]>([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const startGame = useCallback(() => {
    setQuiz(generateQuiz())
    setIndex(0)
    setScore(0)
    setTimeLeft(30)
    setStreak(0)
    setBestStreak(0)
    setPhase('playing')
  }, [])

  useEffect(() => {
    if (phase !== 'playing') return
    if (timeLeft <= 0) {
      setPhase('done')
      const xpEarned = score * 2
      if (xpEarned > 0) dispatch({ type: 'ADD_XP', amount: xpEarned })
      if (state.soundEnabled) playComplete()
      return
    }
    const t = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft, score, dispatch, state.soundEnabled])

  function answer(option: string) {
    if (phase !== 'playing') return
    const correct = option === quiz[index].es
    if (correct) {
      setScore((s) => s + 1)
      setStreak((s) => {
        const newStreak = s + 1
        setBestStreak((b) => Math.max(b, newStreak))
        return newStreak
      })
      if (state.soundEnabled) playCorrect()
    } else {
      setStreak(0)
      if (state.soundEnabled) playWrong()
    }
    if (index + 1 < quiz.length) {
      setIndex((i) => i + 1)
    } else {
      setPhase('done')
      const xpEarned = score * 2
      if (xpEarned > 0) dispatch({ type: 'ADD_XP', amount: xpEarned })
      if (state.soundEnabled) playComplete()
    }
  }

  if (phase === 'ready') {
    return (
      <div className="speed-game fade-in">
        <div className="speed-ready">
          <span className="big-emoji">⚡</span>
          <h2>Modo Velocidad</h2>
          <p className="muted">¿Cuántas palabras puedes traducir en 30 segundos?</p>
          <div className="speed-rules">
            <p>🎯 Elige la traducción correcta</p>
            <p>⏱️ 30 segundos de tiempo</p>
            <p>🔥 Intenta mantener la racha</p>
            <p>⭐ Gana 2 XP por acierto</p>
          </div>
          <button className="btn-primary" onClick={startGame}>
            ¡EMPEZAR! ⚡
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'done') {
    const xpEarned = score * 2
    return (
      <div className="speed-game fade-in">
        <div className="speed-done">
          <span className="big-emoji">{score >= 15 ? '🏆' : score >= 10 ? '🌟' : score >= 5 ? '👍' : '💪'}</span>
          <h2>¡Tiempo!</h2>
          <div className="speed-results">
            <div className="speed-result-item">
              <span className="speed-result-val">{score}</span>
              <span className="speed-result-label">Aciertos</span>
            </div>
            <div className="speed-result-item">
              <span className="speed-result-val">{bestStreak}</span>
              <span className="speed-result-label">Mejor racha</span>
            </div>
            <div className="speed-result-item">
              <span className="speed-result-val">+{xpEarned}</span>
              <span className="speed-result-label">XP ganados</span>
            </div>
          </div>
          <button className="btn-primary" onClick={startGame}>
            JUGAR DE NUEVO ⚡
          </button>
        </div>
      </div>
    )
  }

  const current = quiz[index]

  return (
    <div className="speed-game fade-in">
      <div className="speed-top">
        <span className="speed-timer">⏱️ {timeLeft}s</span>
        <span className="speed-score">🎯 {score}</span>
        <span className="speed-streak">{streak > 0 ? `🔥${streak}` : ''}</span>
      </div>

      <div className="speed-question">
        <h2 className="speed-word">{current.en}</h2>
      </div>

      <div className="speed-options">
        {current.options.map((opt, i) => (
          <button key={`${opt}-${i}`} className="speed-option" onClick={() => answer(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
