# TAFA Arequipa — Esquema de Base de Datos

**Motor**: PostgreSQL 17 (Supabase)
**Actualizado**: 2026-08-05

## 1. Archivos fuente

| Archivo | Contenido |
|---------|-----------|
| `database/supabase_clean_mvp_schema.sql` | Esquema base MVP (18 tablas) |
| `database/migrations/002_qr_checkin_system.sql` | QR, visitas y vista `qr_landing` |
| `database/migrations/003_recompensas_catalogo.sql` | Catálogo de recompensas — **pendiente de aplicar** |
| `database/migrations/004_rls_hardening.sql` | Endurecimiento RLS — **pendiente, ver PT-06** |

> `supabase_clean_mvp_schema.sql` está duplicado en la raíz del repositorio.
> La copia canónica es la de `database/`.

## 2. Tablas

### Identidad y turista
| Tabla | Rol |
|-------|-----|
| `profiles` | Turista: email, documento, Pase Explorador, puntos, lugares visitados |
| `travel_profiles` | Preferencias de viaje |
| `accessibility_preferences` | Ajustes de accesibilidad persistidos |

### Catálogo turístico
| Tabla | Rol |
|-------|-----|
| `places` | 30 atractivos del departamento |
| `districts`, `categories` | Taxonomía geográfica y temática |
| `place_media` | Fotografías asociadas |
| `routes`, `route_places` | Rutas turísticas y sus paradas |

### Aliados
| Tabla | Rol |
|-------|-----|
| `businesses` | 28 aliados (picanterías, hoteles, agencias, cultura) |
| `business_categories` | Clasificación de aliados |
| `applications` | Solicitudes de adhesión al ecosistema |

### Gamificación
| Tabla | Rol |
|-------|-----|
| `qr_codes` | Un QR único por lugar o negocio, con puntos y contador de escaneos |
| `visit_logs` | Visitas acreditadas — `UNIQUE(profile_id, qr_code_id, visit_date)` |
| `rewards`, `user_rewards` | Recompensas y canjes |
| `recompensas_catalogo` | Catálogo canjeable (migración 003) |

### Otros
`reviews`, `itineraries`, `system_settings`.

## 3. Vista `qr_landing`

Unifica lugares y negocios en una sola fila por slug, para que la página de
check-in haga una única consulta:

```sql
SELECT * FROM qr_landing WHERE slug = $1 AND is_active;
```

Expone `entity_type` (`'place' | 'business'`), `effective_points`, los campos
`place_*` o `business_*` según corresponda, y `scan_count`.

## 4. Convención de slugs ⚠️

Los slugs se generan desde el **nombre oficial completo**, y los negocios llevan
prefijo `aliado-`:

| Entidad | Slug en base |
|---------|--------------|
| Plaza de Armas | `plaza-de-armas-de-arequipa` |
| Monasterio de Santa Catalina | `monasterio-de-santa-catalina` |
| La Nueva Palomino | `aliado-la-nueva-palomino` |

Los primeros carteles se imprimieron con slugs cortos (`plaza-de-armas`). Para no
invalidarlos, `src/services/checkInService.ts` mantiene `LEGACY_SLUG_ALIASES`.

**Al dar de alta un aliado nuevo: usar siempre el slug generado por la base y
tomarlo del Estudio QR, que lee `qr_landing` directamente.**

## 5. Estado de seguridad (RLS) 🔴

Verificado el 2026-08-05 con la clave anónima pública del bundle:

| Tabla | Anon SELECT | Anon UPDATE | Riesgo |
|-------|-------------|-------------|--------|
| `profiles` | Permitido | Permitido | Email y documento de todos los turistas expuestos; saldos de puntos reescribibles |
| `visit_logs` | Permitido | — | Historial de visitas legible |
| `places`, `businesses`, `qr_landing` | Permitido | — | Correcto: son catálogo público |

La migración `004_rls_hardening.sql` corrige lo anterior, pero **no puede
aplicarse aislada**: el flujo de sesión actual escribe en `profiles` sin sesión
autenticada y dejaría de funcionar. Debe desplegarse junto con la migración a
Supabase Auth (PT-06).

## 6. Función `register_qr_checkin`

Acredita puntos de forma atómica. La versión endurecida (migración 004) corre
como `SECURITY DEFINER`, toma la identidad de `auth.uid()` en lugar de recibirla
como parámetro, respeta el tope diario de 500 puntos y una acreditación por QR y
día. Así el cliente nunca escribe puntos directamente.
