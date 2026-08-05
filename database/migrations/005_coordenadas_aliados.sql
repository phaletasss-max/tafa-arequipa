-- ============================================================================
-- TAFA MVP — Coordenadas de los negocios aliados
--
-- Motivo: `businesses.lat` y `businesses.lng` están vacíos para los 28 aliados,
-- mientras que los 30 atractivos sí tienen coordenadas. Como el caso más
-- frecuente es escanear el QR de una picantería, la sección "Lugares y aliados
-- cercanos" tenía que estimar la posición desde el centroide del distrito y
-- mostrar las distancias como aproximadas (ver src/features/partners/geo.ts).
-- Con esta migración esas distancias pasan a ser reales.
--
-- ── Procedencia de los datos ────────────────────────────────────────────────
-- Geocodificación de la dirección registrada en `businesses.address` contra
-- Nominatim / OpenStreetMap (© OpenStreetMap contributors, ODbL 1.0), el
-- 2026-08-05, respetando el límite de 1 petición por segundo.
--
-- ⚠️ PRECISIÓN: son coordenadas a NIVEL DE CALLE, no puntos levantados en
-- campo. Sirven para ordenar por cercanía, no para navegar hasta la puerta.
-- Varios locales de una misma calle reciben el mismo punto (ver §2).
--
-- Nada de esto se inventó: los 5 aliados que Nominatim no resolvió se dejan en
-- NULL a propósito (§3), y el código seguirá aproximándolos por distrito.
-- ============================================================================

-- ── 1. Aliados geocodificados ───────────────────────────────────────────────
-- Nota: `businesses.slug` NO lleva el prefijo `aliado-`; ese prefijo vive en
-- `qr_codes.slug`. Estas sentencias apuntan al slug del negocio.

UPDATE businesses SET lat = -16.4126610, lng = -71.5727483 WHERE slug = 'la-lucila';
UPDATE businesses SET lat = -16.4376095, lng = -71.5244071 WHERE slug = 'la-capitana';
UPDATE businesses SET lat = -16.3869935, lng = -71.5402322 WHERE slug = 'la-nueva-palomino';
UPDATE businesses SET lat = -16.3953358, lng = -71.5353676 WHERE slug = 'zig-zag';
UPDATE businesses SET lat = -16.3969654, lng = -71.5356136 WHERE slug = 'salamanto';
UPDATE businesses SET lat = -16.3966446, lng = -71.5366942 WHERE slug = 'chicha-arequipa';
UPDATE businesses SET lat = -16.3961205, lng = -71.5364953 WHERE slug = 'crepisimo';
UPDATE businesses SET lat = -16.3964197, lng = -71.5353897 WHERE slug = 'hatunpa';
UPDATE businesses SET lat = -16.3978890, lng = -71.5360353 WHERE slug = 'cafe-valenzuela';
UPDATE businesses SET lat = -16.3985664, lng = -71.5356464 WHERE slug = 'capriccio';
UPDATE businesses SET lat = -16.3964197, lng = -71.5353897 WHERE slug = 'casa-andina-premium';
UPDATE businesses SET lat = -16.3990253, lng = -71.5363923 WHERE slug = 'sonesta-arequipa';
UPDATE businesses SET lat = -16.3976017, lng = -71.5385966 WHERE slug = 'katari-hotel';
UPDATE businesses SET lat = -16.3956094, lng = -71.5309332 WHERE slug = 'hostal-solar';
UPDATE businesses SET lat = -16.3981157, lng = -71.5404356 WHERE slug = 'los-tambos';
UPDATE businesses SET lat = -16.3980068, lng = -71.5335731 WHERE slug = 'wild-rover-arequipa';
UPDATE businesses SET lat = -16.3943474, lng = -71.5332694 WHERE slug = 'flying-dog';
UPDATE businesses SET lat = -16.3938165, lng = -71.5355672 WHERE slug = 'giardino-tours';
UPDATE businesses SET lat = -16.3957434, lng = -71.5338492 WHERE slug = 'pablo-tour';
UPDATE businesses SET lat = -16.3966446, lng = -71.5366942 WHERE slug = 'sc-tours';
UPDATE businesses SET lat = -16.3953700, lng = -71.5349856 WHERE slug = 'fundo-el-fierro';
UPDATE businesses SET lat = -16.3986675, lng = -71.5351949 WHERE slug = 'patio-del-ekeko';

-- ── 2. Puntos que conviene afinar a mano ────────────────────────────────────
-- Nominatim devolvió el eje de la calle, no el número, así que estos pares
-- comparten coordenada exacta pese a ser locales distintos:
--   • hatunpa  /  casa-andina-premium   → Calle Ugarte
--   • chicha-arequipa  /  sc-tours      → Calle Santa Catalina
--
-- Y este quedó lejos de donde debería: la dirección dice Cercado, pero el
-- resultado cae en la urbanización Magisterial Amauta. Se deja fuera del
-- bloque anterior hasta confirmarlo:
--   • colonial-tours — Calle Puente Bolívar 114, Cercado
-- UPDATE businesses SET lat = -16.4088591, lng = -71.5506908 WHERE slug = 'colonial-tours';

-- ── 3. Sin resolver — se dejan en NULL a propósito ──────────────────────────
-- Nominatim no encontró estas direcciones. El frontend seguirá estimando su
-- posición desde el centroide del distrito y rotulando la distancia como
-- aproximada, que es la conducta correcta mientras no haya dato real:
--   • sol-de-mayo         — Calle Jerusalem 207, Yanahuara
--   • la-benita           — Calle Misti 108, Sachaca
--   • libertador-arequipa — Plaza Bolivar s/n, Selva Alegre
--   • colca-lodge         — Fundo Puye s/n, Yanque (valle del Colca)
--   • pozo-del-cielo      — Calle Bolognesi s/n, Chivay
--
-- Para completarlos basta tomar el punto en Google Maps y ejecutar:
--   UPDATE businesses SET lat = <lat>, lng = <lng> WHERE slug = '<slug>';

-- ── 4. Verificación ─────────────────────────────────────────────────────────
-- SELECT slug, trade_name, lat, lng FROM businesses ORDER BY lat NULLS FIRST;
-- Deben quedar 22 filas con coordenadas y 6 en NULL (5 del §3 + colonial-tours).
