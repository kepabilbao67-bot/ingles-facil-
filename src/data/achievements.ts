import type { PlayerState } from '../types'
import { masteryLevel } from '../srs'

export interface Achievement {
  id: string
  icon: string
  title: string
  desc: string
  // progreso actual y objetivo para la barra
  progress: (s: PlayerState) => number
  goal: number
}

function masteredCount(s: PlayerState) {
  return Object.values(s.srs).filter((c) => masteryLevel(c) === 'mastered').length
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    icon: '🎯',
    title: 'Primer paso',
    desc: 'Completa tu primera lección',
    progress: (s) => s.completedLessons.length,
    goal: 1,
  },
  {
    id: 'streak_3',
    icon: '🔥',
    title: 'En racha',
    desc: 'Mantén una racha de 3 días',
    progress: (s) => s.streak,
    goal: 3,
  },
  {
    id: 'streak_7',
    icon: '🔥',
    title: 'Imparable',
    desc: 'Mantén una racha de 7 días',
    progress: (s) => s.streak,
    goal: 7,
  },
  {
    id: 'streak_30',
    icon: '🏆',
    title: 'Leyenda',
    desc: 'Mantén una racha de 30 días',
    progress: (s) => s.streak,
    goal: 30,
  },
  {
    id: 'xp_100',
    icon: '⭐',
    title: 'Centena',
    desc: 'Consigue 100 XP en total',
    progress: (s) => s.xp,
    goal: 100,
  },
  {
    id: 'xp_500',
    icon: '🌟',
    title: 'Estrella',
    desc: 'Consigue 500 XP en total',
    progress: (s) => s.xp,
    goal: 500,
  },
  {
    id: 'lessons_5',
    icon: '📚',
    title: 'Estudioso',
    desc: 'Completa 5 lecciones',
    progress: (s) => s.completedLessons.length,
    goal: 5,
  },
  {
    id: 'lessons_10',
    icon: '🎓',
    title: 'Aplicado',
    desc: 'Completa 10 lecciones',
    progress: (s) => s.completedLessons.length,
    goal: 10,
  },
  {
    id: 'words_10',
    icon: '🧠',
    title: 'Memorión',
    desc: 'Domina 10 palabras',
    progress: (s) => masteredCount(s),
    goal: 10,
  },
  {
    id: 'words_50',
    icon: '🦉',
    title: 'Vocabulario top',
    desc: 'Domina 50 palabras',
    progress: (s) => masteredCount(s),
    goal: 50,
  },
  {
    id: 'stories_3',
    icon: '📖',
    title: 'Lector',
    desc: 'Lee 3 historias',
    progress: (s) => s.readStories.length,
    goal: 3,
  },
  {
    id: 'premium',
    icon: '👑',
    title: 'Miembro VIP',
    desc: 'Hazte Premium',
    progress: (s) => (s.isPremium ? 1 : 0),
    goal: 1,
  },
]

export function isUnlocked(a: Achievement, s: PlayerState): boolean {
  return a.progress(s) >= a.goal
}

export function unlockedCount(s: PlayerState): number {
  return ACHIEVEMENTS.filter((a) => isUnlocked(a, s)).length
}
