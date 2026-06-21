# 🦊 LinguaFox — Aprende Inglés

App estilo Duolingo para aprender inglés, construida como **PWA** (Progressive Web App) con React + Vite + TypeScript. Se puede usar en el navegador, instalar como app en el móvil y **convertir a un `.apk` real**.

## ✨ Características

- 🎮 **Gamificación**: XP, racha diaria 🔥, vidas ❤️, gemas 💎, meta diaria.
- 📚 **Lecciones por unidades** (niveles A1–A2) con un mapa de progreso.
- 🧩 **6 tipos de ejercicio**: opción múltiple, traducción con banco de palabras, listening, emparejar, completar el hueco y **pronunciación con micrófono**.
- 🔁 **Repetición espaciada (SRS)** con el algoritmo SuperMemo-2 para repasar vocabulario.
- 🔊 **Texto a voz** (escucha la pronunciación nativa) y 🎤 **reconocimiento de voz**.
- 🌙 **Modo oscuro** y diseño responsive mobile-first.
- 💾 **Progreso guardado** en el dispositivo (localStorage). Funciona offline.

## 🚀 Cómo ejecutar

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # compilar para producción (carpeta dist/)
npm run preview  # previsualizar el build
```

> Nota: si `node` falla por la variable `NODE_OPTIONS`, ejecútalo así: `NODE_OPTIONS= npm run dev`.

## 📱 Cómo convertir a APK

La forma más fácil (sin Android Studio):

1. Sube la carpeta `dist/` a un hosting gratuito (Netlify, Vercel o GitHub Pages). Necesitas una URL **https**.
2. Entra en **[pwabuilder.com](https://www.pwabuilder.com)** y pega tu URL.
3. Pulsa **Package for stores → Android** y descarga el `.apk` / `.aab` firmado.
4. Instala el `.apk` en tu Android o súbelo a Google Play.

Alternativa con [Capacitor](https://capacitorjs.com) (requiere Android Studio):

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init LinguaFox com.linguafox.app --web-dir=dist
npx cap add android
npm run build && npx cap sync
npx cap open android   # compila el APK desde Android Studio
```

## 🗂️ Estructura

```
src/
  data/lessons.ts      # contenido de lecciones (fácil de ampliar)
  context/GameContext  # estado del juego (XP, racha, vidas, SRS)
  hooks/useSpeech.ts   # texto-a-voz y reconocimiento de voz
  srs.ts               # algoritmo de repetición espaciada (SM-2)
  screens/             # Onboarding, Home, Lesson, Practice, Profile
  types.ts             # tipos TypeScript
```

## ➕ Añadir contenido

Edita `src/data/lessons.ts` y agrega unidades, lecciones, vocabulario y ejercicios. La estructura está tipada para evitar errores.
