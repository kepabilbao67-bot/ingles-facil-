# LinguaFox

Aplicación educativa construida con Expo SDK 57, React Native y TypeScript.

## V1

- Ocho lecciones y 48 términos por cada curso de inglés, francés, italiano, alemán y portugués, con apoyo en español.
- Tarjetas de vocabulario, audio, quizzes, estrellas, experiencia y rachas.
- Tutor conversacional local para inglés y personajes originales.
- Progreso e historiales almacenados en el dispositivo.
- Borrado de los datos locales desde la propia aplicación.
- Sin cuenta, anuncios ni compras en la V1.

El tutor externo está desactivado por defecto. No debe habilitarse sin autenticación, límites de uso, control de costes, consentimiento y una política de privacidad actualizada.

## Desarrollo

Requisitos: Node.js 22.13 o posterior y npm.

```bash
npm ci
npm start
```

Comprobaciones:

```bash
npx tsc --noEmit
npm run lint
npm test
npx expo export --platform android
npx expo export --platform ios
npx expo export --platform web
```

## Publicación

La configuración de la aplicación está en `app.json` y los perfiles EAS en `eas.json`. Los textos y recursos iniciales de tienda están en `store-assets/`.

Las medidas de protección, firma e integridad están documentadas en `SECURITY.md`.

Antes de enviar una versión deben completarse las pruebas en dispositivos físicos, los builds firmados, las capturas reales y la URL pública de privacidad.
