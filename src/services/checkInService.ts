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
      entity_name: qrSlug,
      total_points: 150,
    }
  }

  const { data, error } = await supabase.rpc('register_qr_checkin', {
    p_profile_id: profileId,
    p_qr_slug: qrSlug,
  })

  if (error) {
    console.warn('Check-in RPC error:', error.message)
    return { success: false, error: error.message }
  }

  return data as CheckInResult
}

function getMockQRLanding(slug: string): QRLandingData | null {
  const mocks: Record<string, QRLandingData> = {
    'plaza-de-armas': {
      qr_id: 'mock-1',
      slug: 'plaza-de-armas',
      entity_type: 'place',
      effective_points: 50,
      scan_count: 0,
      is_active: true,
      place_name: 'Plaza de Armas de Arequipa',
      place_description: 'Plaza principal rodeada de arquerías de sillar volcánico y la Catedral neoclásica del siglo XVII.',
      place_address: 'Plaza de Armas s/n, Cercado',
      place_hours: '24 horas',
      place_fee: 'Acceso Libre',
      place_category: 'Patrimonio Histórico',
    },
    'aliado-hostal-solar': {
      qr_id: 'mock-2',
      slug: 'aliado-hostal-solar',
      entity_type: 'business',
      effective_points: 50,
      scan_count: 0,
      is_active: true,
      business_name: 'Hostal Solar',
      business_description: 'Hostal aliado TAFA en el centro histórico de Arequipa.',
      business_address: 'Calle Ayacucho 108, Cercado',
      business_phone: '054-241793',
      business_category: 'Hospedaje - Hostal',
    },
    'aliado-la-lucila': {
      qr_id: 'mock-3',
      slug: 'aliado-la-lucila',
      entity_type: 'business',
      effective_points: 50,
      scan_count: 0,
      is_active: true,
      business_name: 'La Lucila',
      business_description: 'Picantería tradicional arequipeña aliada al ecosistema TAFA.',
      business_address: 'Calle Grau 204, Sachaca',
      business_phone: '054-221234',
      business_category: 'Restaurante - Picantería',
    },
  }

  return mocks[slug] ?? null
}
