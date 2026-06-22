import { useGame } from './context/GameContext'

// Sistema de traducción ligero. Añade más claves/idiomas fácilmente.
export type Lang = 'es' | 'en'

type Dict = Record<string, { es: string; en: string }>

export const STRINGS: Dict = {
  // Navegación
  nav_learn: { es: 'Aprender', en: 'Learn' },
  nav_tutor: { es: 'Tutor', en: 'Tutor' },
  nav_review: { es: 'Repasar', en: 'Review' },
  nav_stories: { es: 'Historias', en: 'Stories' },
  nav_leagues: { es: 'Ligas', en: 'Leagues' },
  nav_profile: { es: 'Perfil', en: 'Profile' },
  // Top bar
  premium: { es: 'Premium', en: 'Premium' },
  store: { es: 'Tienda', en: 'Store' },
  back: { es: '← Volver', en: '← Back' },
  // Común
  continue: { es: 'CONTINUAR', en: 'CONTINUE' },
  // Perfil
  daily_goal: { es: 'Meta diaria', en: 'Daily goal' },
  goal_done: { es: '¡Meta cumplida hoy! 🎉', en: 'Goal completed today! 🎉' },
  stat_streak: { es: 'Días de racha', en: 'Day streak' },
  stat_total_xp: { es: 'XP total', en: 'Total XP' },
  stat_week_xp: { es: 'XP semanal', en: 'Weekly XP' },
  stat_gems: { es: 'Gemas', en: 'Gems' },
  stat_lessons: { es: 'Lecciones', en: 'Lessons' },
  stat_mastered: { es: 'Palabras dominadas', en: 'Words mastered' },
  stat_learning: { es: 'Aprendiendo', en: 'Learning' },
  stat_stories: { es: 'Historias', en: 'Stories' },
  become_premium: { es: 'Hazte Premium', en: 'Go Premium' },
  manage_premium: { es: 'Gestionar Premium', en: 'Manage Premium' },
  premium_perk: {
    es: 'Tutor IA ilimitado, vidas infinitas y sin anuncios',
    en: 'Unlimited AI tutor, infinite lives and no ads',
  },
  dark_mode: { es: 'Modo oscuro', en: 'Dark mode' },
  daily_reminder: { es: 'Recordatorio diario', en: 'Daily reminder' },
  reminder_time: { es: 'Hora del recordatorio', en: 'Reminder time' },
  reset_progress: { es: 'Reiniciar progreso', en: 'Reset progress' },
  language: { es: 'Idioma', en: 'Language' },
  grammar: { es: 'Gramática', en: 'Grammar' },
  streak_calendar: { es: 'Calendario de racha', en: 'Streak calendar' },
  // Tienda
  your_balance: { es: 'Tu saldo', en: 'Your balance' },
  redeem_gems: { es: '🛒 Canjea tus gemas', en: '🛒 Redeem your gems' },
  get_more_gems: { es: '💳 Consigue más gemas', en: '💳 Get more gems' },
  refill_lives: { es: 'Recargar vidas', en: 'Refill lives' },
  streak_freeze: { es: 'Protector de racha', en: 'Streak freeze' },
}

export function useT() {
  const { state } = useGame()
  const lang = state.uiLang || 'es'
  return (key: keyof typeof STRINGS): string => STRINGS[key]?.[lang] ?? String(key)
}
