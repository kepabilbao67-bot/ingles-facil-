import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { CEFRLevel, PlayerState, VocabItem } from '../types'
import { createCard, reviewCard } from '../srs'

const STORAGE_KEY = 'linguafox_state_v1'
const MAX_HEARTS = 5
const HEART_REFILL_MS = 30 * 60 * 1000 // 30 min por corazon

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function weekKeyStr(d = new Date()): string {
  // ISO week: YYYY-Www
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = (date.getUTCDay() + 6) % 7
  date.setUTCDate(date.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4))
  const week =
    1 + Math.round(((date.getTime() - firstThursday.getTime()) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7)
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
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
    readStories: [],
    srs: {},
    darkMode: false,
    onboarded: false,
    weeklyXp: 0,
    weekKey: weekKeyStr(),
    isPremium: false,
    claudeApiKey: '',
    claudeModel: 'claude-3-5-sonnet-latest',
    tutorMessagesToday: 0,
    tutorMessagesDate: todayStr(),
    reminderEnabled: false,
    reminderTime: '19:00',
    lastReminderDate: null,
    streakFreezes: 0,
    uiLang: 'es',
    activeDays: [],
  }
}

function loadState(): PlayerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = { ...defaultState(), ...JSON.parse(raw) } as PlayerState
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
  | { type: 'COMPLETE_STORY'; storyId: string; xp: number }
  | { type: 'REVIEW_CARD'; word: string; quality: number }
  | { type: 'TOGGLE_DARK' }
  | { type: 'GO_PREMIUM' }
  | { type: 'CANCEL_PREMIUM' }
  | { type: 'SET_API_KEY'; key: string }
  | { type: 'SET_MODEL'; model: string }
  | { type: 'USE_TUTOR_MESSAGE' }
  | { type: 'SET_REMINDER'; enabled: boolean; time?: string }
  | { type: 'MARK_REMINDED' }
  | { type: 'BUY_GEMS'; amount: number }
  | { type: 'BUY_STREAK_FREEZE' }
  | { type: 'SET_LANG'; lang: 'es' | 'en' }
  | { type: 'TICK' }
  | { type: 'RESET' }

// Limite de mensajes diarios del tutor para usuarios gratuitos
export const FREE_TUTOR_LIMIT = 5

function rolloverDaily(state: PlayerState): PlayerState {
  const today = todayStr()
  let s = state
  if (s.xpTodayDate !== today) {
    s = { ...s, xpToday: 0, xpTodayDate: today }
  }
  const wk = weekKeyStr()
  if (s.weekKey !== wk) {
    s = { ...s, weeklyXp: 0, weekKey: wk }
  }
  return s
}

// Aplica XP a los acumuladores total, diario y semanal
function applyXp(state: PlayerState, amount: number): PlayerState {
  const s = rolloverDaily(state)
  return {
    ...s,
    xp: s.xp + amount,
    xpToday: s.xpToday + amount,
    weeklyXp: s.weeklyXp + amount,
  }
}

function updateStreak(state: PlayerState): PlayerState {
  const today = todayStr()
  const withDay = (s: PlayerState): PlayerState =>
    s.activeDays.includes(today) ? s : { ...s, activeDays: [...s.activeDays, today] }

  if (state.lastActiveDay === today) return withDay(state)
  if (!state.lastActiveDay) {
    return withDay({ ...state, streak: 1, lastActiveDay: today })
  }
  const diffDays = Math.round(
    (new Date(today).getTime() - new Date(state.lastActiveDay).getTime()) / 86400000
  )
  if (diffDays === 1) {
    return withDay({ ...state, streak: state.streak + 1, lastActiveDay: today })
  }
  if (diffDays === 2 && state.streakFreezes > 0) {
    return withDay({
      ...state,
      streak: state.streak + 1,
      lastActiveDay: today,
      streakFreezes: state.streakFreezes - 1,
    })
  }
  return withDay({ ...state, streak: 1, lastActiveDay: today })
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
      return applyXp(state, action.amount)
    }
    case 'LOSE_HEART': {
      if (state.isPremium) return state // Premium: vidas ilimitadas
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
      s = applyXp(s, action.xp)
      return {
        ...s,
        srs,
        completedLessons,
        gems: s.gems + 5,
      }
    }
    case 'COMPLETE_STORY': {
      let s = rolloverDaily(state)
      s = updateStreak(s)
      const readStories = s.readStories.includes(action.storyId)
        ? s.readStories
        : [...s.readStories, action.storyId]
      s = applyXp(s, action.xp)
      return { ...s, readStories, gems: s.gems + 3 }
    }
    case 'REVIEW_CARD': {
      const card = state.srs[action.word]
      if (!card) return state
      return { ...state, srs: { ...state.srs, [action.word]: reviewCard(card, action.quality) } }
    }
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode }
    case 'GO_PREMIUM':
      return { ...state, isPremium: true, hearts: MAX_HEARTS, heartsRefillAt: null }
    case 'CANCEL_PREMIUM':
      return { ...state, isPremium: false }
    case 'SET_API_KEY':
      return { ...state, claudeApiKey: action.key }
    case 'SET_MODEL':
      return { ...state, claudeModel: action.model }
    case 'USE_TUTOR_MESSAGE': {
      const today = todayStr()
      if (state.tutorMessagesDate !== today) {
        return { ...state, tutorMessagesDate: today, tutorMessagesToday: 1 }
      }
      return { ...state, tutorMessagesToday: state.tutorMessagesToday + 1 }
    }
    case 'SET_REMINDER':
      return {
        ...state,
        reminderEnabled: action.enabled,
        reminderTime: action.time ?? state.reminderTime,
      }
    case 'MARK_REMINDED':
      return { ...state, lastReminderDate: todayStr() }
    case 'BUY_GEMS':
      return { ...state, gems: state.gems + action.amount }
    case 'BUY_STREAK_FREEZE': {
      const COST = 200
      if (state.gems < COST || state.streakFreezes >= 3) return state
      return { ...state, gems: state.gems - COST, streakFreezes: state.streakFreezes + 1 }
    }
    case 'SET_LANG':
      return { ...state, uiLang: action.lang }
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
