# TAFA — Frontend Landing

**Turismo Arequipa: Fragmentado → Accesible**

Landing page oficial construida con React + TypeScript + Vite + Tailwind CSS + Framer Motion.

## Stack

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool + HMR |
| Tailwind CSS | 3.x | Utility-first CSS |
| Framer Motion | 11.x | Animations |
| Lucide React | latest | Icons |

## Comandos

```bash
npm install      # instalar dependencias
npm run dev      # servidor local → localhost:5173
npm run build    # build producción
npm run preview  # previsualizar build
```

## Estructura de Componentes

```
src/
├── App.tsx                    # Composición de secciones
├── main.tsx                   # Entry point
├── index.css                  # Tailwind + Design tokens
└── components/
    ├── Hero.tsx               # Video bg + glass card + nav
    ├── Problem.tsx            # Diagnóstico del problema
    ├── Features.tsx           # 6 servicios principales
    ├── MapPreview.tsx         # Mock mapa interactivo
    ├── Highlights.tsx         # Lugares destacados
    ├── Stats.tsx              # Contadores animados
    ├── Institutions.tsx       # Fuentes institucionales
    ├── CTA.tsx                # Llamado a la acción
    └── Footer.tsx             # Footer institucional
```

## Configuración

Copiar `.env.example` a `.env.local` y completar las variables `VITE_*`.
Sin ellas la app usa los valores del proyecto MVP como respaldo.

## Documentación

| Documento | Contenido |
|---|---|
| [`docs/plan-de-trabajo.md`](docs/plan-de-trabajo.md) | **Estado real y trabajo pendiente** |
| [`docs/architecture.md`](docs/architecture.md) | Arquitectura y capas |
| [`docs/database-schema.md`](docs/database-schema.md) | Esquema Supabase y estado de RLS |
| [`docs/qr-system.md`](docs/qr-system.md) | Sistema QR y convención de slugs |
| [`docs/accessibility.md`](docs/accessibility.md) | Accesibilidad WCAG 2.2 |
| [`docs/image-system.md`](docs/image-system.md) | Sistema de imágenes |
| [`docs/changelog.md`](docs/changelog.md) | Historial de cambios |

## Próximos pasos

- [ ] **Aplicar `database/migrations/004_rls_hardening.sql`** (PT-06 — el
      frontend ya usa Supabase Auth; hasta aplicarla los perfiles siguen siendo
      legibles y modificables con la clave anónima pública)
- [ ] Aplicar `database/migrations/003_recompensas_catalogo.sql` (PT-07)
- [ ] Recomendaciones cercanas por geolocalización real (PT-08)
- [ ] Code-splitting y limpieza de componentes huérfanos (PT-09)
- [ ] Integrar mapa real con Leaflet.js

## Brandbook

| Token | Valor | Uso |
|---|---|---|
| `tafa-volcán` | `#c0392b` | Primary / CTA |
| `tafa-lava` | `#e74c3c` | Hover state |
| `tafa-dark` | `#0a0a0a` | Dark sections |
| `tafa-text` | `#1a1a1a` | Body text |
| `tafa-muted` | `#767676` | Secondary text |
| `tafa-andino` | `#27ae60` | Success / Verified |
| `tafa-cielo` | `#2980b9` | Map / Info |
| `tafa-oro` | `#f39c12` | Warnings / Gastro |

## Fuentes tipográficas

- **Outfit** — UI principal (cuerpo, botones, títulos)
- **Special Elite** — Logotipo wordmark únicamente
