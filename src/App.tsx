import { useState } from 'react'
import { useGame, getPlayerLevelInfo } from './context/GameContext'
import { getDueCards } from './srs'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Lesson from './screens/Lesson'
import Practice from './screens/Practice'
import Profile from './screens/Profile'
import Achievements from './screens/Achievements'
import DailyChallenge from './screens/DailyChallenge'
import Stats from './screens/Stats'
import { playComplete } from './hooks/useSounds'

type Tab = 'home' | 'practice' | 'challenge' | 'stats' | 'profile'

export default function App() {
  const { state } = useGame()
  const [tab, setTab] = useState<Tab>('home')
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [practiceKey, setPracticeKey] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)

  if (!state.onboarded) return <Onboarding />

  if (activeLesson) {
    return (
      <Lesson
        lessonId={activeLesson}
        onExit={() => setActiveLesson(null)}
        onFinish={() => {
          setActiveLesson(null)
          setShowConfetti(true)
          if (state.soundEnabled) playComplete()
          setTimeout(() => setShowConfetti(false), 3000)
        }}
      />
    )
  }

  if (showAchievements) {
    return (
      <div className="app">
        <div className="lesson-top" style={{ padding: '16px' }}>
          <button className="close-btn" onClick={() => setShowAchievements(false)}>✕</button>
          <h3 style={{ flex: 1, textAlign: 'center' }}>Logros</h3>
        </div>
        <div className="content">
          <Achievements />
        </div>
      </div>
    )
  }

  const due = getDueCards(state.srs).length
  const today = new Date().toISOString().slice(0, 10)
  const challengeAvailable = state.lastChallengeDate !== today

  return (
    <div className="app">
      {showConfetti && <Confetti />}
      <TopBar onAchievements={() => setShowAchievements(true)} />

      <main className="content">
        {tab === 'home' && <Home onStartLesson={(id) => setActiveLesson(id)} />}
        {tab === 'practice' && <Practice key={practiceKey} />}
        {tab === 'challenge' && <DailyChallenge />}
        {tab === 'stats' && <Stats />}
        {tab === 'profile' && <Profile />}
      </main>

      <nav className="bottom-nav">
        <NavBtn active={tab === 'home'} icon="🏠" label="Aprender" onClick={() => setTab('home')} />
        <NavBtn
          active={tab === 'practice'}
          icon="🔁"
          label="Repasar"
          badge={due > 0 ? due : undefined}
          onClick={() => {
            setPracticeKey((k) => k + 1)
            setTab('practice')
          }}
        />
        <NavBtn
          active={tab === 'challenge'}
          icon="🏅"
          label="Reto"
          badge={challengeAvailable ? 1 : undefined}
          onClick={() => setTab('challenge')}
        />
        <NavBtn active={tab === 'stats'} icon="📊" label="Stats" onClick={() => setTab('stats')} />
        <NavBtn active={tab === 'profile'} icon="👤" label="Perfil" onClick={() => setTab('profile')} />
      </nav>
    </div>
  )
}

function TopBar({ onAchievements }: { onAchievements: () => void }) {
  const { state } = useGame()
  const levelInfo = getPlayerLevelInfo(state.xp)
  return (
    <header className="topbar">
      <div className="tb-brand">
        <span className="tb-fox">{state.avatar}</span> LinguaFox
        <span className="tb-level-badge">Lv.{levelInfo.level}</span>
      </div>
      <div className="tb-stats">
        <span className="tb-stat streak" title="Racha">
          <span className="streak-flame">🔥</span> {state.streak}
        </span>
        <span className="tb-stat gem" title="Gemas">
          💎 {state.gems}
        </span>
        <span className="tb-stat heart" title="Vidas">
          ❤️ {state.hearts}
        </span>
        <button className="tb-stat trophy-btn" title="Logros" onClick={onAchievements}>
          🏆
        </button>
      </div>
    </header>
  )
}

function NavBtn({
  active,
  icon,
  label,
  badge,
  onClick,
}: {
  active: boolean
  icon: string
  label: string
  badge?: number
  onClick: () => void
}) {
  return (
    <button className={`nav-btn ${active ? 'active' : ''}`} onClick={onClick}>
      <span className="nav-icon">
        {icon}
        {badge !== undefined && <span className="nav-badge">{badge}</span>}
      </span>
      <span className="nav-label">{label}</span>
    </button>
  )
}

function Confetti() {
  const colors = ['#58cc02', '#1cb0f6', '#ff4b4b', '#ff9600', '#ffc800', '#a560e8', '#e84393']
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 6 + Math.random() * 8,
  }))

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}
    </div>
  )
}
