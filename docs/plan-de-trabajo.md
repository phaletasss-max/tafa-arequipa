# TAFA Arequipa — Plan de Trabajo

**Creado**: 2026-08-05
**Base**: auditoría del repositorio contra `docs/master-roadmap.md`
**Alcance**: convierte las FASES del roadmap en planes de trabajo (PT) accionables,
con el estado real verificado — no el estado declarado.

---

## 1. Estado real de las fases del roadmap

Verificado ejecutando el build, levantando la app y consultando la base Supabase
del MVP (`qorubtwxncubeyqttemn`) el 2026-08-05.

| Fase | Descripción | Estado declarado | Estado verificado |
|------|-------------|------------------|-------------------|
| FASE 0 | Auditoría | ✅ | ✅ `current-state-audit.md` existe |
| FASE 1 | Sistema de imágenes | ✅ | ✅ 30 atractivos con `.webp` y `imagen_meta` |
| FASE 2 | Accesibilidad WCAG 2.2 | ✅ | ✅ contexto, `localStorage`, TTS, modo no visual |
| FASE 3 | Usuario turista | ✅ | ❌ **No es Supabase Auth** — ver PT-06 |
| FASE 4 | Sistema QR | ✅ | ⚠️ **Estaba roto** — corregido en PT-01/PT-02 |
| FASE 5 | Aliados turísticos | ❌ | ✅ Creado en PT-04 |
| FASE 6 | Recomendaciones cercanas | ⚠️ | ⚠️ Lista estática — ver PT-08 |
| FASE 7 | Documentación | ❌ | ✅ Completada en PT-05 |

---

## 2. Planes de trabajo

### PT-01 — Corregir el crash de la página QR · ✅ COMPLETADO

**Severidad**: crítica. **Fase**: 4.

`QRCheckInPage.tsx` declaraba cinco `useState` (reseña, foto, timestamp) *después*
de los `return` condicionales de `loading` y `not_found`. Al pasar de `loading` a
`ready` cambiaba el número de hooks entre renders y React abortaba el árbol:

```
Error: Rendered more hooks than during the previous render.
```

Efecto: **toda ruta `/qr/:slug` mostraba pantalla en blanco**. Es la funcionalidad
central del producto y estaba caída en producción.

- Fix: los hooks se declaran antes de cualquier `return` condicional.
- `scanTimestamp` pasa a inicialización perezosa (`useState(() => Date.now())`)
  para no reiniciarse en cada render.
- Verificación: `/qr/plaza-de-armas` renderiza y la consola queda sin errores.

---

### PT-02 — Alinear los slugs de QR con la base de datos · ✅ COMPLETADO

**Severidad**: crítica. **Fase**: 4.

El Estudio QR imprimía slugs cortos (`plaza-de-armas`, `la-nueva-palomino`)
mientras la base usa el nombre oficial completo y prefija los negocios con
`aliado-` (`plaza-de-armas-de-arequipa`, `aliado-la-nueva-palomino`).

Ningún QR impreso encontraba su fila. `getQRLanding` caía al catálogo mock y
`registerQRCheckIn` devolvía `total_points: 150` inventado: **el turista veía
"visita confirmada" y puntos acreditados que nunca se guardaron**.

- Tabla `LEGACY_SLUG_ALIASES` en `checkInService.ts`: los carteles ya impresos
  siguen funcionando y resuelven contra la fila real.
- `registerQRCheckIn` envía el slug canónico al RPC y marca `persisted: false`
  cuando no logra escribir; la UI lo advierte en vez de afirmar el abono.
- El Estudio QR carga su catálogo de `qr_landing`, así que no puede generar un
  slug inexistente; si se escribe uno manual, avisa que no sumará puntos.

---

### PT-03 — Limpiar la composición de la landing · ✅ COMPLETADO

**Severidad**: media.

`App.tsx` importaba `Hero` sin renderizarlo (`CinematicStoryteller` lo sustituyó).
Import muerto retirado y `PartnersDirectory` montado en el flujo principal.

**Pendiente asociado**: quedan 16 componentes construidos y nunca montados
(`Problem`, `Features`, `MapPreview`, `Stats`, `Institutions`, `CTA`,
`AboutProject`, `UnexploredRoutes`, `ScrollyDestinations`, `HistoricVisualStories`,
`EmergencyBanner`, `SurveyModal`, `QRModal`, `JoinEcosystem`,
`DirectAIConversation`, `AccessibilityBar`). Decidir uno a uno: montar o eliminar
— ver PT-09.

---

### PT-04 — FASE 5: aliados turísticos · ✅ COMPLETADO

Módulo `src/features/partners/` creado:

| Archivo | Rol |
|---------|-----|
| `types.ts` | Categorías y gremios (Sociedad Picantera, AGAR, AHORA, AVIT, COLITUR) |
| `partnersService.ts` | Lee `qr_landing`; nunca lanza, con catálogo de respaldo |
| `PartnersDirectory.tsx` | Directorio público con filtros por categoría |

Verificado: 28 aliados reales cargados desde Supabase, cada tarjeta enlaza a su
ruta QR real.

---

### PT-05 — FASE 7: documentación · ✅ COMPLETADO

`architecture.md`, `database-schema.md`, `qr-system.md`, `changelog.md` y este
plan. `accessibility.md` e `image-system.md` ya existían.

---

### PT-06 — Migrar a Supabase Auth y cerrar RLS · 🟠 FRONTEND HECHO · BD PENDIENTE

**Severidad**: crítica (seguridad y datos personales). **Fase**: 3.

> **Hecho (2026-08-05)**: el frontend ya usa Supabase Auth con email + contraseña.
> `signUpTourist` / `signInTourist` / `signInWithGoogle` / `signOutTourist` en
> `authService.ts`; `profiles.id` se liga a `auth.users.id`; el login exige
> contraseña y muestra errores traducidos; `App.tsx` rehidrata la sesión al
> arrancar. La función `registerOrLoginProfile` que permitía entrar solo con el
> email fue eliminada.
>
> **Falta (requiere acceso al panel Supabase)**:
> 1. Aplicar `database/migrations/004_rls_hardening.sql`. Hasta entonces los
>    perfiles siguen siendo legibles y modificables con la clave anónima.
> 2. Habilitar el proveedor Google si se quiere activar el botón OAuth.
> 3. **Perfiles heredados**: las filas creadas por el flujo antiguo tienen un
>    `id` aleatorio que no corresponde a ningún `auth.users`. Tras aplicar la
>    migración 004 quedarán inaccesibles y esas personas deberán registrarse de
>    nuevo. Si hay que conservar sus puntos, migrarlas a mano ligando el `id`
>    al usuario de Auth creado con el mismo correo.
>
> El check-in tolera ambas situaciones: llama a la firma segura del RPC y, si aún
> no existe (`PGRST202`), reintenta con la antigua, de modo que nada se rompe
> entre un despliegue y el otro.

El roadmap especifica Supabase Auth. Lo implementado **no lo es**:
`registerOrLoginProfile` busca la fila de `profiles` por email y, si existe,
inicia sesión. **No hay contraseña ni verificación**: escribir el correo de otra
persona basta para entrar en su cuenta y sus puntos.

Verificado el 2026-08-05 con la clave anónima que viaja en el bundle público:

| Prueba | Resultado |
|--------|-----------|
| `SELECT` sobre `profiles` | ✅ Permitido — expone email y documento de todos los turistas |
| `UPDATE` sobre `profiles` | ✅ Permitido (HTTP 200) — cualquiera puede reescribir perfiles y saldos |

La clave anónima es pública por diseño; la única defensa es RLS, y hoy no la hay.

**Trabajo requerido**:
1. Sustituir el login por email por `supabase.auth.signUp` / `signInWithPassword`
   (el roadmap además pide dejar Google OAuth preparado).
2. Ligar `profiles.id` a `auth.users.id`.
3. Aplicar `database/migrations/004_rls_hardening.sql` **en el mismo despliegue**.
4. Adaptar `registerQRCheckIn` a la firma nueva del RPC (`p_qr_slug`, el servidor
   toma la identidad de `auth.uid()`).

> ⚠️ Aplicar la migración 004 por separado deja la app sin poder escribir perfiles.
> Debe ir junto con el cambio de frontend.

**Decisión abierta**: método de registro (contraseña, enlace mágico u OTP) — afecta
el diseño del formulario y el flujo de check-in tras escanear.

---

### PT-07 — Aplicar `recompensas_catalogo` · 🔴 BLOQUEADO — falta acceso Supabase

`tafaMasterService.getRecompensasCatalogo()` consulta una tabla inexistente;
PostgREST responde `PGRST205` en cada carga y el catálogo cae siempre al respaldo
hardcodeado.

`database/migrations/003_recompensas_catalogo.sql` crea la tabla, la siembra con
aliados reales y la deja pública de solo lectura. **Es segura de aplicar ya** (solo
agrega).

> ⛔ **Bloqueante de acceso.** El proyecto `qorubtwxncubeyqttemn` no pertenece a
> la cuenta Supabase disponible en el entorno de desarrollo: la API de gestión
> responde `403`. Las migraciones **003 y 004 solo puede aplicarlas el titular
> del proyecto** desde el SQL Editor del panel de Supabase. Ambos archivos están
> listos para pegarse y ejecutarse tal cual.

---

### PT-08 — FASE 6: recomendaciones cercanas reales · ✅ COMPLETADO

`NEARBY_RECOMMENDATIONS` era una lista fija de cuatro sitios, idéntica para todos
los QR. Ahora se calcula la distancia real y se ordena por cercanía.

**El obstáculo**: los 30 atractivos tienen `place_lat`/`place_lng`, pero los 28
negocios aliados los tienen en NULL. Como el caso más frecuente es escanear el QR
de una picantería, ordenar solo por coordenadas habría dejado sin recomendaciones
justo al escenario principal. La posición se resuelve en dos niveles
(`src/features/partners/geo.ts`):

1. Coordenadas reales de la base, cuando existen.
2. Centroide del distrito deducido de la dirección, marcado como aproximado.

Las distancias del nivel 2 se rotulan «aprox.», y dos entidades del mismo
distrito muestran «Mismo distrito» en vez de un engañoso «0 m».

Verificado: desde la Plaza de Armas, la Catedral aparece **a 34 m** y la Iglesia
de la Compañía **a 131 m**, que es la geografía real del centro histórico.

---

### PT-09 — Componentes huérfanos y peso del bundle · ✅ COMPLETADO

Auditados 18 componentes. **9 eliminados** (~1.700 líneas) y **6 secciones
montadas**; `Footer` se mantiene.

| Eliminados | Motivo |
|---|---|
| `Hero`, `ScrollyDestinations`, `HistoricVisualStories` | Duplicaban el hero cinematográfico ya montado |
| `Features`, `CTA` | Copy de pitch cuyas claves i18n no existen; `id="explorar"` colisionaba con `Highlights` |
| `Institutions` | El pie ya lista las mismas instituciones, con enlaces reales |
| `QRModal` | Mock superado por `QRCheckInPage` + `qr_landing` |
| `DirectAIConversation` | Chat simulado, con coincidencias en inglés sobre un sitio en español; duplicaba `TouristAIAssistant` |
| `AccessibilityBar` | Versión anterior de `AccessibilitySettings`; competiría por el mismo DOM que `AccessibilityContext` |

Montados: `MapPreview`, `UnexploredRoutes`, `Stats`, `Problem`, `AboutProject`,
`JoinEcosystem` y el banner `EmergencyBanner`. Con ello **los enlaces `#mapa`,
`#inexplorada`, `#sobre-proyecto` y `#ecosistema` del pie dejan de estar rotos**;
`nav_qr`, que apuntaba a `#`, ahora lleva al directorio de aliados.

**Peso del bundle**: 744 kB → **113 kB** el fragmento principal. Se logró con
`React.lazy` por ruta, sección y modal, más `manualChunks` para las librerías
(React, Framer Motion, Supabase, i18next, lucide), que ahora se cachean entre
despliegues. Desapareció el aviso de «chunks larger than 500 kB».

**No se montó `SurveyModal`** pese a estar terminado: envía a `/api/encuestas`,
un backend Express que no existe en este repositorio. Montarlo habría añadido
otro formulario que falla en silencio. Queda en el repo, listo para cuando las
encuestas vivan en Supabase.

---

### PT-10 — Correcciones de integridad detectadas al montar · ✅ COMPLETADO

Al mover secciones a producción aparecieron afirmaciones que el código no
sostenía:

- **`Stats` publicaba métricas inventadas.** «Satisfacción Turística» salía de
  `MOCK_STATS.avg_satisfaccion`, un valor fijo que nunca se actualizaba, rotulado
  como «promedio encuestas»; y «Protección de Datos 100 %» no es una medición.
  Se retiraron ambas: quedan cuatro conteos reales y el cumplimiento de la
  Ley 29733 como nota, no como cifra.
- **`supabaseService` consultaba tablas inexistentes.** `lugares_turisticos` y
  `gastronomia` devolvían 404 en cada carga; las reales son `places` y
  `businesses`. Corregido: ya no hay peticiones fallidas.
- **`JoinEcosystem` daba «postulación recibida» aunque el `insert` fallara**, y
  las solicitudes se perdían en silencio. Ahora un fallo se informa.
- **`AboutProject` enlazaba a `http://localhost:3000/admin.html`** y `/api/health`
  — dos enlaces muertos en producción. Banner retirado.
- **`MapPreview`**: los toggles de capa eran `div onClick`, inalcanzables por
  teclado; ahora son `button` con `aria-pressed`. El contador decía
  «{total} atractivos» cuando el recorte del mapa deja fuera los provinciales.

---

## 3. Orden sugerido de lo que queda

1. **PT-06 + PT-07** — aplicar las migraciones 003 y 004 en el panel de Supabase.
   Es lo único bloqueante y solo lo puede hacer el titular del proyecto.
2. Poblar `businesses.lat/lng` para que las distancias de PT-08 dejen de ser
   aproximadas en los aliados.
3. Traducir a los 10 idiomas las secciones recién montadas, hoy en español fijo.

## 4. Regla de cierre (heredada del roadmap)

Cada PT termina con: `npm run build` → `git add .` → `git commit` → `git push origin main` → reporte.
