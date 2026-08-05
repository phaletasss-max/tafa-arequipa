import { supabase } from '@/lib/supabase'

export interface QRLandingData {
  qr_id: string
  slug: string
  entity_type: 'place' | 'business'
  effective_points: number
  scan_count: number
  is_active: boolean
  // Place fields
  place_id?: number
  place_name?: string
  place_description?: string
  place_address?: string
  place_hours?: string
  place_fee?: string
  place_lat?: number
  place_lng?: number
  place_category?: string
  // Business fields
  business_id?: string
  business_name?: string
  business_description?: string
  business_address?: string
  business_phone?: string
  business_website?: string
  business_lat?: number
  business_lng?: number
  business_category?: string
}

export interface CheckInResult {
  success: boolean
  already_visited?: boolean
  points_awarded?: number
  entity_name?: string
  total_points?: number
  error?: string
  /**
   * `false` cuando la visita NO llegó a persistirse en Supabase y se está
   * mostrando un resultado local. La UI debe advertirlo en lugar de afirmar
   * que los puntos quedaron acreditados.
   */
  persisted?: boolean
}

/**
 * Slugs heredados impresos en carteles antiguos → slug canónico de `qr_landing`.
 * La base usa el nombre oficial completo (`plaza-de-armas-de-arequipa`) y prefija
 * los negocios con `aliado-`, mientras que el primer Estudio QR generó slugs cortos.
 * Sin esta tabla, todo QR ya impreso cae al mock y la visita nunca se registra.
 */
const LEGACY_SLUG_ALIASES: Record<string, string> = {
  'plaza-de-armas': 'plaza-de-armas-de-arequipa',
  'basilica-catedral': 'basilica-catedral-de-arequipa',
  'monasterio-santa-catalina': 'monasterio-de-santa-catalina',
  'iglesia-compania': 'iglesia-de-la-compania-de-jesus',
  'barrio-san-lazaro': 'barrio-de-san-lazaro',
  'mansion-fundador': 'mansion-del-fundador',
  'santo-domingo': 'iglesia-y-convento-de-santo-domingo',
  'museo-santuarios-andinos': 'museo-santuarios-andinos-juanita',
  'museo-santa-teresa': 'museo-de-arte-virreinal-de-santa-teresa',
  'mirador-yanahuara': 'mirador-de-yanahuara',
  'mirador-carmen-alto': 'mirador-de-carmen-alto',
  'mirador-sachaca': 'mirador-de-sachaca',
  'canon-colca': 'canon-del-colca',
  'reserva-salinas': 'reserva-nacional-salinas-y-aguada-blanca',
  'laguna-salinas': 'laguna-de-salinas',
  pillones: 'catarata-de-pillones',
  'bosque-imata': 'bosque-de-piedras-de-imata',
  'ruta-sillar': 'ruta-del-sillar-anashuayco',
  'canteras-anashuayco': 'ruta-del-sillar-anashuayco',
  'toro-muerto': 'petroglifos-de-toro-muerto',
  'valle-andagua': 'valle-de-los-volcanes-de-andagua',
  'canon-cotahuasi': 'canon-de-cotahuasi',
  'cuevas-sumbay': 'cuevas-de-sumbay',
  calera: 'banos-termales-la-calera-chivay',
  'yanque-termas': 'banos-termales-de-yanque',
  'yura-termas': 'banos-termales-de-yura',
  mejia: 'playas-de-mejia-y-mollendo',
  'lagunas-mejia': 'santuario-nacional-lagunas-de-mejia',
  'molino-sabandia': 'molino-de-sabandia',
  // Negocios aliados (la base los prefija con `aliado-`)
  'la-nueva-palomino': 'aliado-la-nueva-palomino',
  'sol-de-mayo': 'aliado-sol-de-mayo',
  'la-lucila': 'aliado-la-lucila',
  'la-capitana': 'aliado-la-capitana',
  'la-benita': 'aliado-la-benita',
  'zig-zag': 'aliado-zig-zag',
  'chicha-arequipa': 'aliado-chicha-arequipa',
}

/** Traduce un slug impreso al slug canónico de la base. */
export function resolveSlug(slug: string): string {
  return LEGACY_SLUG_ALIASES[slug] ?? slug
}

async function fetchLandingBySlug(slug: string): Promise<QRLandingData | null> {
  const { data, error } = await supabase
    .from('qr_landing')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.warn('QR landing fetch error:', error.message)
    return null
  }
  return (data as QRLandingData) ?? null
}

export async function getQRLanding(slug: string): Promise<QRLandingData | null> {
  const canonical = resolveSlug(slug)

  const byCanonical = await fetchLandingBySlug(canonical)
  if (byCanonical) return byCanonical

  // El slug escaneado puede ser ya canónico y no estar en la tabla de alias.
  if (canonical !== slug) {
    const byRaw = await fetchLandingBySlug(slug)
    if (byRaw) return byRaw
  }

  return getMockQRLanding(slug)
}

/** Resultado local usado cuando la visita no pudo persistirse en Supabase. */
function localCheckInResult(qrSlug: string): CheckInResult {
  const mock = getMockQRLanding(qrSlug)
  return {
    success: true,
    persisted: false,
    already_visited: false,
    points_awarded: 50,
    entity_name: mock?.business_name || mock?.place_name || qrSlug,
  }
}

export async function registerQRCheckIn(
  profileId: string,
  qrSlug: string,
): Promise<CheckInResult> {
  // Perfil creado solo en localStorage: no existe fila en `profiles` que referenciar.
  if (profileId.startsWith('local-')) {
    return localCheckInResult(qrSlug)
  }

  const canonical = resolveSlug(qrSlug)

  // Firma segura (migración 004): el servidor toma la identidad de `auth.uid()`,
  // de modo que el cliente nunca declara a nombre de quién acredita los puntos.
  const { data, error } = await supabase.rpc('register_qr_checkin', {
    p_qr_slug: canonical,
  })

  if (!error) return { ...(data as CheckInResult), persisted: true }

  // PGRST202 = no existe función con esa firma. Ocurre mientras la migración 004
  // no esté aplicada; se reintenta con la firma antigua para no dejar al turista
  // sin registrar su visita durante la transición.
  if (error.code === 'PGRST202') {
    const legacy = await supabase.rpc('register_qr_checkin', {
      p_profile_id: profileId,
      p_qr_slug: canonical,
    })
    if (!legacy.error) return { ...(legacy.data as CheckInResult), persisted: true }
    console.warn('Check-in RPC (firma antigua) falló:', legacy.error.message)
    return localCheckInResult(qrSlug)
  }

  console.warn('Check-in RPC error:', error.message)
  return localCheckInResult(qrSlug)
}

function getMockQRLanding(slug: string): QRLandingData | null {
  const mocks: Record<string, QRLandingData> = {
    'la-nueva-palomino': {
      qr_id: 'mock-np',
      slug: 'la-nueva-palomino',
      entity_type: 'business',
      effective_points: 50,
      scan_count: 1420,
      is_active: true,
      business_name: 'Picantería La Nueva Palomino',
      business_description: 'Picantería tradicional arequipeña en el corazón del distrito histórico de Yanahuara. Especialistas en Rocoto Relleno, Chicha de Jora y Chupe de Camarones.',
      business_address: 'Calle Leoncio Prado 122, Yanahuara, Arequipa',
      business_phone: '(054) 252330',
      business_website: 'https://lanuevapalomino.pe',
      business_category: 'Gastronomía Arequipeña — Picantería Tradicional',
    },
    'sol-de-mayo': {
      qr_id: 'mock-sm',
      slug: 'sol-de-mayo',
      entity_type: 'business',
      effective_points: 50,
      scan_count: 980,
      is_active: true,
      business_name: 'Restaurante Sol de Mayo (1903)',
      business_description: 'Emblemático restaurante de comida típica arequipeña fundado en 1903. Amplios jardines y cocina tradicional reconocida por la DIRCETUR Arequipa.',
      business_address: 'Calle Jerusalén 207, Yanahuara, Arequipa',
      business_phone: '(054) 254148',
      business_website: 'https://restaurantesoldemayo.com',
      business_category: 'Gastronomía Arequipeña — Restaurante Típico',
    },
    'la-lucila': {
      qr_id: 'mock-ll',
      slug: 'la-lucila',
      entity_type: 'business',
      effective_points: 50,
      scan_count: 850,
      is_active: true,
      business_name: 'Picantería Tradicional La Lucila',
      business_description: 'Picantería ancestral en Sachaca reconocida como Patrimonio Cultural de la Nación. Cocina a la leña, cuy chactado y ocopa arequipeña.',
      business_address: 'Calle Grau 204, Sachaca, Arequipa',
      business_phone: '(054) 221234',
      business_category: 'Gastronomía Arequipeña — Picantería Ancestral',
    },
    'bodega-majes-tradicion': {
      qr_id: 'mock-bm',
      slug: 'bodega-majes-tradicion',
      entity_type: 'business',
      effective_points: 50,
      scan_count: 620,
      is_active: true,
      business_name: 'Bodega & Enoturismo Majes Tradición',
      business_description: 'Bodega pisquera histórica en el Valle de Majes. Recorridos guiados por viñedos, degustación de pisco puro e macerados artesanales.',
      business_address: 'Carretera Central s/n, Corire, Castilla, Arequipa',
      business_phone: '959 123 456',
      business_website: 'https://majestradicion.pe',
      business_category: 'Enoturismo — Bodega Pisquera Aliada',
    },
    'canteras-anashuayco': {
      qr_id: 'mock-ca',
      slug: 'canteras-anashuayco',
      entity_type: 'business',
      effective_points: 50,
      scan_count: 2310,
      is_active: true,
      business_name: 'Asociación de Canteros de Añashuayco',
      business_description: 'Taller vivo de talla en sillar en las canteras naturales de Cerro Colorado. Megagrabados tallados en roca volcánica y artesanías exclusivas.',
      business_address: 'Quebrada de Añashuayco, Cerro Colorado, Arequipa',
      business_phone: '958 765 432',
      business_category: 'Artesanía & Cultura Viva — Ruta del Sillar',
    },
    'mundo-alpaca': {
      qr_id: 'mock-ma',
      slug: 'mundo-alpaca',
      entity_type: 'business',
      effective_points: 50,
      scan_count: 1840,
      is_active: true,
      business_name: 'Centro Interpretativo Mundo Alpaca',
      business_description: 'Espacio cultural de conservación de camélidos sudamericanos en el barrio tradicional de San Lázaro. Demostración viviente de hilado y tejido artesanal.',
      business_address: 'Calle Juan de la Torre 101, San Lázaro, Cercado',
      business_phone: '(054) 202525',
      business_website: 'https://mundoalpaca.com.pe',
      business_category: 'Experiencia Cultural — Arte Textil',
    },
    'plaza-de-armas': {
      qr_id: 'mock-pa',
      slug: 'plaza-de-armas',
      entity_type: 'place',
      effective_points: 50,
      scan_count: 5400,
      is_active: true,
      place_name: 'Plaza de Armas de Arequipa',
      place_description: 'Plaza principal rodeada de arquerías de sillar volcánico y la Catedral neoclásica del siglo XVII. Declarada Patrimonio de la Humanidad por UNESCO.',
      place_address: 'Plaza de Armas s/n, Cercado, Arequipa',
      place_hours: 'Abierto 24 horas',
      place_fee: 'Acceso Libre',
      place_category: 'Patrimonio Histórico',
    },
    'monasterio-santa-catalina': {
      qr_id: 'mock-msc',
      slug: 'monasterio-santa-catalina',
      entity_type: 'place',
      effective_points: 50,
      scan_count: 3890,
      is_active: true,
      place_name: 'Monasterio de Santa Catalina',
      place_description: 'Ciudadela monástica de 20,000 m² con claustros teñidos de azul añil y rojo terracota. Fundado en 1579.',
      place_address: 'Calle Santa Catalina 301, Cercado, Arequipa',
      place_hours: '9:00 AM - 5:00 PM',
      place_fee: 'S/ 45.00 General',
      place_category: 'Patrimonio Histórico',
    },
  }

  // El mock está indexado por slugs cortos; el escaneo puede traer el canónico.
  const reverseAlias = Object.entries(LEGACY_SLUG_ALIASES)
    .find(([, canonical]) => canonical === slug)?.[0]

  for (const candidate of [slug, resolveSlug(slug), reverseAlias, slug.replace(/^aliado-/, '')]) {
    if (candidate && mocks[candidate]) return mocks[candidate]
  }

  // Dynamic fallback generator for any custom slug
  const title = slug
    .replace(/^aliado-/, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    qr_id: `dynamic-${slug}`,
    slug: slug,
    entity_type: 'business',
    effective_points: 50,
    scan_count: 100,
    is_active: true,
    business_name: title,
    business_description: `Establecimiento o atractivo turístico verificado en Arequipa. Escanea tu código QR para validar tu visita y ganar +50 Puntos TAFA.`,
    business_address: 'Arequipa, Perú',
    business_phone: '+51 921 378 349',
    business_category: 'Socio Turístico & Gastronómico TAFA',
  }
}
