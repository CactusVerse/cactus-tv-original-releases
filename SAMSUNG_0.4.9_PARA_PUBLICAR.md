# Cactus TV Samsung 0.4.9 — Archivos pendientes de adjuntar
## Publicación desde el repositorio de releases
1. En `CactusVerse/cactus-tv-original-releases`, abre **Releases → Draft a new release**.
2. Tag exacto: `samsung-0.4.9-2026-11-08`; título: **Cactus TV Samsung 0.4.9 — Legacy — Tizen 3 Tostadora**.
3. Adjunta estos WGT proporcionados por el desarrollador:
   - `CactusTV_Samsung_65_DiagnosticoCaratulas_049.wgt` — versión 0.4.9
   - `CactusTV_Samsung_Legacy_DiagnosticoCaratulas_049.wgt` — versión 0.4.9
   - `CactusTV_Tizen3_Tostadora_DiagnosticoCaratulas_0238.wgt` — versión 0.2.38
4. Verifica sus SHA-256 con [lista oficial](https://github.com/CactusVerse/cactus-tv-web/blob/main/public/updates/samsung/sha256-0.4.9.txt).
5. Pulsa **Publish release**, no **Save draft**.
6. La [página de descargas](https://cactus-tv-web.pages.dev/descargas-samsung.html) consulta las descargas de esta etiqueta y activa cada botón solo si el WGT existe y su nombre coincide.
7. Cambia `releaseReady` a `true` en el [manifiesto](https://github.com/CactusVerse/cactus-tv-web/blob/main/public/updates/samsung/manifest.json) para activar avisos de actualización para cada plataforma cuya publicación se haya validado.

> La conexión GitHub disponible para este trabajo no admite adjuntar binarios a GitHub Releases. Por ese motivo, los WGT **no están aún alojados públicamente**. No marcar como descargable hasta completar el paso 5.
>
> El usuario confirmó carátulas en Samsung Tizen 6.5. Legacy y Tizen 3 requieren prueba en modelos compatibles; la firma de los WGT y las autorizaciones de fuentes multimedia son responsabilidad del distribuidor.
