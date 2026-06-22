# 🦊 LinguaFox — Aprende Inglés

App estilo Duolingo para aprender inglés, construida como **PWA** (Progressive Web App) con React + Vite + TypeScript. Se puede usar en el navegador, instalar como app en el móvil y **convertir a un `.apk` real**.

## ✨ Características

- 🤖 **Tutor de IA conversacional (Claude)**: chat por escenarios (restaurante, aeropuerto, entrevista, compras, charla libre) con correcciones y traducción.
- 👑 **Modelo Premium (freemium)**: app lista para vender. Tutor IA ilimitado, vidas infinitas, sin anuncios. Planes mensual/anual con prueba gratis.
- 🎮 **Gamificación**: XP, racha diaria 🔥, vidas ❤️, gemas 💎, meta diaria.
- 🏆 **Ligas semanales** con ranking y ascensos.
- 📚 **Lecciones por unidades** (A1, A2, B1, B2) con mapa de progreso y notas de gramática.
- 🧩 **6 tipos de ejercicio**: opción múltiple, traducción con banco de palabras, listening, emparejar, completar el hueco y **pronunciación con micrófono**.
- 📖 **Historias / Lectura** graduadas por nivel con preguntas de comprensión.
- 🔁 **Repetición espaciada (SRS)** con el algoritmo SuperMemo-2 para repasar vocabulario.
- 🔊 **Texto a voz** y 🎤 **reconocimiento de voz**.
- 🌙 **Modo oscuro** y diseño responsive mobile-first.
- 💾 **Progreso guardado** en el dispositivo (localStorage). Funciona offline.

## 🤖 Configurar el Tutor de IA (Claude)

1. Consigue una clave de API en [console.anthropic.com](https://console.anthropic.com).
2. En la app, ve a la pestaña **Tutor 🤖** e introduce tu clave (se guarda solo en tu dispositivo).
3. Elige un escenario y empieza a chatear en inglés.

> ⚠️ **Para producción / app a la venta:** no expongas la clave en el cliente. Crea un pequeño backend (serverless) que reciba los mensajes y llame a Claude con la clave guardada en el servidor. El cliente actual usa el header `anthropic-dangerous-direct-browser-access` solo para el MVP/demo.

## 💰 Monetización (vender la app)

La app ya incluye el sistema **freemium** completo (UI de planes, muro de pago, ventajas Premium y límites para usuarios gratis). Para **cobrar de verdad** integra una pasarela en `src/screens/Premium.tsx` (función `purchase`):

- **Web/PWA:** [Stripe Checkout](https://stripe.com) o Stripe Payment Links.
- **Android (APK/Play Store):** [Google Play Billing](https://developer.android.com/google/play/billing) o [RevenueCat](https://www.revenuecat.com) (más fácil, multiplataforma).

Otras vías de ingreso: anuncios para usuarios gratis (AdMob), packs de gemas, y contenido premium.


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
