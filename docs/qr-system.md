# TAFA Arequipa — Sistema QR Inteligente (FASE 4)

**Actualizado**: 2026-08-05

## 1. Objetivo

Cada atractivo y cada aliado tiene un QR único impreso en el local. Al escanearlo,
el turista ve la ficha oficial del sitio y acredita Puntos TAFA en su Pase Explorador.

## 2. Flujo

```
Turista escanea el cartel
        │
        ▼
GET /qr/:slug ──► QRCheckInPage
        │
        ├── resolveSlug(slug)      alias de carteles antiguos → slug canónico
        ├── getQRLanding(slug)     vista qr_landing (o mock si no hay red)
        │
        ├── ¿Con sesión? ──► SÍ ──► register_qr_checkin ──► +50 pts
        │                    │
        │                    └── NO ──► AuthModal
        │                                 └── al volver, check-in pendiente
        │                                     (sessionStorage) se ejecuta solo
        ▼
Confirmación + reseña opcional (7 días) + aliados cercanos
```

## 3. Piezas

| Archivo | Rol |
|---------|-----|
| `src/features/qr/QRCheckInPage.tsx` | Página de destino del escaneo |
| `src/features/qr/QRStudioModal.tsx` | Genera e imprime los carteles físicos |
| `src/services/checkInService.ts` | Resolución de slug, ficha y registro |
| `database/migrations/002_qr_checkin_system.sql` | `qr_codes`, `visit_logs`, `qr_landing` |

## 4. Slugs y compatibilidad

La base usa el nombre oficial completo y prefija los negocios con `aliado-`
(ver `docs/database-schema.md` §4). Los primeros carteles se imprimieron con
slugs cortos, así que `LEGACY_SLUG_ALIASES` traduce los heredados.

`getQRLanding` intenta, en orden:

1. El slug canónico según la tabla de alias.
2. El slug tal cual (por si ya era canónico y no está en la tabla).
3. El catálogo mock local, como último recurso sin conexión.

**El Estudio QR carga sus opciones de `qr_landing`**, de modo que no puede
generar un cartel apuntando a un slug inexistente. Si se escribe un slug manual
que no está en el catálogo, el Estudio lo advierte antes de imprimir.

## 5. Reglas de acreditación

| Regla | Valor |
|-------|-------|
| Puntos por visita | 50 (configurable en `qr_codes.points_reward`) |
| Máximo por QR | Una acreditación por día (`UNIQUE` en `visit_logs`) |
| Tope diario | 500 puntos (`daily_cap_reached`) |
| Bono de bienvenida | 100 puntos al registrarse |

## 6. Resultados de check-in

`CheckInResult.persisted` distingue el registro real del local:

| `persisted` | Significado | UI |
|-------------|-------------|-----|
| `true` | La visita quedó en `visit_logs` | Confirmación y total acumulado |
| `false` | No hubo escritura (sin red, RLS o perfil solo local) | Avisa que el registro está pendiente de sincronizar |

Esto evita el comportamiento anterior, en el que un fallo de red devolvía un
total de puntos inventado y el turista creía tener un saldo inexistente.

## 7. Impresión de carteles

El Estudio genera el QR mediante `api.qrserver.com` sobre la URL
`${VITE_PUBLIC_SITE_URL}/qr/:slug`, con descarga PNG e impresión directa.

> Dependencia externa: si se requiere generación sin terceros (por privacidad o
> por uso sin conexión), sustituir por una librería local como `qrcode`.

## 8. Alta de un aliado nuevo

1. Insertar la fila en `businesses` con su `slug`.
2. Insertar el `qr_codes` correspondiente (la migración 002 trae la semilla).
3. Verificar que aparece en `qr_landing`.
4. Generarlo desde el Estudio QR — ya figurará en el desplegable.
5. Añadir su categoría en `CATEGORY_BY_SLUG` (`features/partners/partnersService.ts`)
   mientras `businesses.category_id` siga vacío.
