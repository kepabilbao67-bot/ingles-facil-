# LinguaFox — ficha de tienda (borrador V1)

## Identidad

- Nombre: LinguaFox
- Subtítulo Apple: Aprende practicando
- Descripción breve Google Play: Aprende 5 idiomas con lecciones, audio, quizzes y progreso local.
- Categoría propuesta: Educación
- Modelo de lanzamiento: gratuito, sin compras ni anuncios en la V1

## Descripción

LinguaFox te ayuda a practicar inglés, francés, italiano, alemán y portugués con lecciones breves, audio, quizzes y progreso.

Cada idioma incluye 8 lecciones y 48 términos esenciales organizados por situaciones reales: saludos, vida cotidiana, viajes, familia, comida, ciudad, tiempo, estudio y trabajo.

Avanza paso a paso y aprende vocabulario útil para situaciones cotidianas y viajes. En el curso de inglés también puedes practicar con Fox: el tutor local funciona sin conexión externa y ofrece correcciones sencillas y sugerencias para continuar hablando.

El progreso, las preferencias y el historial se guardan localmente en tu dispositivo.

## Material disponible

- Icono principal: `assets/images/linguafox-icon-v2.png` (1024 × 1024)
- Icono iOS opaco: `assets/images/linguafox-ios-icon-1024.png` (1024 × 1024, RGB sin alfa)
- Icono Google Play: `assets/images/linguafox-play-icon-512.png` (512 × 512)
- Feature graphic: `store-assets/feature-graphic.png` (1024 × 500)

## Capturas reales pendientes

1. Inicio, racha y progreso.
2. Selección de idioma.
3. Lección.
4. Quiz y resultado.
5. Conversación local con Fox.
6. Privacidad y datos.

No anunciar reconocimiento de voz, conversación por voz, cursos avanzados, suscripción o tutor externo hasta que esas funciones estén terminadas y verificadas.

## Datos y privacidad — borrador para verificación

- Sin cuenta.
- Sin publicidad.
- Sin analítica integrada.
- Progreso, preferencias e historial almacenados localmente.
- Tutor externo desactivado por defecto.
- Borrado de progreso e historiales disponible dentro de la aplicación.
- La práctica de escucha utiliza voz sintética y subtítulos; no simula una llamada ni ofrece reconocimiento de voz.
- La API externa requiere dos activaciones explícitas (`EXPO_PUBLIC_TUTOR_API_ENABLED` y `TUTOR_API_ENABLED`) y no debe habilitarse sin consentimiento, política actualizada, límites y control de costes.

Antes de rellenar Apple App Privacy o Google Data Safety se debe confirmar este comportamiento en el build firmado y publicar una URL de política de privacidad.

## URLs preparadas, todavía no públicas

- Privacidad: `https://kepa-apps-soporte.kepabilbao67.chatgpt.site/linguafox/privacidad`
- Soporte: `https://kepa-apps-soporte.kepabilbao67.chatgpt.site/soporte`

El portal está validado en modo privado. Falta confirmar un correo público de soporte y habilitar el acceso externo antes de usar estas URLs en las tiendas.

## Bloqueos de envío

- Builds firmados y pruebas físicas Android/iOS.
- URL pública de privacidad, correo y web de soporte.
- Capturas reales.
- Cuenta Apple Developer y credenciales EAS/tiendas.

TypeScript, lint, cinco pruebas automatizadas y las exportaciones Android, iOS y web están completados.
