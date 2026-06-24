import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { CEFRLevel, PlayerState, VocabItem } from '../types'
import { createCard, reviewCard } from '../srs'

const STORAGE_KEY = 'linguafox_state_v1'
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
  }
}

function loadState(): PlayerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = { ...defaultState(), ...JSON.parse(raw) } as PlayerState
    // Apply dark mode immediately to prevent flash
    if (parsed.darkMode) {
      document.documentElement.classList.add('dark')
    }
    return parsed
  } catch {
    return defaultState()
  }
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
      return { ...s, xp: s.xp + action.amount, xpToday: s.xpToday + action.amount }
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
      const srs = { ...s.srs }
      for (const v of action.vocab) {
        if (!srs[v.en]) srs[v.en] = createCard(v)
      }
      const completedLessons = s.completedLessons.includes(action.lessonId)
        ? s.completedLessons
        : [...s.completedLessons, action.lessonId]
      return {
        ...s,
        srs,
        completedLessons,
        xp: s.xp + action.xp,
        xpToday: s.xpToday + action.xp,
        gems: s.gems + 5,
      }
    }
    case 'REVIEW_CARD': {
      const card = state.srs[action.word]
      if (!card) return state
      return { ...state, srs: { ...state.srs, [action.word]: reviewCard(card, action.quality) } }
    }
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode }
    case 'TICK': {
      // recarga de corazones por tiempo
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
