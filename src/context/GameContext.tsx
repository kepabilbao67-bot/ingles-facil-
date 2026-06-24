import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { CEFRLevel, PlayerState, VocabItem } from '../types'
import { createCard, reviewCard } from '../srs'

const STORAGE_KEY = 'linguafox_state_v2'
const MAX_HEARTS = 5
const HEART_REFILL_MS = 30 * 60 * 1000 // 30 min por corazon

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function defaultState(): PlayerState {
  return {
    name: '',
    level: 'A1',
    xp: 0,
    gems: 100,
    hearts: MAX_HEARTS,
    heartsRefillAt: null,
    streak: 0,
    lastActiveDay: null,
    dailyGoal: 30,
    xpToday: 0,
    xpTodayDate: todayStr(),
    completedLessons: [],
    srs: {},
    darkMode: false,
    onboarded: false,
    avatar: '🦊',
    playerLevel: 1,
    xpHistory: {},
    challengesCompleted: 0,
    lastChallengeDate: null,
    soundEnabled: true,
    unlockedAchievements: [],
  }
}

function loadState(): PlayerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    // Try old key too for migration
    const rawOld = localStorage.getItem('linguafox_state_v1')
    const source = raw || rawOld
    if (!source) return defaultState()
    const parsed = { ...defaultState(), ...JSON.parse(source) } as PlayerState
    // Apply dark mode immediately to prevent flash
    if (parsed.darkMode) {
      document.documentElement.classList.add('dark')
    }
    return parsed
  } catch {
    return defaultState()
  }
}

// Player level thresholds
export function getPlayerLevelInfo(xp: number): { level: number; title: string; xpForNext: number; xpInLevel: number; progress: number } {
  const levels = [
    { xp: 0, title: 'Novato' },
    { xp: 50, title: 'Aprendiz' },
    { xp: 150, title: 'Estudiante' },
    { xp: 300, title: 'Practicante' },
    { xp: 500, title: 'Intermedio' },
    { xp: 800, title: 'Avanzado' },
    { xp: 1200, title: 'Experto' },
    { xp: 1800, title: 'Maestro' },
    { xp: 2500, title: 'Sabio' },
    { xp: 3500, title: 'Leyenda' },
  ]
  let lvl = 1
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].xp) {
      lvl = i + 1
      break
    }
  }
  const current = levels[lvl - 1]
  const next = levels[lvl] || { xp: current.xp + 1000, title: 'Leyenda' }
  const xpInLevel = xp - current.xp
  const xpForNext = next.xp - current.xp
  const progress = Math.min(100, Math.round((xpInLevel / xpForNext) * 100))
  return { level: lvl, title: current.title, xpForNext, xpInLevel, progress }
}

type Action =
  | { type: 'ONBOARD'; name: string; level: CEFRLevel; dailyGoal: number }
  | { type: 'ADD_XP'; amount: number }
  | { type: 'LOSE_HEART' }
  | { type: 'REFILL_HEARTS' }
  | { type: 'BUY_HEARTS' }
  | { type: 'COMPLETE_LESSON'; lessonId: string; vocab: VocabItem[]; xp: number }
  | { type: 'REVIEW_CARD'; word: string; quality: number }
  | { type: 'TOGGLE_DARK' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'SET_AVATAR'; avatar: string }
  | { type: 'COMPLETE_CHALLENGE' }
  | { type: 'UNLOCK_ACHIEVEMENT'; id: string }
  | { type: 'TICK' }
  | { type: 'RESET' }

function rolloverDaily(state: PlayerState): PlayerState {
  const today = todayStr()
  if (state.xpTodayDate !== today) {
    return { ...state, xpToday: 0, xpTodayDate: today }
  }
  return state
}

function updateStreak(state: PlayerState): PlayerState {
  const today = todayStr()
  if (state.lastActiveDay === today) return state
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  let streak = state.streak
  if (state.lastActiveDay === yesterday) streak += 1
  else streak = 1
  return { ...state, streak, lastActiveDay: today }
}

function updateXpHistory(state: PlayerState, amount: number): PlayerState {
  const today = todayStr()
  const xpHistory = { ...state.xpHistory }
  xpHistory[today] = (xpHistory[today] || 0) + amount
  // Keep only last 30 days
  const keys = Object.keys(xpHistory).sort().slice(-30)
  const trimmed: Record<string, number> = {}
  keys.forEach((k) => { trimmed[k] = xpHistory[k] })
  return { ...state, xpHistory: trimmed }
}

function updatePlayerLevel(state: PlayerState): PlayerState {
  const info = getPlayerLevelInfo(state.xp)
  return { ...state, playerLevel: info.level }
}

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'ONBOARD':
      return {
        ...state,
        name: action.name,
        level: action.level,
        dailyGoal: action.dailyGoal,
        onboarded: true,
      }
    case 'ADD_XP': {
      let s = rolloverDaily(state)
      s = updateXpHistory(s, action.amount)
      s = { ...s, xp: s.xp + action.amount, xpToday: s.xpToday + action.amount }
      return updatePlayerLevel(s)
    }
    case 'LOSE_HEART': {
      const hearts = Math.max(0, state.hearts - 1)
      const heartsRefillAt =
        hearts < MAX_HEARTS && state.heartsRefillAt == null
          ? Date.now() + HEART_REFILL_MS
          : state.heartsRefillAt
      return { ...state, hearts, heartsRefillAt }
    }
    case 'REFILL_HEARTS':
      return { ...state, hearts: MAX_HEARTS, heartsRefillAt: null }
    case 'BUY_HEARTS': {
      if (state.gems < 50) return state
      return { ...state, hearts: MAX_HEARTS, heartsRefillAt: null, gems: state.gems - 50 }
    }
    case 'COMPLETE_LESSON': {
      let s = rolloverDaily(state)
      s = updateStreak(s)
      s = updateXpHistory(s, action.xp)
      const srs = { ...s.srs }
      for (const v of action.vocab) {
        if (!srs[v.en]) srs[v.en] = createCard(v)
      }
      const completedLessons = s.completedLessons.includes(action.lessonId)
        ? s.completedLessons
        : [...s.completedLessons, action.lessonId]
      s = {
        ...s,
        srs,
        completedLessons,
        xp: s.xp + action.xp,
        xpToday: s.xpToday + action.xp,
        gems: s.gems + 5,
      }
      return updatePlayerLevel(s)
    }
    case 'REVIEW_CARD': {
      const card = state.srs[action.word]
      if (!card) return state
      return { ...state, srs: { ...state.srs, [action.word]: reviewCard(card, action.quality) } }
    }
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode }
    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled }
    case 'SET_AVATAR':
      return { ...state, avatar: action.avatar }
    case 'COMPLETE_CHALLENGE': {
      let s = rolloverDaily(state)
      s = updateStreak(s)
      const xpBonus = 25
      s = updateXpHistory(s, xpBonus)
      return updatePlayerLevel({
        ...s,
        challengesCompleted: s.challengesCompleted + 1,
        lastChallengeDate: todayStr(),
        xp: s.xp + xpBonus,
        xpToday: s.xpToday + xpBonus,
        gems: s.gems + 10,
      })
    }
    case 'UNLOCK_ACHIEVEMENT': {
      if (state.unlockedAchievements.includes(action.id)) return state
      return {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, action.id],
        gems: state.gems + 5,
      }
    }
    case 'TICK': {
      if (state.heartsRefillAt && Date.now() >= state.heartsRefillAt) {
        const hearts = Math.min(MAX_HEARTS, state.hearts + 1)
        const heartsRefillAt = hearts < MAX_HEARTS ? Date.now() + HEART_REFILL_MS : null
        return { ...state, hearts, heartsRefillAt }
      }
      return state
    }
    case 'RESET':
      return defaultState()
    default:
      return state
  }
}

interface GameContextValue {
  state: PlayerState
  dispatch: React.Dispatch<Action>
}

const GameContext = createContext<GameContextValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode)
  }, [state.darkMode])

  useEffect(() => {
    const t = setInterval(() => dispatch({ type: 'TICK' }), 10000)
    return () => clearInterval(t)
  }, [])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame debe usarse dentro de GameProvider')
  return ctx
}

export { MAX_HEARTS }
