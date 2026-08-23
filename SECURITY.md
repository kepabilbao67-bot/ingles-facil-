# Seguridad de LinguaFox

## Controles incluidos

- La V1 utiliza el tutor local y mantiene desactivado el servicio externo por defecto.
- Las solicitudes opcionales al tutor externo exigen JSON, tienen un límite de 8 KiB y aceptan como máximo diez mensajes de 500 caracteres.
- Las entradas con roles no permitidos o caracteres de control se rechazan, y la respuesta externa se valida antes de mostrarla.
- El tutor recibe instrucciones para tratar los mensajes como texto no confiable, no revelar instrucciones internas y no solicitar datos personales.
- Android bloquea cámara, micrófono, ubicación y contactos. La síntesis de voz no necesita acceso al micrófono.
- La copia de seguridad de datos de Android está desactivada y no hay claves privadas dentro del cliente.

## Firma, integridad y protección frente a copias

- Publicar el AAB con Google Play App Signing y conservar la clave de subida fuera del repositorio.
- Activar Play Integrity cuando exista una ficha en Play y un backend capaz de validar los veredictos. Comprobar al menos `PLAY_RECOGNIZED` y `LICENSED` antes de habilitar servicios con coste o cuentas.
- Ninguna aplicación móvil puede impedir por completo la ingeniería inversa. La firma, la distribución oficial, la minimización y Play Integrity reducen la manipulación y ayudan a detectar copias no reconocidas.

## Alcance del término «antivirus»

LinguaFox no es un antivirus: no recibe archivos, no escanea el dispositivo y no necesita permisos invasivos. La protección adecuada consiste en reducir permisos, validar estrictamente las entradas y salidas, mantener los servicios externos cerrados por defecto y verificar la firma de la aplicación.

## Verificación antes de publicar

1. Mantener `EXPO_PUBLIC_TUTOR_API_ENABLED=false` y `TUTOR_API_ENABLED=false` en la V1.
2. Generar un AAB de producción firmado y revisar su manifiesto final.
3. Subir primero a una prueba interna y activar Play App Signing.
4. Probar tutor local, voz, progreso, borrado de datos y límites de entrada en un dispositivo físico.
5. Añadir backend, autenticación, límites de uso y Play Integrity antes de habilitar el tutor externo.
6. No anunciar «antivirus» en la ficha de tienda.

## Auditoría de dependencias (23 de agosto de 2026)

Se aplicaron las actualizaciones compatibles propuestas por `npm audit fix`, manteniendo Expo SDK 57. La auditoría aún señala incidencias transitivas en el procesador de imágenes de Metro y en `uuid` a través de las herramientas de configuración de Xcode. Afectan al proceso de compilación con archivos de entrada manipulados, no a una función expuesta al alumnado dentro de LinguaFox. No se aplicó `--force` porque propone versiones incompatibles con SDK 57. Hasta que React Native/Expo publiquen la corrección compatible, los builds deben usar únicamente los recursos versionados y revisados del proyecto.
