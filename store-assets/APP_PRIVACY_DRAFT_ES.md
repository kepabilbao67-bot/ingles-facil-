# Declaración de privacidad — borrador LinguaFox 1.0

Este documento sirve para rellenar App Store Connect y Google Play Console. Debe confirmarse de nuevo sobre el build firmado exacto.

## Apple App Privacy — respuesta propuesta

- ¿El desarrollador o sus socios recopilan datos desde esta aplicación?: **No**, siempre que el tutor externo permanezca desactivado.

Fundamento verificado en el código revisado:

- No existe cuenta ni inicio de sesión.
- No hay SDK publicitario ni analítico declarado.
- Progreso, preferencias e historiales se almacenan localmente.
- El tutor local no envía las conversaciones al servidor opcional.
- La síntesis de voz usa el servicio disponible en el sistema operativo; su comportamiento debe comprobarse en los dispositivos de prueba.

Antes de confirmar “No recopilamos datos”:

1. Mantener `EXPO_PUBLIC_TUTOR_API_ENABLED=false` y `TUTOR_API_ENABLED=false`.
2. Revisar las dependencias del build firmado.
3. Comprobar el tráfico de red y la síntesis de voz en dispositivos físicos.
4. No activar analítica, anuncios ni cuentas.

## Google Play Data Safety — respuesta propuesta

- Datos recopilados: **ninguno**, con el tutor externo desactivado.
- Datos compartidos: **ninguno**.
- Cuenta obligatoria: **no**.
- Eliminación de datos: disponible desde “Privacidad y datos”; también al desinstalar.
- Publicidad: **no**.

## URLs candidatas

- Privacidad: `https://kepa-apps-soporte.kepabilbao67.chatgpt.site/linguafox/privacidad`
- Soporte: `https://kepa-apps-soporte.kepabilbao67.chatgpt.site/soporte`

Estas URLs están en un portal privado y marcado como borrador. No deben introducirse en las tiendas hasta añadir un contacto público verificado y hacer el portal accesible para revisores y usuarios.
