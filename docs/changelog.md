# Changelog — TAFA Arequipa

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [No publicado] — 2026-08-05

Auditoría del repositorio contra `docs/master-roadmap.md` y cierre de las fases
pendientes. Detalle y estado en `docs/plan-de-trabajo.md`.

### Corregido

- **Página QR caída (crítico)**. `QRCheckInPage` declaraba cinco `useState`
  después de sus `return` condicionales, violando las Rules of Hooks. Al pasar de
  `loading` a `ready` React abortaba con *"Rendered more hooks than during the
  previous render"* y **toda ruta `/qr/:slug` quedaba en blanco**.
- **Los QR no registraban visitas (crítico)**. Los carteles usaban slugs cortos
  (`plaza-de-armas`) y la base usa el nombre oficial con prefijo `aliado-` para
  negocios. Ninguna ficha se encontraba y el check-in devolvía puntos inventados
  sin escribir nada. Añadida la tabla `LEGACY_SLUG_ALIASES` y el envío del slug
  canónico al RPC.
- **Confirmaciones engañosas**. Ante un fallo de escritura, la app afirmaba
  "visita confirmada" con un total de 150 puntos fijo. Ahora `CheckInResult`
  incluye `persisted` y la UI advierte que el registro está pendiente.
- Import muerto de `Hero` en `App.tsx` (lo sustituyó `CinematicStoryteller`).

### Añadido

- **FASE 5 — `src/features/partners/`**: directorio público de aliados con
  filtros por categoría, gremios (Sociedad Picantera, AGAR, AHORA, AVIT,
  COLITUR) y enlace a la ruta QR de cada socio. Carga 28 aliados reales.
- El Estudio QR lee su catálogo de `qr_landing` y avisa si el slug escrito a mano
  no existe, evitando imprimir carteles muertos.
- Configuración por variables de entorno (`VITE_SUPABASE_URL`,
  `VITE_SUPABASE_ANON_KEY`, `VITE_PUBLIC_SITE_URL`) con `.env.example` y tipado
  en `vite-env.d.ts`. Se conservan los valores del MVP como respaldo.
- `database/migrations/003_recompensas_catalogo.sql`: crea la tabla que
  `tafaMasterService` consultaba sin existir (error `PGRST205` recurrente).
- `database/migrations/004_rls_hardening.sql`: políticas RLS y RPC de check-in
  con `SECURITY DEFINER`. **Pendiente de aplicar junto con PT-06.**
- **FASE 7 — documentación**: `architecture.md`, `database-schema.md`,
  `qr-system.md`, `changelog.md` y `plan-de-trabajo.md`.
- `.gitignore` ahora excluye archivos `.env`.

### Seguridad

- **Cerrada la suplantación de cuentas (PT-06)**. `registerOrLoginProfile`
  identificaba al turista solo por su email: escribir el correo de otra persona
  bastaba para entrar en su cuenta y sus puntos. Sustituido por Supabase Auth
  con email y contraseña (`signUpTourist`, `signInTourist`), con
  `profiles.id` ligado a `auth.users.id` y Google OAuth preparado.
- La sesión se rehidrata desde Supabase al arrancar, en vez de confiar en una
  caché de `localStorage` que podía sobrevivir a una sesión expirada.
- Documentado que la clave anónima pública permite todavía **leer el email y el
  número de documento de todos los turistas** y **modificar cualquier perfil**.
  Lo corrige la migración 004, **pendiente de aplicar en el panel de Supabase**.

---

## Historial previo

Ver `git log`. Hitos: arquitectura modular por features, sistema unificado de
imágenes en `public/images/places/`, accesibilidad WCAG 2.2 con modo no visual,
i18n en 10 idiomas, asistente IA con Gemini 1.5 Flash y rutas públicas QR.
