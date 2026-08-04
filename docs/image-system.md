# Documentación del Sistema Definido de Imágenes (`docs/image-system.md`)

**Proyecto**: TAFA Arequipa  
**Regla Principal**: **1 Atractivo = 1 Imagen Exclusiva**. Los Proyectos Estratégicos usan imágenes independientes alojadas en `public/images/projects/`.

---

## 1. Arquitectura de Directorios

```text
public/images/
├── places/                <- 30 Atractivos Turísticos Reales (slugs oficiales .webp)
│   ├── plaza-de-armas.webp
│   ├── basilica-catedral.webp
│   ├── monasterio-santa-catalina.webp
│   ├── iglesia-compania.webp
│   ├── barrio-san-lazaro.webp
│   ├── mansion-fundador.webp
│   ├── santo-domingo.webp
│   ├── museo-santuarios-andinos.webp
│   ├── museo-santa-teresa.webp
│   ├── mirador-yanahuara.webp
│   ├── mirador-carmen-alto.webp
│   ├── mirador-sachaca.webp
│   ├── canon-colca.webp
│   ├── volcan-misti.webp
│   ├── reserva-salinas.webp
│   ├── laguna-salinas.webp
│   ├── pillones.webp
│   ├── bosque-imata.webp
│   ├── ruta-sillar.webp
│   ├── toro-muerto.webp
│   ├── valle-andagua.webp
│   ├── canon-cotahuasi.webp
│   ├── cuevas-sumbay.webp
│   ├── calera.webp
│   ├── yanque-termas.webp
│   ├── yura-termas.webp
│   ├── mejia.webp
│   ├── lagunas-mejia.webp
│   ├── molino-sabandia.webp
│   └── mundo-alpaca.webp
│
└── projects/              <- 10 Proyectos Estratégicos de Innovación Regional (slugs *-project.webp)
    ├── valle-andagua-project.webp
    ├── toro-muerto-project.webp
    ├── cotahuasi-project.webp
    ├── pillones-project.webp
    ├── puerto-inka-project.webp
    ├── quilca-matarani-project.webp
    ├── salinas-project.webp
    ├── choqolaqa-project.webp
    ├── uzuna-project.webp
    └── culebrillas-project.webp
```

---

## 2. Modelo de Metadatos de Trazabilidad (`ImageMeta`)

```typescript
export interface ImageMeta {
  url: string;
  source: string;
  license?: string;
  photographer?: string | null;
  generated: boolean;
}
```

- **Si es IA / Render fotorrealista**: `generated: true`
- **Si es fotografía oficial**: `generated: false`
- **Trazabilidad**: Permite auditar la fuente oficial (DIRCETUR, MINCETUR, SERNANP, AUTOCOLCA) y los derechos de uso.

---

## 3. Matriz de Mapeo en Componentes

| Componente | Tipo de Consumo | Ruta Raíz |
|------------|-----------------|-----------|
| [mockData.ts](file:///g:/turiston/tafa-arequipa/src/data/mockData.ts) | Atractivos | `/images/places/` |
| [Highlights.tsx](file:///g:/turiston/tafa-arequipa/src/components/Highlights.tsx) | Proyectos Estratégicos | `/images/projects/` |
| [UnexploredRoutes.tsx](file:///g:/turiston/tafa-arequipa/src/components/UnexploredRoutes.tsx) | Proyectos Estratégicos | `/images/projects/` |
| [ScrollyDestinations.tsx](file:///g:/turiston/tafa-arequipa/src/components/ScrollyDestinations.tsx) | Destinos Principales | `/images/places/` |
| [CinematicStoryteller.tsx](file:///g:/turiston/tafa-arequipa/src/components/CinematicStoryteller.tsx) | Historias Visuales | `/images/places/` |
| [HistoricVisualStories.tsx](file:///g:/turiston/tafa-arequipa/src/components/stories/HistoricVisualStories.tsx) | Historias Visuales | `/images/places/` |
