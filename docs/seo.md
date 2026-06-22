# 🔎 SEO, ASO y GEO de LinguaFox

Guía rápida para que la app se posicione en Google, en las tiendas y en los buscadores de IA.

## ✅ Ya incluido en el proyecto
- **Logo propio** (zorro) en `assets/logo.svg` → genera iconos con `npm run icons`.
- **Meta-etiquetas SEO** en `index.html`: título, descripción, keywords, canonical.
- **Open Graph + Twitter Card**: para que se vea bonito al compartir en WhatsApp, X, Facebook, etc.
- **Datos estructurados (JSON-LD)** tipo `MobileApplication` → ayuda a Google y a los motores de IA (GEO) a entender qué es la app.
- **robots.txt** y **sitemap.xml** en `public/`.

## ⚙️ Qué cambiar al desplegar
1. Sustituye `https://linguafox.app/` por tu dominio real en `index.html`, `robots.txt` y `sitemap.xml`.
2. Genera una imagen social (1200×630) y enlázala en `og:image` / `twitter:image` (puedes usar `icon-512.png` mientras tanto).

## 🌐 SEO web (Google)
- Da de alta el sitio en [Google Search Console](https://search.google.com/search-console) y envía el `sitemap.xml`.
- Escribe contenido (blog) con palabras clave: "cómo aprender inglés", "phrasal verbs", etc.
- Consigue enlaces (backlinks) desde redes y foros.

## 📲 ASO (App Store / Google Play)
- Usa los textos de `docs/google-play-listing.md`.
- Palabras clave en el título y la descripción corta.
- Buenas capturas + vídeo aumentan mucho la conversión.

## 🤖 GEO (Generative Engine Optimization)
Optimización para que te citen ChatGPT, Gemini, Perplexity, etc.:
- Mantén los **datos estructurados JSON-LD** actualizados (ya incluidos).
- Crea una página "Acerca de" con preguntas y respuestas claras (FAQ) que las IA puedan citar.
- Consigue menciones en sitios con autoridad (reseñas, listados de apps).
- Texto claro y factual: qué es, para quién, qué la hace única.
