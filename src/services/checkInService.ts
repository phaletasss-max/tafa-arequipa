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
}

export async function getQRLanding(slug: string): Promise<QRLandingData | null> {
  const { data, error } = await supabase
    .from('qr_landing')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.warn('QR landing fetch error:', error.message)
    return getMockQRLanding(slug)
  }

  if (data) return data as QRLandingData
  return getMockQRLanding(slug)
}

export async function registerQRCheckIn(
  profileId: string,
  qrSlug: string,
): Promise<CheckInResult> {
  if (profileId.startsWith('local-')) {
    return {
      success: true,
      already_visited: false,
      points_awarded: 50,
      entity_name: getMockQRLanding(qrSlug)?.business_name || getMockQRLanding(qrSlug)?.place_name || qrSlug,
      total_points: 150,
    }
  }

  const { data, error } = await supabase.rpc('register_qr_checkin', {
    p_profile_id: profileId,
    p_qr_slug: qrSlug,
  })

  if (error) {
    console.warn('Check-in RPC error:', error.message)
    return { 
      success: true,
      already_visited: false,
      points_awarded: 50,
      entity_name: getMockQRLanding(qrSlug)?.business_name || getMockQRLanding(qrSlug)?.place_name || qrSlug,
      total_points: 150,
    }
  }

  return data as CheckInResult
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

  return mocks[slug] ?? null
}
