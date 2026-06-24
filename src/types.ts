// ---- Tipos centrales de LinguaFox ----

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type ExerciseType =
  | 'multipleChoice' // elegir traduccion correcta
  | 'translate' // construir frase con banco de palabras
  | 'listen' // escuchar audio y elegir
  | 'match' // emparejar palabras
  | 'speak' // practica de pronunciacion
  | 'fillBlank' // completar el hueco
  | 'dictation' // escribir lo que oyes

export interface BaseExercise {
  id: string
  type: ExerciseType
  prompt: string // instruccion en espanol
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multipleChoice'
  question: string // texto a traducir (en o es)
  audioText?: string // texto en ingles para TTS
  options: string[]
  answer: string
}

export interface TranslateExercise extends BaseExercise {
  type: 'translate'
  sourceText: string // frase en espanol
  audioText: string // frase en ingles (solucion)
  wordBank: string[]
  answerWords: string[] // orden correcto
}

export interface ListenExercise extends BaseExercise {
  type: 'listen'
  audioText: string // ingles que se reproduce
  options: string[]
  answer: string
}

export interface MatchExercise extends BaseExercise {
  type: 'match'
  pairs: { en: string; es: string }[]
}

export interface SpeakExercise extends BaseExercise {
  type: 'speak'
  audioText: string // frase en ingles a pronunciar
  translation: string
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fillBlank'
  sentence: string // usa ___ como hueco
  audioText: string
  options: string[]
  answer: string
  translation: string
}

export interface DictationExercise extends BaseExercise {
  type: 'dictation'
  audioText: string // texto en ingles que se reproduce
  answer: string // respuesta correcta (lo que deben escribir)
  translation: string // traduccion al español
}

export type Exercise =
  | MultipleChoiceExercise
  | TranslateExercise
  | ListenExercise
  | MatchExercise
  | SpeakExercise
  | FillBlankExercise
  | DictationExercise

export interface VocabItem {
  en: string
  es: string
  ipa?: string
}

export interface Lesson {
  id: string
  unitId: string
  title: string
  icon: string
  vocab: VocabItem[]
  exercises: Exercise[]
}

export interface Unit {
  id: string
  level: CEFRLevel
  title: string
  description: string
  color: string
  lessons: Lesson[]
}

// ---- Estado del jugador ----

export interface SRSCard {
  en: string
  es: string
  ipa?: string
  // SuperMemo-2 (SM-2)
  repetitions: number
  interval: number // en dias
  easeFactor: number
  dueDate: number // timestamp
  lastReviewed: number
}

export interface PlayerState {
  name: string
  level: CEFRLevel
  xp: number
  gems: number
  hearts: number
  heartsRefillAt: number | null
  streak: number
  lastActiveDay: string | null // YYYY-MM-DD
  dailyGoal: number
  xpToday: number
  xpTodayDate: string | null
  completedLessons: string[]
  srs: Record<string, SRSCard>
  darkMode: boolean
  onboarded: boolean
  // New fields
  avatar: string // emoji avatar
  playerLevel: number // 1-50
  xpHistory: Record<string, number> // YYYY-MM-DD -> XP earned that day
  challengesCompleted: number
  lastChallengeDate: string | null // YYYY-MM-DD
  soundEnabled: boolean
  unlockedAchievements: string[] // achievement IDs
  theme: string // theme ID
}
