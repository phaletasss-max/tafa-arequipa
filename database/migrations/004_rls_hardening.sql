-- ============================================================================
-- TAFA MVP — Endurecimiento de Row Level Security
--
-- ✅ Requisito ya cumplido: el frontend migró a Supabase Auth (PT-06), así que
-- `profiles.id` corresponde a `auth.users.id` y estas políticas pueden aplicarse.
--
-- ⚠️ Antes de ejecutar, revisar los perfiles heredados: las filas creadas por el
-- flujo antiguo tienen un `id` aleatorio sin usuario de Auth asociado y quedarán
-- inaccesibles. Para conservar sus puntos hay que ligarlas al usuario creado con
-- el mismo correo:
--   UPDATE profiles p SET id = u.id FROM auth.users u WHERE u.email = p.email;
-- Sin ese paso, esas personas deberán registrarse de nuevo.
--
-- ── Problema que corrige ────────────────────────────────────────────────────
-- Verificado el 2026-08-05 contra el proyecto MVP con la clave anónima que va
-- incrustada en el bundle del navegador:
--   • SELECT sobre `profiles` devuelve email y número de documento de TODOS los
--     turistas registrados (dato personal expuesto públicamente).
--   • UPDATE sobre `profiles` es aceptado (HTTP 200), de modo que cualquiera
--     puede sobrescribir nombres, documentos y saldos de Puntos TAFA.
-- La clave anónima es pública por diseño; la única defensa real es RLS.
-- ============================================================================

-- ── 1. profiles: cada turista solo ve y edita su propia fila ────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_public_read   ON profiles;
DROP POLICY IF EXISTS profiles_public_insert ON profiles;
DROP POLICY IF EXISTS profiles_public_update ON profiles;

CREATE POLICY profiles_select_own
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY profiles_insert_own
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Los contadores de gamificación NO se editan desde el cliente: los actualiza
-- `register_qr_checkin`, que corre como SECURITY DEFINER.
CREATE POLICY profiles_update_own
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

REVOKE UPDATE (points_earned, visited_places, tafa_explorer_pass)
  ON profiles FROM anon, authenticated;

-- ── 2. visit_logs: historial privado de cada turista ────────────────────────
ALTER TABLE visit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS visit_logs_public_read ON visit_logs;

CREATE POLICY visit_logs_select_own
  ON visit_logs FOR SELECT TO authenticated
  USING (auth.uid() = profile_id);

-- Sin política de INSERT: los check-ins entran únicamente por el RPC.

-- ── 3. Catálogo público: lectura abierta, escritura cerrada ─────────────────
ALTER TABLE places     ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS places_public_read     ON places;
DROP POLICY IF EXISTS businesses_public_read ON businesses;
DROP POLICY IF EXISTS qr_codes_public_read   ON qr_codes;

CREATE POLICY places_public_read
  ON places FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY businesses_public_read
  ON businesses FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY qr_codes_public_read
  ON qr_codes FOR SELECT TO anon, authenticated USING (is_active);

-- ── 4. Check-in mediante RPC con privilegios elevados ───────────────────────
-- El turista no escribe puntos directamente: el servidor los calcula y acredita.
CREATE OR REPLACE FUNCTION register_qr_checkin(p_qr_slug TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile_id     UUID := auth.uid();
  v_qr             qr_codes%ROWTYPE;
  v_points         INTEGER;
  v_already        BOOLEAN := FALSE;
  v_total          INTEGER;
  v_entity_name    TEXT;
  v_today_points   INTEGER;
  c_daily_cap      CONSTANT INTEGER := 500;
BEGIN
  IF v_profile_id IS NULL THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'not_authenticated');
  END IF;

  SELECT * INTO v_qr FROM qr_codes WHERE slug = p_qr_slug AND is_active;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'qr_not_found');
  END IF;

  v_points := COALESCE(v_qr.points_reward, 50);

  -- Tope diario de puntos acumulables
  SELECT COALESCE(SUM(points_awarded), 0) INTO v_today_points
  FROM visit_logs
  WHERE profile_id = v_profile_id AND visit_date = CURRENT_DATE;

  IF v_today_points >= c_daily_cap THEN
    RETURN jsonb_build_object('success', FALSE, 'error', 'daily_cap_reached');
  END IF;

  -- Una acreditación por QR y por día (UNIQUE en visit_logs)
  INSERT INTO visit_logs (profile_id, qr_code_id, entity_type, place_id, business_id, points_awarded)
  VALUES (v_profile_id, v_qr.id, v_qr.entity_type, v_qr.place_id, v_qr.business_id, v_points)
  ON CONFLICT (profile_id, qr_code_id, visit_date) DO NOTHING;

  IF NOT FOUND THEN
    v_already := TRUE;
    v_points  := 0;
  END IF;

  IF NOT v_already THEN
    UPDATE profiles
       SET points_earned  = points_earned + v_points,
           visited_places = visited_places + 1,
           updated_at     = NOW()
     WHERE id = v_profile_id;

    UPDATE qr_codes SET scan_count = scan_count + 1 WHERE id = v_qr.id;
  END IF;

  SELECT points_earned INTO v_total FROM profiles WHERE id = v_profile_id;

  v_entity_name := COALESCE(
    (SELECT name       FROM places     WHERE id = v_qr.place_id),
    (SELECT trade_name FROM businesses WHERE id = v_qr.business_id),
    v_qr.label
  );

  RETURN jsonb_build_object(
    'success',         TRUE,
    'already_visited', v_already,
    'points_awarded',  v_points,
    'entity_name',     v_entity_name,
    'total_points',    v_total
  );
END;
$$;

REVOKE ALL   ON FUNCTION register_qr_checkin(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION register_qr_checkin(TEXT) TO authenticated;
