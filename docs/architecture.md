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
│   ├── ai/                 Asistente turístico (Gemini) y conversación directa
│   ├── auth/               AuthModal
│   ├── accessibility/      Barra heredada
│   ├── ecosystem/          Adhesión de aliados
│   ├── rewards/            Pase Explorador TAFA
│   ├── safety/             Banner de emergencia
│   └── stories/            Relatos visuales históricos
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
| `partnersService` | Directorio de aliados desde `qr_landing` |
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
(`common`, `navigation`, `hero`, `explorer`, `forms`, `modals`, `accessibility`)
en 10 idiomas: es, en, fr, pt, de, it, ja, ko, nl, zh.

## 7. Configuración

Variables `VITE_*` (ver `.env.example`). Se incrustan en el bundle del navegador:
nunca deben contener secretos de servidor. La `service_role` key de Supabase no
debe aparecer jamás en este repositorio.

## 8. Deuda técnica conocida

- Bundle principal ≈ 744 kB (sobre el umbral de 500 kB): falta code-splitting por
  ruta y hay 16 componentes construidos pero nunca montados (PT-09).
- La sesión del turista no usa Supabase Auth (PT-06).
- Las recomendaciones cercanas son estáticas pese a existir coordenadas (PT-08).
