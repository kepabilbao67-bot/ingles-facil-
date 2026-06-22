import { useState } from 'react'
import { useGame } from './context/GameContext'
import { getDueCards } from './srs'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Lesson from './screens/Lesson'
import Practice from './screens/Practice'
import Profile from './screens/Profile'
import Stories from './screens/Stories'
import Leagues from './screens/Leagues'

type Tab = 'home' | 'stories' | 'leagues' | 'practice' | 'profile'

export default function App() {
  const { state } = useGame()
  const [tab, setTab] = useState<Tab>('home')
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [practiceKey, setPracticeKey] = useState(0)

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

  const due = getDueCards(state.srs).length

  return (
    <div className="app">
      <TopBar />

      <main className="content">
        {tab === 'home' && <Home onStartLesson={(id) => setActiveLesson(id)} />}
        {tab === 'stories' && <Stories />}
        {tab === 'leagues' && <Leagues />}
        {tab === 'practice' && <Practice key={practiceKey} />}
        {tab === 'profile' && <Profile />}
      </main>

      <nav className="bottom-nav">
        <NavBtn active={tab === 'home'} icon="🏠" label="Aprender" onClick={() => setTab('home')} />
        <NavBtn active={tab === 'stories'} icon="📖" label="Historias" onClick={() => setTab('stories')} />
        <NavBtn active={tab === 'leagues'} icon="🏆" label="Ligas" onClick={() => setTab('leagues')} />
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
        <NavBtn active={tab === 'profile'} icon="👤" label="Perfil" onClick={() => setTab('profile')} />
      </nav>
    </div>
  )
}

function TopBar() {
  const { state } = useGame()
  return (
    <header className="topbar">
      <div className="tb-brand">
        <span className="tb-fox">🦊</span> LinguaFox
      </div>
      <div className="tb-stats">
        <span className="tb-stat streak" title="Racha">
          🔥 {state.streak}
        </span>
        <span className="tb-stat gem" title="Gemas">
          💎 {state.gems}
        </span>
        <span className="tb-stat heart" title="Vidas">
          ❤️ {state.hearts}
        </span>
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
