# Cactus TV Installer LG — Android v0.1.3 (beta)

Instalador para televisor LG webOS desde un celular Android, sin computadora. Compilación Android de prueba; la conexión SSH y selección de archivos IPK se probaron con un usuario, pero esto no garantiza compatibilidad con todos los LG.

## Cómo utilizar

1. En el televisor LG instala/abre **Developer Mode**, activa **Dev Mode Status** y **Key Server** y mantén visible esa pantalla.
2. Conecta celular y LG a la misma red local.
3. Instala en Android el APK **CactusTV-LG-Installer-Android-v0.1.3-beta.apk** desde GitHub Releases.
4. Introduce la IP local actual que aparece en Developer Mode y la passphrase directamente en la aplicación. No compartas esa passphrase.
5. Pulsa **Probar la conexión de red**, luego **Conectar / emparejar LG** y acepta la huella SSH solo si es tu televisor.
6. Pulsa **Seleccionar archivo .ipk** (o **Otro explorador**), elige un IPK autorizado del almacenamiento de tu celular y espera la confirmación **IPK listo**.
7. Pulsa **Instalar en LG** y comprueba la app instalada en el televisor.

## Limitaciones y seguridad

- Beta experimental. Requiere **Developer Mode** oficial del LG y red local; no necesita root.
- No contiene ni descarga archivos IPK, catálogos o contenido multimedia.
- La conexión SSH usa el usuario de desarrollo `prisoner`, el Key Server del LG y puerto 9922. Por compatibilidad con webOS antiguo, puede usar `ssh-rsa` cuando el televisor no ofrece alternativas; se mantiene la comprobación de huella del servidor.
- La passphrase se solicita en Android y no se guarda en las preferencias.
- El APK beta se firma con la clave temporal de GitHub Actions; una beta anterior firmada con otra clave puede necesitar desinstalación antes de instalar esta. Para futuras actualizaciones públicas debe configurarse una **clave de firma permanente y segura**.
- Los binarios no se han evaluado con una auditoría de seguridad independiente. Los paquetes IPK deben contar con los derechos y autorizaciones correspondientes.
- Si el televisor exige otro método de instalación o no admite el IPK, no se puede forzar su compatibilidad desde el celular.

## Fuente y atribuciones

Proyecto Android independiente de CactusVerse. Utiliza [JSch (fork de mwiede)](https://github.com/mwiede/jsch) y el protocolo de desarrolladores documentado por [LG webOS CLI](https://github.com/webos-tools/cli) (LG Electronics, Apache 2.0). Para los términos de bibliotecas incorporadas, consulta los respectivos repositorios.

**Cactus TV Installer LG no está afiliado ni respaldado por LG Electronics.**
