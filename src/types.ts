// ---- Tipos centrales de LinguaFox ----

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export type ExerciseType =
  | 'multipleChoice' // elegir traduccion correcta
  | 'translate' // construir frase con banco de palabras
  | 'listen' // escuchar audio y elegir
  | 'match' // emparejar palabras
  | 'speak' // practica de pronunciacion
  | 'fillBlank' // completar el hueco

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

export type Exercise =
  | MultipleChoiceExercise
  | TranslateExercise
  | ListenExercise
  | MatchExercise
  | SpeakExercise
  | FillBlankExercise

export interface VocabItem {
  en: string
  es: string
  ipa?: string
}

export interface GrammarTip {
  title: string // titulo en espanol
  explanation: string // explicacion en espanol
  examples: { en: string; es: string }[]
}

export interface Lesson {
  id: string
  unitId: string
  title: string
  icon: string
  vocab: VocabItem[]
  exercises: Exercise[]
  grammarTip?: GrammarTip // nota de gramatica opcional (se muestra al inicio)
}

// ---- Historias / Lectura ----
export interface StoryLine {
  speaker?: string // nombre del personaje (opcional)
  en: string
  es: string
}

export interface StoryQuestion {
  question: string // pregunta en espanol
  options: string[]
  answer: string
}

export interface Story {
  id: string
  level: CEFRLevel
  title: string
  emoji: string
  summary: string // resumen en espanol
  lines: StoryLine[]
  questions: StoryQuestion[]
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
  readStories: string[]
  srs: Record<string, SRSCard>
  darkMode: boolean
  onboarded: boolean
  // XP semanal para la liga (se reinicia cada lunes)
  weeklyXp: number
  weekKey: string | null // identificador de la semana (YYYY-Www)
  // ---- Monetizacion / Premium ----
  isPremium: boolean
  // ---- Tutor de IA (Claude) ----
  claudeApiKey: string
  claudeModel: string
  tutorMessagesToday: number
  tutorMessagesDate: string | null
  // ---- Recordatorios / notificaciones ----
  reminderEnabled: boolean
  reminderTime: string // "HH:MM"
  lastReminderDate: string | null
  // ---- Tienda ----
  streakFreezes: number // protectores de racha disponibles
}
