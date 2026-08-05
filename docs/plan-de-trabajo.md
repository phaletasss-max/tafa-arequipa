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

### PT-07 — Aplicar `recompensas_catalogo` · 🟡 PENDIENTE

`tafaMasterService.getRecompensasCatalogo()` consulta una tabla inexistente;
PostgREST responde `PGRST205` en cada carga y el catálogo cae siempre al respaldo
hardcodeado.

`database/migrations/003_recompensas_catalogo.sql` crea la tabla, la siembra con
aliados reales y la deja pública de solo lectura. **Es segura de aplicar ya** (solo
agrega). Requiere acceso al panel Supabase del proyecto.

---

### PT-08 — FASE 6: recomendaciones cercanas reales · 🟡 PENDIENTE

Hoy `NEARBY_RECOMMENDATIONS` es una lista fija de cuatro sitios, igual para todos
los QR. El roadmap pide proximidad real. `qr_landing` ya expone `place_lat/lng` y
`business_lat/lng`: calcular distancia y ordenar por cercanía.

---

### PT-09 — Decidir el destino de los componentes huérfanos · 🟡 PENDIENTE

Los 16 componentes de PT-03 pesan en el bundle (`index.js` ≈ 744 kB, sobre el
límite recomendado de 500 kB). Montar los que aporten o eliminarlos, y aplicar
code-splitting por ruta.

---

## 3. Orden sugerido

1. **PT-07** — aplicar migración 003 (rápido, sin riesgo, quita un error recurrente).
2. **PT-06** — Supabase Auth + RLS. Bloquea cualquier uso real con turistas.
3. **PT-08** — recomendaciones por cercanía.
4. **PT-09** — limpieza de bundle.

## 4. Regla de cierre (heredada del roadmap)

Cada PT termina con: `npm run build` → `git add .` → `git commit` → `git push origin main` → reporte.
