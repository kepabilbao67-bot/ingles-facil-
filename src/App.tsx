import { useState, useEffect } from 'react'
import { useGame } from './context/GameContext'
import { getDueCards } from './srs'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Lesson from './screens/Lesson'
import Practice from './screens/Practice'
import Profile from './screens/Profile'
import Stories from './screens/Stories'
import Leagues from './screens/Leagues'
import Tutor from './screens/Tutor'
import Premium from './screens/Premium'

type Tab = 'home' | 'tutor' | 'stories' | 'leagues' | 'practice' | 'profile'

export default function App() {
  const { state, dispatch } = useGame()
  const [tab, setTab] = useState<Tab>('home')
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [practiceKey, setPracticeKey] = useState(0)
  const [showPremium, setShowPremium] = useState(false)

  // Retorno desde el pago de Stripe (?premium=success)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('premium') === 'success') {
      dispatch({ type: 'GO_PREMIUM' })
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [dispatch])

  if (!state.onboarded) return <Onboarding />

  if (activeLesson) {
    return (
      <Lesson
        lessonId={activeLesson}
        onExit={() => setActiveLesson(null)}
        onFinish={() => setActiveLesson(null)}
      />
    )
  }

  if (showPremium) {
    return <Premium onClose={() => setShowPremium(false)} />
  }

  const due = getDueCards(state.srs).length

  return (
    <div className="app">
      <TopBar onPremium={() => setShowPremium(true)} />

      <main className="content">
        {tab === 'home' && <Home onStartLesson={(id) => setActiveLesson(id)} />}
        {tab === 'tutor' && <Tutor onGoPremium={() => setShowPremium(true)} />}
        {tab === 'stories' && <Stories />}
        {tab === 'leagues' && <Leagues />}
        {tab === 'practice' && <Practice key={practiceKey} />}
        {tab === 'profile' && <Profile onPremium={() => setShowPremium(true)} />}
      </main>

      <nav className="bottom-nav">
        <NavBtn active={tab === 'home'} icon="🏠" label="Aprender" onClick={() => setTab('home')} />
        <NavBtn active={tab === 'tutor'} icon="🤖" label="Tutor" onClick={() => setTab('tutor')} />
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
        <NavBtn active={tab === 'stories'} icon="📖" label="Historias" onClick={() => setTab('stories')} />
        <NavBtn active={tab === 'leagues'} icon="🏆" label="Ligas" onClick={() => setTab('leagues')} />
        <NavBtn active={tab === 'profile'} icon="👤" label="Perfil" onClick={() => setTab('profile')} />
      </nav>
    </div>
  )
}

function TopBar({ onPremium }: { onPremium: () => void }) {
  const { state } = useGame()
  return (
    <header className="topbar">
      <div className="tb-brand">
        <span className="tb-fox">🦊</span> LinguaFox
      </div>
      <div className="tb-stats">
        {state.isPremium ? (
          <span className="tb-stat" title="Premium">
            👑
          </span>
        ) : (
          <button className="tb-premium" onClick={onPremium}>
            👑 Premium
          </button>
        )}
        <span className="tb-stat streak" title="Racha">
          🔥 {state.streak}
        </span>
        <span className="tb-stat gem" title="Gemas">
          💎 {state.gems}
        </span>
        {!state.isPremium && (
          <span className="tb-stat heart" title="Vidas">
            ❤️ {state.hearts}
          </span>
        )}
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
