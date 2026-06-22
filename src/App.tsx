import { useState, useEffect } from 'react'
import { useGame } from './context/GameContext'
import { useT } from './i18n'
import { getDueCards } from './srs'
import { shouldRemindNow, showReminder } from './lib/notifications'
import Landing from './screens/Landing'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Lesson from './screens/Lesson'
import Practice from './screens/Practice'
import Profile from './screens/Profile'
import Stories from './screens/Stories'
import Leagues from './screens/Leagues'
import Tutor from './screens/Tutor'
import Premium from './screens/Premium'
import Store from './screens/Store'
import GrammarReference from './screens/GrammarReference'

type Tab = 'home' | 'tutor' | 'stories' | 'leagues' | 'practice' | 'profile'

export default function App() {
  const { state, dispatch } = useGame()
  const t = useT()
  const [tab, setTab] = useState<Tab>('home')
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [practiceKey, setPracticeKey] = useState(0)
  const [showPremium, setShowPremium] = useState(false)
  const [showStore, setShowStore] = useState(false)
  const [showGrammar, setShowGrammar] = useState(false)
  const [showLanding, setShowLanding] = useState(true)

  // Retorno desde el pago de Stripe (?premium=success)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('premium') === 'success') {
      dispatch({ type: 'GO_PREMIUM' })
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [dispatch])

  // Recordatorio diario (cuando la app está abierta y toca la hora)
  useEffect(() => {
    if (!state.onboarded || !state.reminderEnabled) return
    const check = () => {
      const today = new Date().toISOString().slice(0, 10)
      const goalMet = state.xpTodayDate === today && state.xpToday >= state.dailyGoal
      if (!goalMet && shouldRemindNow(state.reminderTime, state.lastReminderDate)) {
        showReminder(state.streak)
        dispatch({ type: 'MARK_REMINDED' })
      }
    }
    check()
    const timer = setInterval(check, 60000)
    return () => clearInterval(timer)
  }, [
    state.onboarded,
    state.reminderEnabled,
    state.reminderTime,
    state.lastReminderDate,
    state.xpToday,
    state.xpTodayDate,
    state.dailyGoal,
    state.streak,
    dispatch,
  ])

  if (!state.onboarded) {
    return showLanding ? <Landing onStart={() => setShowLanding(false)} /> : <Onboarding />
  }

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

  if (showGrammar) {
    return <GrammarReference onExit={() => setShowGrammar(false)} />
  }

  if (showStore) {
    return (
      <div className="app">
        <header className="topbar">
          <button className="link-btn" onClick={() => setShowStore(false)}>
            {t('back')}
          </button>
          <div className="tb-brand">🛒 {t('store')}</div>
          <span style={{ width: 60 }} />
        </header>
        <main className="content">
          <Store />
        </main>
      </div>
    )
  }

  const due = getDueCards(state.srs).length

  return (
    <div className="app">
      <TopBar onPremium={() => setShowPremium(true)} onStore={() => setShowStore(true)} />

      <main className="content">
        {tab === 'home' && <Home onStartLesson={(id) => setActiveLesson(id)} />}
        {tab === 'tutor' && <Tutor onGoPremium={() => setShowPremium(true)} />}
        {tab === 'stories' && <Stories />}
        {tab === 'leagues' && <Leagues />}
        {tab === 'practice' && <Practice key={practiceKey} />}
        {tab === 'profile' && (
          <Profile onPremium={() => setShowPremium(true)} onGrammar={() => setShowGrammar(true)} />
        )}
      </main>

      <nav className="bottom-nav">
        <NavBtn active={tab === 'home'} icon="🏠" label={t('nav_learn')} onClick={() => setTab('home')} />
        <NavBtn active={tab === 'tutor'} icon="🤖" label={t('nav_tutor')} onClick={() => setTab('tutor')} />
        <NavBtn
          active={tab === 'practice'}
          icon="🔁"
          label={t('nav_review')}
          badge={due > 0 ? due : undefined}
          onClick={() => {
            setPracticeKey((k) => k + 1)
            setTab('practice')
          }}
        />
        <NavBtn active={tab === 'stories'} icon="📖" label={t('nav_stories')} onClick={() => setTab('stories')} />
        <NavBtn active={tab === 'leagues'} icon="🏆" label={t('nav_leagues')} onClick={() => setTab('leagues')} />
        <NavBtn active={tab === 'profile'} icon="👤" label={t('nav_profile')} onClick={() => setTab('profile')} />
      </nav>
    </div>
  )
}

function TopBar({ onPremium, onStore }: { onPremium: () => void; onStore: () => void }) {
  const { state } = useGame()
  const t = useT()
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
            👑 {t('premium')}
          </button>
        )}
        <span className="tb-stat streak" title="Racha">
          🔥 {state.streak}
        </span>
        <button className="tb-stat gem tb-gem-btn" title={t('store')} onClick={onStore}>
          💎 {state.gems}
        </button>
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
