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

Hay **dos modos**:

**A) Modo demo (rápido):** el usuario pega su propia clave de Claude en la app.
1. Consigue una clave en [console.anthropic.com](https://console.anthropic.com).
2. En la app, pestaña **Tutor 🤖** → introduce tu clave (se guarda solo en tu dispositivo).

**B) Modo producción (recomendado para vender):** un backend oculta la clave.
1. Despliega el proyecto en **Vercel** (incluye las funciones de la carpeta `api/`).
2. En Vercel añade la variable de entorno `ANTHROPIC_API_KEY` (tu clave de Claude).
3. Añade la variable del cliente `VITE_API_BASE` con la URL de tu despliegue (ej. `https://tu-app.vercel.app`) y vuelve a desplegar.
4. Listo: el tutor llamará a `/api/tutor` y **la clave nunca sale del servidor**.

## 💰 Cobrar de verdad con Stripe

La carpeta `api/` ya incluye `create-checkout-session.js`. Para activarlo:
1. Crea una cuenta en [stripe.com](https://stripe.com) y dos productos/precios de suscripción (mensual y anual).
2. En Vercel añade: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_YEARLY`.
3. Con `VITE_API_BASE` definido, el botón de Premium abrirá el **checkout real de Stripe** con prueba de 7 días.
4. Al volver del pago (`?premium=success`) la app activa Premium automáticamente.

> Para la versión **APK / Play Store**, en lugar de Stripe usa **Google Play Billing** o **RevenueCat** (obligatorio para suscripciones dentro de apps Android).

Variables de entorno: ver `.env.example`.



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
