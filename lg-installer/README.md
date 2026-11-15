# Cactus TV Installer LG Android 0.2.0 (beta)

Esta herramienta se instala en el celular Android (Android 7 o posterior). Cactus TV para LG usa un archivo IPK; el televisor LG no ejecuta este APK.

## Novedades
- Descarga integrada de Cactus LG 2.0.41: elige Standard o webOS 6. Comprueba SHA-256 antes de habilitar el paquete.
- Mantiene Seleccionar archivo .ipk y Otro explorador para archivos locales.
- Al instalar la descarga oficial, cierra únicamente Cactus TV LG antes de actualizar. No desinstala ni borra datos.
- Firma local persistente para próximas actualizaciones. La beta 0.1.3 usó una clave temporal distinta: Android puede rechazar actualizar aquella herramienta. En ese caso, elimina únicamente Cactus TV Installer LG del celular y vuelve a instalarla; habrá que emparejar de nuevo. No elimines Cactus TV del televisor.

## Uso
1. En LG instala/abre Developer Mode oficial e inicia sesión en LG Developer. Activa Dev Mode Status, reinicia si lo pide y luego activa Key Server.
2. Celular y LG deben estar en la misma red. Introduce la IP del LG y su passphrase de seis caracteres en la herramienta. La passphrase no se guarda.
3. Probar la conexión de red → Obtener clave SSH del LG → Verificar clave y emparejar LG. Revisa la identidad antes de confiar en el televisor.
4. Elige la variante y pulsa Descargar Cactus TV, o selecciona tu propio IPK sin descomprimirlo.
5. Cierra Cactus antes de actualizar. Pulsa Instalar en LG, espera la confirmación y abre Cactus TV LG desde Apps.

## Alcance de la revisión
Compilación release, análisis de compilación, firma, instalación/apertura y descarga real con verificación SHA-256 probadas en emulador Android 15. La conexión SSH y selección de IPK conservan las correcciones 0.1.4/0.1.5 y proceden de las betas anteriores, probadas anteriormente; no se completó una nueva transferencia desde esta versión Android al LG durante esta revisión. Standard 2.0.41 sí se instaló y comprobó por la herramienta de desarrollo LG en el LG 55UK7500PSA webOS 4.4.0. La variante webOS 6 está pendiente de prueba física. No garantiza compatibilidad con todos los LG.

Guía y tutorial: https://cactus-tv-web.pages.dev/guia-lg-android.html
Archivos IPK independientes y opción desde PC: https://cactus-tv-web.pages.dev/guia-lg.html
Fuente del instalador: https://github.com/CactusVerse/cactus-tv-original-releases/tree/main/lg-installer
Usa JSch 0.2.26 (fork mwiede), licencia BSD: https://github.com/mwiede/jsch
Procedimiento oficial LG: https://webostv.developer.lge.com/develop/getting-started/developer-mode-app
Herramienta independiente, no afiliada ni respaldada por LG.

Integra también las correcciones 0.1.4/0.1.5: clave ligada a la IP emparejada, estado de conexión visible, botón Instalar con diagnóstico y reconocimiento de statusValue 30.
