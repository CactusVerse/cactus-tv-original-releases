# Cactus TV Installer LG — Android v0.1.5 (beta)

Instalador para televisor LG webOS desde un celular Android, sin computadora. Compilación Android de prueba; la conexión SSH y selección de archivos IPK se probaron con un usuario, pero esto no garantiza compatibilidad con todos los LG.

## Cómo utilizar

1. En el televisor LG instala/abre **Developer Mode**, activa **Dev Mode Status** y **Key Server** y mantén visible esa pantalla.
2. Conecta celular y LG a la misma red local.
3. Instala en Android el APK **CactusTV-LG-Installer-Android-v0.1.5-beta.apk** desde GitHub Releases.
4. Introduce la IP local actual que aparece en Developer Mode y la passphrase directamente en la aplicación. No compartas esa passphrase.
5. Pulsa **1 · Probar la conexión de red** y después **2 · Obtener clave SSH del LG**. La clave la proporciona el Key Server de LG; no se crea una nueva desde Android.
6. Introduce la passphrase del LG (6 caracteres) y pulsa **3 · Verificar clave y emparejar LG**. Acepta la huella SSH solo si corresponde a tu televisor.
7. Pulsa **Seleccionar archivo .ipk** (o **Otro explorador**), elige un IPK autorizado del almacenamiento de tu celular y espera la confirmación **IPK listo**.
8. Pulsa **Instalar en LG** y comprueba la app instalada en el televisor. El botón explica lo que falta si todavía no está emparejado; el archivo IPK listo no implica que la sesión SSH esté conectada.

## Cambios de la beta 0.1.5

- Separación de la descarga de clave SSH desde el televisor y la validación de la passphrase mediante SSH.
- Estado visible: clave obtenida y emparejamiento validado; el botón Instalar explica si falta un paso.
- La clave y la passphrase no se guardan permanentemente.

### Cambios incluidos de la beta 0.1.4

- El botón Instalar siempre responde cuando la app está libre, y explica si falta IPK, emparejamiento o una passphrase correcta.
- Impide instalar usando la clave SSH de una IP distinta de la emparejada.
- Reconoce `statusValue: 30` (instalación completada) además de respuestas antiguas `status: installed` o `status: success`.
- Mejora el aviso cuando webOS no confirma la instalación; no afirma éxito antes de la confirmación.
- Todavía necesita una prueba real en el televisor LG; una compilación correcta no garantiza instalación.

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
