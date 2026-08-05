# TAFA Arequipa — Arquitectura

**Actualizado**: 2026-08-05

## 1. Panorama

Aplicación de una sola página (SPA) sin backend propio: el navegador habla
directamente con Supabase (PostgREST + RPC). El despliegue es estático en Vercel.

```
Navegador (React 18 + Vite)
   │
   ├── supabase-js ──► Supabase / PostgreSQL 17
   │                     ├── tablas del catálogo (places, businesses, qr_codes)
   │                     ├── vista qr_landing (lectura unificada del QR)
   │                     └── RPC register_qr_checkin (acredita puntos)
   │
   └── Gemini 1.5 Flash ──► clave aportada por el usuario en runtime
```

No hay servidor intermedio. **Toda regla de seguridad vive en las políticas RLS
de Supabase** — ver `docs/database-schema.md` §4 y el PT-06 del plan de trabajo.

## 2. Estructura de carpetas

```
src/
├── App.tsx                 Router + modales globales
├── components/             Secciones de la landing
│   ├── ai/                 Asistente turístico (Gemini)
│   ├── auth/               AuthModal
│   ├── ecosystem/          Adhesión de aliados (JoinEcosystem)
│   ├── rewards/            Pase Explorador TAFA
│   └── safety/             Banner de seguridad al visitante
├── features/               Módulos por dominio
│   ├── accessibility/      Contexto WCAG, síntesis de voz, modo no visual
│   ├── partners/           FASE 5 — directorio de aliados
│   └── qr/                 FASE 4 — check-in y estudio de carteles
├── services/               Acceso a datos y lógica de negocio
├── lib/                    Cliente Supabase e i18n
├── locales/                10 idiomas × 6 namespaces
└── data/                   mockData de atractivos
```

**Convención**: `components/` son piezas de presentación de la landing;
`features/` agrupa dominios completos (UI + servicio + tipos) y es donde debe
crecer el producto.

## 3. Enrutamiento

| Ruta | Componente | Notas |
|------|-----------|-------|
| `/` | `LandingPage` | Hero cinematográfico, destacados, aliados, asistente IA |
| `/qr/:slug` | `QRCheckInPage` | Destino de los carteles QR físicos |
| `/aliados/:slug` | `QRCheckInPage` | Alias legible del anterior |
| `*` | `LandingPage` | Fallback SPA (`vercel.json` reescribe todo a `index.html`) |

## 4. Capa de datos

| Servicio | Responsabilidad |
|----------|----------------|
| `checkInService` | Resolución de slug, ficha del QR y registro de visita |
| `authService` | Sesión del turista (hoy en `localStorage` — ver PT-06) |
| `partnersService` | Directorio de aliados desde `qr_landing` y cercanía (`fetchNearby`) |
| `tafaMasterService` | Catálogos maestros y recompensas |
| `placeTranslationService` | Traducción de atractivos a 10 idiomas |
| `supabaseService` | Consultas genéricas |

**Patrón transversal**: ningún servicio lanza excepciones hacia la UI. Ante un
fallo de red o RLS devuelven un catálogo de respaldo y registran `console.warn`.
Esto mantiene la landing utilizable sin conexión, pero exige distinguir el dato
real del de respaldo: por eso `CheckInResult.persisted` marca si la visita llegó
realmente a la base.

## 5. Accesibilidad

`AccessibilityProvider` centraliza tamaño de fuente, alto contraste, lectura por
voz (Web Speech API) y modo no visual, con persistencia en `localStorage`.
Detalle en `docs/accessibility.md`.

## 6. Internacionalización

`i18next` con detección de idioma del navegador y carga diferida por namespace
en 10 idiomas: es, en, fr, pt, de, it, ja, ko, nl, zh.

| Namespace | Cubre |
|-----------|-------|
| `common` | Etiquetas transversales, pie de página, diagnóstico y proyecto |
| `navigation` | Barra superior |
| `hero` | Capítulos del hero cinematográfico |
| `explorer` | Explorador de atractivos |
| `forms` | Formularios (postulación de aliados, encuesta) |
| `modals` | Diálogos |
| `accessibility` | Controles de accesibilidad |
| `sections` | Secciones de la landing y páginas QR (PT-11) |

**Paridad**: los 8 namespaces existen completos en los 10 idiomas (4.360
cadenas). El español es la fuente de verdad y el respaldo: si faltara una clave,
`loadNamespaceResources` cae a `es` en vez de mostrar la clave cruda.

**Regla**: el texto se traduce en la capa de presentación, no en la de datos.
Los servicios devuelven claves o discriminantes (`distanceKind`, `category`) y
el componente elige la frase — un servicio no conoce el idioma activo.

## 7. Configuración

Variables `VITE_*` (ver `.env.example`). Se incrustan en el bundle del navegador:
nunca deben contener secretos de servidor. La `service_role` key de Supabase no
debe aparecer jamás en este repositorio.

## 8. Carga diferida

El bundle principal quedó en ~113 kB (antes 744 kB):

- `React.lazy` para la ruta `/qr/:slug`, para las secciones por debajo del primer
  pantallazo y para los modales, que solo se montan al abrirse.
- `manualChunks` en `vite.config.ts` separa las librerías (React, Framer Motion,
  Supabase, i18next, lucide) para que se cacheen entre despliegues.

Abrir un modal diferido desde un clic es una actualización síncrona que suspende,
y React la rechaza; por eso las aperturas van envueltas en `startTransition`.

## 9. Deuda técnica conocida

- Las políticas RLS de la migración 004 siguen sin aplicarse: hasta entonces los
  perfiles son legibles y modificables con la clave anónima pública (PT-06).
- `businesses.lat/lng` sigue vacío en la base hasta aplicar la migración 005; con
  ella, 23 de 28 aliados pasan a tener coordenadas reales y 5 se seguirán
  aproximando por distrito.
- `services/api.ts` apunta a un backend Express (`/api/...`) que no existe en
  este repositorio. `SurveyModal` depende de él y por eso no está montado.
- No se pudo verificar la animación de entrada al hacer scroll (`useInView`):
  ver `plan-de-trabajo.md` §4.
