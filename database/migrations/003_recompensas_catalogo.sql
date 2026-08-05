-- ============================================================================
-- TAFA MVP — Catálogo de recompensas canjeables con Puntos TAFA
-- Ejecutar DESPUÉS de 002_qr_checkin_system.sql
--
-- Motivo: `src/services/tafaMasterService.ts` consulta `recompensas_catalogo`,
-- pero la tabla no existe en la base. PostgREST responde PGRST205 y la app
-- cae siempre al catálogo hardcodeado de respaldo.
-- Esta migración es segura de aplicar de inmediato (solo agrega y lee).
-- ============================================================================

CREATE TABLE IF NOT EXISTS recompensas_catalogo (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  negocio_aliado_id  UUID REFERENCES businesses(id) ON DELETE CASCADE,
  titulo             TEXT NOT NULL,
  descripcion        TEXT,
  puntos_requeridos  INTEGER NOT NULL CHECK (puntos_requeridos > 0),
  stock_disponible   INTEGER NOT NULL DEFAULT 0 CHECK (stock_disponible >= 0),
  activo             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recompensas_activo
  ON recompensas_catalogo(activo) WHERE activo;
CREATE INDEX IF NOT EXISTS idx_recompensas_negocio
  ON recompensas_catalogo(negocio_aliado_id);

-- ── RLS: el catálogo es público de solo lectura ─────────────────────────────
ALTER TABLE recompensas_catalogo ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS recompensas_public_read ON recompensas_catalogo;
CREATE POLICY recompensas_public_read
  ON recompensas_catalogo
  FOR SELECT
  TO anon, authenticated
  USING (activo);

-- Sin políticas de INSERT/UPDATE/DELETE: solo `service_role` puede administrarlo.

-- ── Semilla inicial vinculada a aliados reales ──────────────────────────────
INSERT INTO recompensas_catalogo (negocio_aliado_id, titulo, descripcion, puntos_requeridos, stock_disponible)
SELECT b.id,
       '15% de descuento en Rocoto Relleno tradicional',
       'Canjea 150 Puntos TAFA por un 15% de descuento en tu consumo en La Nueva Palomino.',
       150, 50
FROM businesses b WHERE b.slug = 'aliado-la-nueva-palomino'
ON CONFLICT DO NOTHING;

INSERT INTO recompensas_catalogo (negocio_aliado_id, titulo, descripcion, puntos_requeridos, stock_disponible)
SELECT b.id,
       'Chicha de jora de cortesía',
       'Canjea 100 Puntos TAFA por una chicha de jora tradicional en Sol de Mayo.',
       100, 80
FROM businesses b WHERE b.slug = 'aliado-sol-de-mayo'
ON CONFLICT DO NOTHING;

INSERT INTO recompensas_catalogo (negocio_aliado_id, titulo, descripcion, puntos_requeridos, stock_disponible)
SELECT b.id,
       'Tour guiado de cortesía por el centro histórico',
       'Canjea 300 Puntos TAFA por un city tour guiado con Giardino Tours.',
       300, 20
FROM businesses b WHERE b.slug = 'aliado-giardino-tours'
ON CONFLICT DO NOTHING;
