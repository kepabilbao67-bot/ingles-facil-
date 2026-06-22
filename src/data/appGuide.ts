// Descripción central de TODO lo que se puede hacer en la app.
// Se usa tanto en la guía visual como en el contexto del asistente de IA.

export interface GuideFeature {
  icon: string
  title: string
  desc: string
}

export const GUIDE_FEATURES: GuideFeature[] = [
  {
    icon: '🏠',
    title: 'Aprender (lecciones)',
    desc: 'Sigue el camino de unidades (A1 → C1). Cada lección tiene una nota de gramática y ejercicios variados: opción múltiple, traducir, escuchar, emparejar, completar huecos y hablar.',
  },
  {
    icon: '🤖',
    title: 'Tutor de IA',
    desc: 'Conversa en inglés con un tutor inteligente por escenarios (restaurante, aeropuerto, entrevista...). Te corrige, te traduce y te lee las respuestas en voz alta.',
  },
  {
    icon: '🔁',
    title: 'Repasar (memoria)',
    desc: 'Repaso con repetición espaciada: la app te muestra el vocabulario justo cuando estás a punto de olvidarlo, para que no se te olvide nunca.',
  },
  {
    icon: '📖',
    title: 'Historias',
    desc: 'Lee y escucha diálogos reales graduados por nivel y responde preguntas de comprensión para ganar XP.',
  },
  {
    icon: '🏆',
    title: 'Ligas',
    desc: 'Compite cada semana en una liga. Gana XP para subir de puesto y ascender de Bronce hasta Diamante.',
  },
  {
    icon: '🔥',
    title: 'Racha y calendario',
    desc: 'Practica cada día para mantener tu racha. El calendario marca tus días activos. Puedes proteger tu racha con un "protector" de la tienda.',
  },
  {
    icon: '🏅',
    title: 'Logros',
    desc: 'Desbloquea insignias por tus avances: rachas, XP, lecciones, vocabulario dominado y más.',
  },
  {
    icon: '🛒',
    title: 'Tienda',
    desc: 'Toca tus gemas 💎 arriba para abrir la tienda. Canjea gemas por vidas o protectores de racha, o consigue más gemas.',
  },
  {
    icon: '📘',
    title: 'Gramática',
    desc: 'En tu Perfil tienes una sección que reúne todas las reglas de gramática con ejemplos y audio para repasar.',
  },
  {
    icon: '👑',
    title: 'Premium',
    desc: 'Hazte Premium para tutor de IA ilimitado, vidas infinitas y sin anuncios.',
  },
  {
    icon: '🔔',
    title: 'Recordatorios e idioma',
    desc: 'En el Perfil puedes activar un recordatorio diario a la hora que elijas y cambiar el idioma de la app (ES/EN).',
  },
]

// Resumen en texto para el system prompt del asistente de IA.
export const APP_SUMMARY = GUIDE_FEATURES.map((f) => `- ${f.title}: ${f.desc}`).join('\n')
