import { useEffect, useState } from 'react'

interface Props {
  onDone: () => void
}

export default function SplashScreen({ onDone }: Props) {
  const [phase, setPhase] = useState(0) // 0: logo, 1: text, 2: fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 1600)
    const t3 = setTimeout(() => onDone(), 2200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onDone])

  return (
    <div className={`splash ${phase >= 2 ? 'splash-out' : ''}`}>
      <div className={`splash-logo ${phase >= 0 ? 'show' : ''}`}>🦊</div>
      <div className={`splash-text ${phase >= 1 ? 'show' : ''}`}>
        <h1>LinguaFox</h1>
        <p>Aprende inglés jugando</p>
      </div>
      <div className="splash-dots">
        <span className="splash-dot" />
        <span className="splash-dot" />
        <span className="splash-dot" />
      </div>
    </div>
  )
}
