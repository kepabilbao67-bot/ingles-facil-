# Entrega final para Google Play — LinguaFox 1.0

Fecha de preparación: 23 de agosto de 2026

## Hecho verificado

- Nombre de la aplicación: **LinguaFox**
- Identificador Android: **com.kepabilbao.linguafox**
- Versión visible: **1.0.0**
- Código de versión local inicial: **1**
- Tipo: **Aplicación**
- Categoría recomendada: **Educación**
- Precio de lanzamiento: **Gratis**
- Compras integradas: **No**
- Anuncios: **No**
- Cuenta o inicio de sesión: **No**
- Acceso restringido: **No**
- Target Android generado por Expo SDK 57: **API 36**
- Tutor externo: **Desactivado por defecto**
- El perfil EAS `production` genera un Android App Bundle y aumenta el código de versión de forma remota.

## Datos para crear la aplicación

| Campo de Play Console | Valor preparado |
| --- | --- |
| Nombre | LinguaFox |
| Idioma predeterminado | Español (España) |
| Aplicación o juego | Aplicación |
| Gratis o de pago | Gratis |
| Categoría | Educación |
| Contiene anuncios | No |
| Acceso a la aplicación | Todas las funciones están disponibles sin acceso especial |

## Ficha principal

### Descripción breve

Aprende 5 idiomas con lecciones, audio, quizzes y progreso local.

### Descripción completa

LinguaFox te ayuda a practicar inglés, francés, italiano, alemán y portugués con lecciones breves, audio, quizzes y progreso.

Cada idioma incluye 8 lecciones y 48 términos esenciales organizados por situaciones reales: saludos, vida cotidiana, viajes, familia, comida, ciudad, tiempo, estudio y trabajo.

Avanza paso a paso y aprende vocabulario útil para situaciones cotidianas y viajes. En el curso de inglés también puedes practicar con Fox: el tutor local funciona sin conexión externa y ofrece correcciones sencillas y sugerencias para continuar.

El progreso, las preferencias y el historial se guardan localmente en tu dispositivo.

### Novedades

- Cursos básicos de inglés, francés, italiano, alemán y portugués.
- Tarjetas con audio y quizzes de vocabulario.
- Estrellas, experiencia, logros y rachas.
- Tutor conversacional local para practicar inglés.
- Práctica de escucha con voz sintética y subtítulos.
- Borrado del progreso y los historiales del dispositivo.

## Recursos disponibles

- Icono de Play: `assets/images/linguafox-play-icon-512.png`
- Gráfico de funciones 1024 × 500: `store-assets/feature-graphic.png`
- Plan de seis capturas: `store-assets/SCREENSHOT_PLAN_ES.md`

## Seguridad de datos — borrador para el binario firmado

Respuestas propuestas con `EXPO_PUBLIC_TUTOR_API_ENABLED=false` y `TUTOR_API_ENABLED=false`:

- ¿La aplicación recopila o comparte datos obligatorios?: **No**
- Datos recopilados: **Ninguno**
- Datos compartidos: **Ninguno**
- Creación de cuenta: **No**
- Solicitud de eliminación de cuenta: **No aplicable; no existen cuentas**
- Eliminación de datos locales: **Disponible desde “Privacidad y datos” y al desinstalar**

No confirmar estas respuestas hasta revisar permisos, síntesis de voz y tráfico de red del AAB firmado exacto. No configurar `OPENAI_API_KEY` en la V1.

## Audiencia y contenido — recomendación

- Audiencia recomendada para esta V1: **13–15, 16–17 y 18 o más**
- No declarar menores de 13 años como público objetivo mientras no se complete una revisión específica de Familias.
- Violencia, contenido sexual, lenguaje ofensivo, drogas, apuestas y miedo: **No**
- Interacción entre usuarios y contenido generado por otros usuarios: **No**
- Compras aleatorias, premios o apuestas con dinero: **No**
- La conversación es con un tutor local preprogramado; no conecta estudiantes entre sí.

Las respuestas finales deben completarse dentro del cuestionario IARC de Play Console, respetando exactamente la redacción que aparezca.

## Archivos y datos todavía pendientes

- `LinguaFox-1.0.0.aab` firmado.
- Capturas reales de Android.
- URL de privacidad pública.
- Correo público de soporte.
- Nombre o razón social y datos legales del titular.

No usar las URLs privadas actuales en Play Console.

## Secuencia exacta de cierre

1. Instalar EAS CLI y ejecutar `eas whoami`.
2. Desde la raíz del proyecto ejecutar `npm ci`, `npm run lint` y `npm test`.
3. Confirmar que los dos indicadores externos permanecen en `false` y que no se configura `OPENAI_API_KEY`.
4. Ejecutar `eas build --platform android --profile production`.
5. Permitir que EAS genere y custodie el keystore si no existe uno anterior.
6. Descargar el AAB y probar previamente un APK de vista previa en un Android físico.
7. Crear LinguaFox en Play Console con los campos de este documento.
8. Subir el AAB primero a pruebas internas.
9. Completar ficha, privacidad, seguridad de datos, audiencia y clasificación.
10. Compartir el enlace con testers y promover la versión cuando la cuenta lo permita.

## Condición de prueba cerrada

Si la cuenta es una cuenta personal nueva sujeta a la política de Google, se necesitan al menos 12 testers inscritos continuamente durante 14 días antes de solicitar acceso a producción. El tipo y la fecha de creación de la cuenta todavía no están verificados.
