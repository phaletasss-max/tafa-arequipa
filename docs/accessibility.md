# FASE 2 — Documentación de Accesibilidad (WCAG 2.2 AA)

**Proyecto**: TAFA Arequipa  
**Módulo**: `src/features/accessibility/`  
**Estado**: 🟢 100% Funcional e Implementado

---

## 1. Controles y Funcionalidades Reales

| Control | Mecanismo de Acción | Persistencia / Efecto DOM |
|---------|----------------------|----------------------------|
| **Idioma (10 lenguajes)** | Selector desplegable dinámico (`LanguageSelector.tsx`) | `i18n.changeLanguage()`, persiste en `localStorage` (`tafa_accessibility_settings`). |
| **Tamaño de Texto (A / A+ / A++)** | Botón cíclico (`cycleFontScale`) | Modifica clases de la raíz `html`: `.font-scale-large` (115%), `.font-scale-extralarge` (130%). Persiste en `localStorage`. |
| **Alto Contraste WCAG AAA** | Botón Toggle (`toggleHighContrast`) | Conmuta clase `.wcag-high-contrast` en `document.documentElement` y `document.body` (fondo `#000`, texto `#fff`, filtro de contraste y bordes de enfoque `#ffff00`). |
| **Modo Discapacidad Visual** | Botón Toggle (`toggleVisualMode`) | Conmuta clase `.visual-mode-active` en `document.documentElement` (desactiva animaciones/transiciones, amplía interlineado a 1.8 y espaciado de letras). |
| **Lengua de Señas** | Botón modal (`SignLanguageButton.tsx`) | Despliega intérprete virtual en Lengua de Señas Peruana (LSP). |
| **Lector de Pantalla / Audioruta por Voz** | Botón Toggle (`toggleScreenReader`) | Activa el sintetizador de voz Web Speech API (`window.speechSynthesis`) para narrar el contenido accesible en el idioma seleccionado. |

---

## 2. Cumplimiento WCAG 2.2 AA

1. **Criterio 2.4.1 (Saltar bloques / Skip to Content)**:
   - Enlace `Saltar al contenido principal` integrado en `QuickAccessBar.tsx`, visible únicamente al presionar `Tab`.

2. **Criterio 2.4.7 (Focus Visible)**:
   - Anillos de enfoque mejorados en `index.css` (`outline: 3px solid #c0392b; outline-offset: 3px;`).
   - En modo alto contraste, los elementos enfocados muestran un borde amarillo fluorescente `outline: 3px solid #ffff00`.

3. **Criterio 4.1.3 (Mensajes de Estado / ARIA-Live)**:
   - Región ARIA-live implementada en `AccessibilityProvider`: `<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">`. Anuncia cambios de idioma, contraste y tamaño de fuente en tiempo real a los lectores de pantalla (NVDA, JAWS, VoiceOver).

4. **Persistencia y Estado Global**:
   - Todo el estado se persiste en `localStorage.getItem('tafa_accessibility_settings')` y se rehidrata automáticamente en el arranque de la aplicación.
