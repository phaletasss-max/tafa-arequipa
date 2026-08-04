# Reporte de Auditoría de Imágenes (`docs/image-audit-report.md`)

**Fecha**: 2026-08-04  
**Objetivo**: Identificar asignaciones de imágenes en todos los componentes del sistema, garantizando la regla: **1 atractivo = 1 imagen exclusiva** y **Proyectos en `public/images/projects/` independientes de Atractivos en `public/images/places/`**.

---

## 1. Atractivos Turísticos (`public/images/places/`)

| ID | Lugar | Imagen Actual | Correcta | Acción Requerida |
|---|---|---|---|---|
| 1 | Plaza de Armas de Arequipa | `plaza-de-armas.webp` | Sí | Fotografías HD verificada |
| 2 | Basílica Catedral de Arequipa | `basilica-catedral.webp` | Sí | Fotografías HD verificada |
| 3 | Monasterio de Santa Catalina | `monasterio-santa-catalina.webp` | Sí | Fotografías HD verificada |
| 4 | Iglesia de la Compañía de Jesús | `iglesia-compania.webp` | No | Reemplazar por imagen exclusiva |
| 5 | Barrio San Lázaro | `barrio-san-lazaro.webp` | No | Reemplazar por imagen exclusiva |
| 6 | Mansión del Fundador | `mansion-fundador.webp` | No | Reemplazar por imagen exclusiva |
| 7 | Santo Domingo | `santo-domingo.webp` | No | Reemplazar por imagen exclusiva |
| 8 | Museo Santuarios Andinos | `museo-santuarios-andinos.webp` | No | Reemplazar por imagen exclusiva |
| 9 | Museo Santa Teresa | `museo-santa-teresa.webp` | No | Reemplazar por imagen exclusiva |
| 10 | Mirador de Yanahuara | `mirador-yanahuara.webp` | Sí | Fotografías HD verificada |
| 11 | Mirador de Carmen Alto | `mirador-carmen-alto.webp` | No | Reemplazar por imagen exclusiva |
| 12 | Mirador de Sachaca | `mirador-sachaca.webp` | No | Reemplazar por imagen exclusiva |
| 13 | Cañón del Colca | `canon-colca.webp` | Sí | Fotografías HD verificada |
| 14 | Volcán Misti | `volcan-misti.webp` | Sí | Fotografías HD verificada |
| 15 | Reserva Nacional Salinas y Aguada Blanca | `reserva-salinas.webp` | No | Reemplazar por imagen exclusiva |
| 16 | Laguna de Salinas | `laguna-salinas.webp` | No | Reemplazar por imagen exclusiva |
| 17 | Catarata de Pillones | `pillones.webp` | No | Reemplazar por imagen exclusiva |
| 18 | Bosque de Piedras de Imata | `bosque-imata.webp` | No | Reemplazar por imagen exclusiva |
| 19 | Ruta del Sillar (Añashuayco) | `ruta-sillar.webp` | Sí | Fotografías HD verificada |
| 20 | Petroglifos de Toro Muerto | `toro-muerto.webp` | No | Reemplazar por imagen exclusiva |
| 21 | Valle de los Volcanes de Andagua | `valle-andagua.webp` | No | Reemplazar por imagen exclusiva |
| 22 | Cañón de Cotahuasi | `canon-cotahuasi.webp` | No | Reemplazar por imagen exclusiva |
| 23 | Cuevas de Sumbay | `cuevas-sumbay.webp` | No | Reemplazar por imagen exclusiva |
| 24 | Baños Termales La Calera | `calera.webp` | No | Reemplazar por imagen exclusiva |
| 25 | Baños Termales de Yanque | `yanque-termas.webp` | No | Reemplazar por imagen exclusiva |
| 26 | Baños Termales de Yura | `yura-termas.webp` | No | Reemplazar por imagen exclusiva |
| 27 | Playas de Mejía y Mollendo | `mejia.webp` | No | Reemplazar por imagen exclusiva |
| 28 | Santuario Nacional Lagunas de Mejía | `lagunas-mejia.webp` | No | Reemplazar por imagen exclusiva |
| 29 | Molino de Sabandía | `molino-sabandia.webp` | No | Reemplazar por imagen exclusiva |
| 30 | Mundo Alpaca | `mundo-alpaca.webp` | No | Reemplazar por imagen exclusiva |

---

## 2. Proyectos Estratégicos (`public/images/projects/`)

Los 10 Proyectos Estratégicos reutilizaban anteriormente imágenes de los atractivos en `places/`. Serán migrados a `public/images/projects/` con imágenes independientes:

| ID | Proyecto Estratégico | Ruta Anterior | Ruta Nueva Exclusiva (`projects/`) | Estado |
|---|---|---|---|---|
| 101 | Valle de los Volcanes | `places/proyecto-valle-andagua.webp` | `projects/valle-andagua-project.webp` | Migrar |
| 102 | Petroglifos de Toro Muerto | `places/proyecto-toro-muerto.webp` | `projects/toro-muerto-project.webp` | Migrar |
| 103 | Cañón del Cotahuasi | `places/proyecto-canon-cotahuasi.webp` | `projects/cotahuasi-project.webp` | Migrar |
| 104 | Cataratas de Pillones e Imata | `places/proyecto-pillones-imata.webp` | `projects/pillones-project.webp` | Migrar |
| 105 | Puerto Inka y Quebrada Waca | `places/proyecto-puerto-inka.webp` | `projects/puerto-inka-project.webp` | Migrar |
| 106 | Caleta Quilca y Matarani | `places/proyecto-quilca-matarani.webp` | `projects/quilca-matarani-project.webp` | Migrar |
| 107 | Laguna y Reserva de Salinas | `places/proyecto-laguna-salinas.webp` | `projects/salinas-project.webp` | Migrar |
| 108 | Bosque de Piedras Choqolaqa | `places/proyecto-choqolaqa.webp` | `projects/choqolaqa-project.webp` | Migrar |
| 109 | Represa San José de Uzuña | `places/proyecto-represa-uzuna.webp` | `projects/uzuna-project.webp` | Migrar |
| 110 | Canteras de Sillar Culebrillas | `places/proyecto-culebrillas-sillar.webp` | `projects/culebrillas-project.webp` | Migrar |

---

## 3. Componentes Auditados

1. `src/data/mockData.ts` — Define los 30 atractivos y 10 gastronomías.
2. `src/components/Highlights.tsx` — Consumía proyectos en `places/`. Se actualizará a `projects/`.
3. `src/components/UnexploredRoutes.tsx` — Consumía proyectos en `places/`. Se actualizará a `projects/`.
4. `src/components/ScrollyDestinations.tsx` — Consumidor de destinos principales en `places/`.
5. `src/components/CinematicStoryteller.tsx` — Consumidor de afiches de historias en `places/`.
6. `src/components/stories/HistoricVisualStories.tsx` — Consumidor de historias visuales en `places/`.
