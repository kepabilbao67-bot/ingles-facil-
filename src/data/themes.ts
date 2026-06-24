export interface Theme {
  id: string
  name: string
  icon: string
  colors: {
    green: string
    greenDark: string
    greenShadow: string
    blue: string
    red: string
    orange: string
    yellow: string
  }
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Clásico',
    icon: '🟢',
    colors: {
      green: '#58cc02',
      greenDark: '#4caf00',
      greenShadow: '#58a700',
      blue: '#1cb0f6',
      red: '#ff4b4b',
      orange: '#ff9600',
      yellow: '#ffc800',
    },
  },
  {
    id: 'ocean',
    name: 'Océano',
    icon: '🌊',
    colors: {
      green: '#0984e3',
      greenDark: '#0652DD',
      greenShadow: '#0652DD',
      blue: '#00cec9',
      red: '#d63031',
      orange: '#e17055',
      yellow: '#fdcb6e',
    },
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    icon: '🌅',
    colors: {
      green: '#e17055',
      greenDark: '#c0392b',
      greenShadow: '#c0392b',
      blue: '#fd79a8',
      red: '#d63031',
      orange: '#f39c12',
      yellow: '#ffeaa7',
    },
  },
  {
    id: 'forest',
    name: 'Bosque',
    icon: '🌲',
    colors: {
      green: '#00b894',
      greenDark: '#009975',
      greenShadow: '#009975',
      blue: '#55efc4',
      red: '#ff7675',
      orange: '#fab1a0',
      yellow: '#ffeaa7',
    },
  },
  {
    id: 'galaxy',
    name: 'Galaxia',
    icon: '🌌',
    colors: {
      green: '#a29bfe',
      greenDark: '#6c5ce7',
      greenShadow: '#6c5ce7',
      blue: '#74b9ff',
      red: '#ff7675',
      orange: '#fd79a8',
      yellow: '#ffeaa7',
    },
  },
  {
    id: 'candy',
    name: 'Caramelo',
    icon: '🍬',
    colors: {
      green: '#e84393',
      greenDark: '#c44569',
      greenShadow: '#c44569',
      blue: '#a29bfe',
      red: '#ff4757',
      orange: '#ff6b81',
      yellow: '#ffa502',
    },
  },
]

export function applyTheme(themeId: string) {
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0]
  const root = document.documentElement
  root.style.setProperty('--green', theme.colors.green)
  root.style.setProperty('--green-dark', theme.colors.greenDark)
  root.style.setProperty('--green-shadow', theme.colors.greenShadow)
  root.style.setProperty('--blue', theme.colors.blue)
  root.style.setProperty('--red', theme.colors.red)
  root.style.setProperty('--orange', theme.colors.orange)
  root.style.setProperty('--yellow', theme.colors.yellow)
}
