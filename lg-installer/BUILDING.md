# Compilar el instalador LG Android

Requiere JDK 17, Android SDK 35 y Gradle compatible con Android Gradle Plugin 8.8.2 (se usó Gradle 8.13).

1. Configura ANDROID_HOME o un archivo local.properties local con sdk.dir.
2. Ejecuta `gradle -p lg-installer :app:assembleRelease`.
3. Firma `app/build/outputs/apk/release/app-release-unsigned.apk` con apksigner usando TU clave de distribución guardada de forma privada.
4. Verifica con `apksigner verify --verbose --print-certs archivo.apk`.

No se incluyen claves de firma. Para actualizar la edición oficial se requiere su misma clave persistente; una clave distinta no puede actualizarla conservando la identidad Android. La beta histórica 0.1.3 usó una clave temporal distinta.

ReleaseDownload.java fija versión, nombres y SHA-256 de los dos IPK publicados. Al actualizar esas constantes, comprueba primero ambos IPK de la publicación y prueba la descarga real antes de distribuir el APK.

La compilación de release no usa el workflow histórico de debug: no lo vuelvas a ejecutar para sobrescribir una publicación anterior.

Las bibliotecas JSch/JZlib/jBCrypt conservan sus avisos en licenses/ y en el paquete Java de la dependencia.
