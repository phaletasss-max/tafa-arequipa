-- ============================================================================
-- TAFA MVP — Extensión: QR, Check-in y Puntos
-- Ejecutar DESPUÉS de supabase_clean_mvp_schema.sql
-- ============================================================================

-- 1. Slugs y campos faltantes en entidades existentes
ALTER TABLE places ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS points_reward INTEGER DEFAULT 50;

-- Generar slugs para places existentes
UPDATE places SET slug = lower(
  regexp_replace(
    regexp_replace(
      translate(name, 'áéíóúñÁÉÍÓÚÑ', 'aeiounAEIOUN'),
      '[^a-zA-Z0-9]+', '-', 'g'
    ),
    '(^-|-$)', '', 'g'
  )
) WHERE slug IS NULL;

-- Generar slugs para businesses existentes
UPDATE businesses SET slug = lower(
  regexp_replace(
    regexp_replace(
      translate(trade_name, 'áéíóúñÁÉÍÓÚÑ', 'aeiounAEIOUN'),
      '[^a-zA-Z0-9]+', '-', 'g'
    ),
    '(^-|-$)', '', 'g'
  )
) WHERE slug IS NULL;

-- Descripciones base para negocios aliados
UPDATE businesses SET description = 'Aliado TAFA del ecosistema turístico de Arequipa. Escanea el QR para confirmar tu visita y acumular puntos TAFA.'
WHERE description IS NULL;

-- 2. QR Codes — cada sitio/negocio tiene un QR único
CREATE TABLE IF NOT EXISTS qr_codes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,
  entity_type     TEXT NOT NULL CHECK (entity_type IN ('place', 'business')),
  place_id        BIGINT REFERENCES places(id) ON DELETE CASCADE,
  business_id     UUID REFERENCES businesses(id) ON DELETE CASCADE,
  label           TEXT,
  points_reward   INTEGER,
  is_active       BOOLEAN DEFAULT TRUE,
  scan_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT qr_entity_check CHECK (
    (entity_type = 'place' AND place_id IS NOT NULL AND business_id IS NULL) OR
    (entity_type = 'business' AND business_id IS NOT NULL AND place_id IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_slug ON qr_codes(slug);
CREATE INDEX IF NOT EXISTS idx_qr_codes_place ON qr_codes(place_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_business ON qr_codes(business_id);

-- 3. Visit Logs — registro de asistencia y puntos
CREATE TABLE IF NOT EXISTS visit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  qr_code_id      UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
  entity_type     TEXT NOT NULL CHECK (entity_type IN ('place', 'business')),
  place_id        BIGINT REFERENCES places(id) ON DELETE SET NULL,
  business_id     UUID REFERENCES businesses(id) ON DELETE SET NULL,
  points_awarded  INTEGER NOT NULL DEFAULT 0,
  visit_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, qr_code_id, visit_date)
);

CREATE INDEX IF NOT EXISTS idx_visit_logs_profile ON visit_logs(profile_id);
CREATE INDEX IF NOT EXISTS idx_visit_logs_date ON visit_logs(profile_id, visit_date);

-- 4. Semilla de QR codes para lugares turísticos principales
INSERT INTO qr_codes (slug, entity_type, place_id, label, points_reward)
SELECT
  p.slug,
  'place',
  p.id,
  p.name,
  p.points_reward
FROM places p
WHERE p.slug IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

-- 5. Semilla de QR codes para negocios aliados (hostales, restaurantes, etc.)
INSERT INTO qr_codes (slug, entity_type, business_id, label, points_reward)
SELECT
  'aliado-' || b.slug,
  'business',
  b.id,
  b.trade_name,
  COALESCE(b.points_reward, 50)
FROM businesses b
WHERE b.slug IS NOT NULL
ON CONFLICT (slug) DO NOTHING;

-- 6. RLS
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read QR Codes" ON qr_codes FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public Read Own Visits" ON visit_logs FOR SELECT USING (TRUE);

-- Profiles: permitir registro público (MVP sin Supabase Auth aún)
CREATE POLICY "Public Insert Profiles" ON profiles FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Public Update Profiles" ON profiles FOR UPDATE USING (TRUE);

-- 7. Función RPC: registrar check-in por QR y otorgar puntos
CREATE OR REPLACE FUNCTION register_qr_checkin(
  p_profile_id UUID,
  p_qr_slug TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_qr          qr_codes%ROWTYPE;
  v_profile     profiles%ROWTYPE;
  v_points      INTEGER;
  v_daily_cap   INTEGER;
  v_today_pts   INTEGER;
  v_visit_id    UUID;
  v_entity_name TEXT;
BEGIN
  -- Validar perfil
  SELECT * INTO v_profile FROM profiles WHERE id = p_profile_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'profile_not_found');
  END IF;

  -- Validar QR
  SELECT * INTO v_qr FROM qr_codes WHERE slug = p_qr_slug AND is_active = TRUE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'qr_not_found');
  END IF;

  -- Verificar visita duplicada hoy
  IF EXISTS (
    SELECT 1 FROM visit_logs
    WHERE profile_id = p_profile_id
      AND qr_code_id = v_qr.id
      AND visit_date = CURRENT_DATE
  ) THEN
    SELECT points_awarded INTO v_points FROM visit_logs
    WHERE profile_id = p_profile_id AND qr_code_id = v_qr.id AND visit_date = CURRENT_DATE;

    IF v_qr.entity_type = 'place' THEN
      SELECT name INTO v_entity_name FROM places WHERE id = v_qr.place_id;
    ELSE
      SELECT trade_name INTO v_entity_name FROM businesses WHERE id = v_qr.business_id;
    END IF;

    RETURN jsonb_build_object(
      'success', true,
      'already_visited', true,
      'points_awarded', v_points,
      'entity_name', v_entity_name,
      'total_points', v_profile.points_earned
    );
  END IF;

  -- Calcular puntos
  IF v_qr.points_reward IS NOT NULL THEN
    v_points := v_qr.points_reward;
  ELSIF v_qr.entity_type = 'place' THEN
    SELECT COALESCE(points_reward, 50) INTO v_points FROM places WHERE id = v_qr.place_id;
  ELSE
    SELECT COALESCE(points_reward, 50) INTO v_points FROM businesses WHERE id = v_qr.business_id;
  END IF;

  -- Tope diario
  SELECT COALESCE(setting_value::INTEGER, 500) INTO v_daily_cap
  FROM system_settings WHERE setting_key = 'max_daily_points';

  SELECT COALESCE(SUM(points_awarded), 0) INTO v_today_pts
  FROM visit_logs
  WHERE profile_id = p_profile_id AND visit_date = CURRENT_DATE;

  IF v_today_pts + v_points > v_daily_cap THEN
    v_points := GREATEST(0, v_daily_cap - v_today_pts);
  END IF;

  IF v_points = 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'daily_cap_reached');
  END IF;

  -- Registrar visita
  INSERT INTO visit_logs (profile_id, qr_code_id, entity_type, place_id, business_id, points_awarded)
  VALUES (
    p_profile_id,
    v_qr.id,
    v_qr.entity_type,
    v_qr.place_id,
    v_qr.business_id,
    v_points
  )
  RETURNING id INTO v_visit_id;

  -- Actualizar perfil y contador QR
  UPDATE profiles
  SET points_earned = points_earned + v_points,
      visited_places = visited_places + 1,
      updated_at = NOW()
  WHERE id = p_profile_id;

  UPDATE qr_codes SET scan_count = scan_count + 1 WHERE id = v_qr.id;

  IF v_qr.entity_type = 'place' THEN
    SELECT name INTO v_entity_name FROM places WHERE id = v_qr.place_id;
  ELSE
    SELECT trade_name INTO v_entity_name FROM businesses WHERE id = v_qr.business_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'already_visited', false,
    'visit_id', v_visit_id,
    'points_awarded', v_points,
    'entity_name', v_entity_name,
    'total_points', v_profile.points_earned + v_points
  );
END;
$$;

-- 8. Vista para resolver QR con datos completos del sitio
CREATE OR REPLACE VIEW qr_landing AS
SELECT
  q.id AS qr_id,
  q.slug,
  q.entity_type,
  q.points_reward AS qr_points_override,
  q.scan_count,
  q.is_active,
  p.id AS place_id,
  p.name AS place_name,
  p.description AS place_description,
  p.address AS place_address,
  p.opening_hours AS place_hours,
  p.admission_fee AS place_fee,
  p.lat AS place_lat,
  p.lng AS place_lng,
  COALESCE(q.points_reward, p.points_reward, 50) AS effective_points,
  c.name AS place_category,
  b.id AS business_id,
  b.trade_name AS business_name,
  b.business_name AS business_legal_name,
  b.description AS business_description,
  b.address AS business_address,
  b.phone AS business_phone,
  b.website AS business_website,
  b.lat AS business_lat,
  b.lng AS business_lng,
  bc.name AS business_category
FROM qr_codes q
LEFT JOIN places p ON q.place_id = p.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN businesses b ON q.business_id = b.id
LEFT JOIN business_categories bc ON b.category_id = bc.id;

-- ============================================================================
-- FIN — QR Check-in System
-- Rutas: /qr/plaza-de-armas (sitio) | /qr/aliado-hostal-solar (negocio)
-- ============================================================================
