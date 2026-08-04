# TAFA Arequipa — Plan Master de Implementación por Fases

## Contexto Importante

El proyecto TAFA Arequipa ya tiene avances realizados por Copilot y Antigravity. Antes de continuar, no asumir que todo lo anterior fue implementado correctamente. Primero realizar auditoría del estado actual del repositorio.

### Estado Actual:
- **Core Stack**: React + TypeScript + Vite.
- Deploy preparado.
- Git conectado a rama `main`.
- Internacionalización `i18next` implementada parcialmente.
- Accesibilidad WCAG iniciada.
- Explorador turístico creado.
- `mockData` de atractivos creado.
- Sistema modular por features iniciado.

**No comenzar nuevas funcionalidades todavía.**

La prioridad es:

---

## FASE 0 — Auditoría y estabilización del estado actual

Antes de modificar código, revisar:
- `src/`
- `public/`
- `components/`
- `features/`
- `data/`
- `locales/`

### Confirmar:
1. Estado de build: `npm run build`
2. Estado git: `git status` / `git log --oneline -5`
3. Revisar errores TypeScript.
4. Revisar imágenes faltantes.
5. Revisar referencias rotas.

### Crear documento:
`docs/current-state-audit.md`

Debe contener:
- Qué está terminado.
- Qué está incompleto.
- Qué archivos están involucrados.
- Qué riesgos existen.

*No avanzar hasta tener este reporte.*

---

## FASE 1 — Finalización completa del sistema de imágenes

**Esta fase es PRIORIDAD MÁXIMA.**
*No avanzar a login, QR, IA ni reservas hasta terminar esto.*

### Objetivo:
Cada atractivo turístico debe tener una imagen única, correcta y profesional.

- **Ruta final**: `public/images/places/`
- **Formato**: `.webp`
- Cada tarjeta debe apuntar a su imagen correcta.

### Lista obligatoria de imágenes (validar estas):
1. `plaza-de-armas.webp`
2. `basilica-catedral.webp`
3. `monasterio-santa-catalina.webp`
4. `iglesia-compania.webp`
5. `barrio-san-lazaro.webp`
6. `mansion-fundador.webp`
7. `santo-domingo.webp`
8. `museo-santuarios-andinos.webp`
9. `museo-santa-teresa.webp`
10. `mirador-yanahuara.webp`
11. `mirador-carmen-alto.webp`
12. `mirador-sachaca.webp`
13. `canon-colca.webp`
14. `volcan-misti.webp`
15. `reserva-salinas.webp`
16. `laguna-salinas.webp`
17. `pillones.webp`
18. `bosque-imata.webp`
19. `ruta-sillar.webp`
20. `toro-muerto.webp`
21. `valle-andagua.webp`
22. `canon-cotahuasi.webp`
23. `cuevas-sumbay.webp`
24. `calera.webp`
25. `yanque-termas.webp`
26. `yura-termas.webp`
27. `mejia.webp`
28. `lagunas-mejia.webp`
29. `molino-sabandia.webp`
30. `mundo-alpaca.webp`

### Regla importante:
NO aceptar:
- Imágenes repetidas.
- Placeholders.
- Imágenes genéricas.
- Imágenes de otro atractivo.

Si una imagen no existe, crear registro pendiente en `docs/image-missing-report.md` con:
- Nombre
- Ubicación
- Descripción necesaria
- Estado

### Metadatos:
Mantener `imagen_meta`:
```typescript
{
  source: string;
  license: string;
  photographer: string | null;
  generated: boolean;
}
```
- Si es IA: `generated: true`
- Si es fotografía: `generated: false`

### Verificación visual:
Crear checklist en `docs/image-verification.md`

| Lugar | Imagen | Correcta |
|---|---|---|
| Plaza de Armas | `plaza-de-armas.webp` | ✅ |
| Colca | `canon-colca.webp` | ✅ |

---

## FASE 2 — Corrección final de Accesibilidad

*(Después de imágenes)*

Completar barra superior (debe funcionar realmente):
- Idioma
- Tamaño texto (A, A+, A++)
- Alto contraste
- Modo visual
- Lengua de señas
- Lector de pantalla

Actualmente existen botones pero algunos son solamente visuales.

### Implementar:
`src/features/accessibility/`

### Debe cumplir:
WCAG 2.2 AA.

### Agregar:
- `aria-label`
- Keyboard navigation
- Focus visible
- Anuncios `aria-live`
- Persistencia `localStorage`

---

## FASE 3 — Sistema de Usuario Turista

Implementar login funcional.

- **Tecnología**: Supabase Auth
- **Crear**: `features/auth/`

### Funciones:
- **Registro**: Nombre, Correo, Password, País, Idioma preferido.
- **Login**: Email/password, Google OAuth preparado.
- **Perfil**:
```text
Turista
├── nombre
├── puntos TAFA
├── rutas completadas
├── lugares visitados
└── recompensas
```

---

## FASE 4 — Sistema QR Inteligente para aliados turísticos

### Crear arquitectura:
`features/qr/`

### Objetivo:
Cada aliado tendrá un QR único. Ejemplo: `TAFA.COM/qr/picanteria-001`

#### Cuando turista escanea:

**Caso 1: Usuario logueado**
- Mostrar información del local, historia, platos, ubicación, recomendaciones cercanas.
- Agregar puntos: **+50 puntos TAFA**
- Guardar en `activity_log`

**Caso 2: Usuario NO logueado**
- Mostrar: "Para registrar esta experiencia y recibir puntos TAFA inicia sesión"
- Después del login: Registrar actividad.

### Base de datos Supabase:
Crear tablas:
- `partners` (`id`, `name`, `category`, `location`, `description`, `qr_code`, `image`, `created_at`)
- `partner_menu` (`id`, `partner_id`, `dish_name`, `description`, `price`, `image`)
- `tourist_activity` (`id`, `user_id`, `partner_id`, `points`, `created_at`)

---

## FASE 5 — Aliados turísticos

Registrar inicialmente:
- **Gastronomía**: Sociedad Picantera de Arequipa, Asociación Gastronómica de Arequipa (AGAR).
- **Hoteles y restaurantes**: Asociación de Hoteles, Restaurantes y Afines de Arequipa.
- **Guiado turístico**: ADEGOPA, AGOTUR, ASGUIPA.
- **Agencias**: AVIT.
- **Profesionales turismo**: COLITUR Arequipa.

### Crear:
`features/partners/`

Cada aliado tendrá: perfil, QR, ubicación, información, contacto.

---

## FASE 6 — Restaurantes y recomendaciones cercanas

Cuando usuario escanee QR de Picantería X:
- Mostrar Historia.
- Platos destacados (Rocoto relleno, Adobo arequipeño, Chupe de camarones).
- Cerca de ti (Plaza de Armas, Museo, Mirador).
- Integrar posteriormente: mapas, geolocalización, rutas.

---

## FASE 7 — Documentación obligatoria

Cada fase debe crear/actualizar en `docs/`:
- `architecture.md`
- `database-schema.md`
- `accessibility.md`
- `image-system.md`
- `qr-system.md`
- `changelog.md`

*No hacer cambios grandes sin actualizar documentación.*

---

## Orden Obligatorio de Ejecución

1. Auditoría actual (`FASE 0`).
2. Terminar imágenes (`FASE 1`).
3. Confirmar build (`npm run build`).
4. Commit (`git add . && git commit`).
5. Push (`git push origin main`).
6. Reporte.
7. Recién continuar accesibilidad (`FASE 2`).
8. Luego login (`FASE 3`).
9. Luego QR (`FASE 4`).
10. Luego aliados (`FASE 5`).

### Importante:
- No intentar completar todo en una sola ejecución.
- Trabajar en entregables pequeños.
- Cada fase debe terminar con: `npm run build` → `git add .` → `git commit` → `git push origin main` → Entregar reporte antes de continuar.
