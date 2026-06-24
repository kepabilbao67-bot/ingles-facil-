import type { PlayerState } from '../types'

export interface Achievement {
  id: string
  icon: string
  title: string
  description: string
  check: (state: PlayerState) => boolean
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    icon: '🎓',
    title: 'Primera Lección',
    description: 'Completa tu primera lección',
    check: (s) => s.completedLessons.length >= 1,
  },
  {
    id: 'five_lessons',
    icon: '📚',
    title: 'Estudiante Dedicado',
    description: 'Completa 5 lecciones',
    check: (s) => s.completedLessons.length >= 5,
  },
  {
    id: 'ten_lessons',
    icon: '🏆',
    title: 'Maestro del Estudio',
    description: 'Completa 10 lecciones',
    check: (s) => s.completedLessons.length >= 10,
  },
  {
    id: 'all_lessons',
    icon: '👑',
    title: 'Rey del Inglés',
    description: 'Completa todas las lecciones',
    check: (s) => s.completedLessons.length >= 14,
  },
  {
    id: 'streak_3',
    icon: '🔥',
    title: 'En Racha',
    description: 'Consigue una racha de 3 días',
    check: (s) => s.streak >= 3,
  },
  {
    id: 'streak_7',
    icon: '⚡',
    title: 'Semana Perfecta',
    description: 'Consigue una racha de 7 días',
    check: (s) => s.streak >= 7,
  },
  {
    id: 'streak_30',
    icon: '💪',
    title: 'Imparable',
    description: 'Consigue una racha de 30 días',
    check: (s) => s.streak >= 30,
  },
  {
    id: 'xp_100',
    icon: '⭐',
    title: 'Centenario',
    description: 'Consigue 100 XP en total',
    check: (s) => s.xp >= 100,
  },
  {
    id: 'xp_500',
    icon: '🌟',
    title: 'Superestrella',
    description: 'Consigue 500 XP en total',
    check: (s) => s.xp >= 500,
  },
  {
    id: 'xp_1000',
    icon: '💫',
    title: 'Leyenda',
    description: 'Consigue 1000 XP en total',
    check: (s) => s.xp >= 1000,
  },
  {
    id: 'vocab_20',
    icon: '📖',
    title: 'Coleccionista',
    description: 'Aprende 20 palabras',
    check: (s) => Object.keys(s.srs).length >= 20,
  },
  {
    id: 'vocab_50',
    icon: '🧠',
    title: 'Enciclopedia Andante',
    description: 'Aprende 50 palabras',
    check: (s) => Object.keys(s.srs).length >= 50,
  },
  {
    id: 'daily_goal',
    icon: '🎯',
    title: 'Meta Cumplida',
    description: 'Cumple tu meta diaria por primera vez',
    check: (s) => s.xpToday >= s.dailyGoal,
  },
  {
    id: 'gems_200',
    icon: '💎',
    title: 'Rico',
    description: 'Acumula 200 gemas',
    check: (s) => s.gems >= 200,
  },
  {
    id: 'night_owl',
    icon: '🦉',
    title: 'Búho Nocturno',
    description: 'Practica (ten una racha activa)',
    check: (s) => s.streak >= 1,
  },
  {
    id: 'challenge_complete',
    icon: '🏅',
    title: 'Retador',
    description: 'Completa un reto diario',
    check: (s) => (s as any).challengesCompleted >= 1,
  },
]

export function getUnlockedAchievements(state: PlayerState): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.check(state))
}

export function getLockedAchievements(state: PlayerState): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !a.check(state))
}
