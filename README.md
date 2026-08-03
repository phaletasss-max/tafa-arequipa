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

## Próximos pasos

- [ ] Reemplazar video con producción cinematográfica de Arequipa (Veo 3)
- [ ] Conectar Hero card a API de búsqueda
- [ ] Integrar mapa real con Leaflet.js / API dashboard TAFA
- [ ] Autenticación con Supabase Auth
- [ ] Conectar endpoints Express del backend TAFA

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
