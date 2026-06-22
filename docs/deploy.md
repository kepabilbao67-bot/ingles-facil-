# 🚀 Desplegar LinguaFox en Vercel (paso a paso)

Tiempo estimado: ~10 minutos. Todo gratis.

## Paso 1 — Crear cuenta en Vercel
1. Entra en [vercel.com](https://vercel.com).
2. Pulsa **Sign Up** y elige **Continuar con GitHub** (usa la misma cuenta donde está el repo).

## Paso 2 — Importar el proyecto
1. En Vercel, pulsa **Add New… → Project**.
2. Busca el repositorio **`ingles-facil-`** y pulsa **Import**.
3. Vercel detectará que es **Vite** automáticamente. No cambies nada:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Pulsa **Deploy** y espera 1-2 minutos. ¡Ya tienes tu URL en vivo! (algo como `https://ingles-facil.vercel.app`).

> Con esto la app ya funciona. El tutor de IA funcionará en "modo demo" (cada usuario pega su clave). Para el modo seguro, sigue el Paso 3.

## Paso 3 — (Opcional) Activar el tutor de IA seguro
1. En tu proyecto de Vercel: **Settings → Environment Variables**.
2. Añade:
   - `ANTHROPIC_API_KEY` = tu clave de [console.anthropic.com](https://console.anthropic.com)
   - `VITE_API_BASE` = la URL de tu app (ej. `https://ingles-facil.vercel.app`)
3. Ve a **Deployments → … → Redeploy** para aplicar los cambios.

## Paso 4 — (Opcional) Cobrar con Stripe
1. Crea cuenta en [stripe.com](https://stripe.com) y dos precios de suscripción (mensual y anual).
2. En Vercel añade estas variables y vuelve a desplegar:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_MONTHLY`
   - `STRIPE_PRICE_YEARLY`

## Paso 5 — Generar el APK
1. Entra en [pwabuilder.com](https://www.pwabuilder.com).
2. Pega tu URL de Vercel y pulsa **Start**.
3. Pulsa **Package for stores → Android** y descarga el `.apk` / `.aab`.
4. Instálalo en tu móvil o súbelo a Google Play (usa los textos de `docs/google-play-listing.md`).

## Actualizaciones automáticas
Cada vez que se haga un cambio en la rama `main` de GitHub, Vercel **redepliega solo**. No tienes que hacer nada más. 🎉
