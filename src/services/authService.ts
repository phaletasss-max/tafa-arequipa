import { supabase } from '@/lib/supabase'
import { generateTAFAExplorerPassCode } from '@/services/tafaMasterService'

export interface TAFAProfile {
  id: string
  email: string
  full_name: string
  doc_type: string
  doc_number: string
  tafa_explorer_pass: string
  points_earned: number
  visited_places: number
}

const SESSION_KEY = 'tafa_profile_user'
const PENDING_QR_KEY = 'tafa_pending_qr_checkin'

export function getStoredProfile(): TAFAProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveProfileSession(profile: TAFAProfile): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(profile))
  localStorage.setItem('tafa_tourist_user', JSON.stringify({
    nombre: profile.full_name,
    email: profile.email,
    docType: profile.doc_type,
    docNum: profile.doc_number,
    profile,
  }))
  window.dispatchEvent(new Event('tafa_auth_changed'))
}

export function clearProfileSession(): void {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem('tafa_tourist_user')
  window.dispatchEvent(new Event('tafa_auth_changed'))
}

export function setPendingQRCheckIn(slug: string): void {
  sessionStorage.setItem(PENDING_QR_KEY, slug)
}

export function getPendingQRCheckIn(): string | null {
  return sessionStorage.getItem(PENDING_QR_KEY)
}

export function clearPendingQRCheckIn(): void {
  sessionStorage.removeItem(PENDING_QR_KEY)
}

function mapDocType(docType: 'DNI' | 'PASSPORT' | 'CE'): string {
  if (docType === 'PASSPORT') return 'PASAPORTE'
  return docType
}

/**
 * Registra o recupera un perfil turista en la tabla `profiles` (MVP).
 * Si el email ya existe, actualiza datos y retorna el perfil existente.
 */
export async function registerOrLoginProfile(
  fullName: string,
  email: string,
  docType: 'DNI' | 'PASSPORT' | 'CE',
  docNumber: string,
): Promise<TAFAProfile> {
  const normalizedEmail = email.trim().toLowerCase()
  const mappedDocType = mapDocType(docType)

  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (existing) {
    const { data: updated, error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        doc_type: mappedDocType,
        doc_number: docNumber.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()

    const profile = (updated ?? existing) as TAFAProfile
    if (error) console.warn('Profile update warning:', error.message)
    saveProfileSession(profile)
    return profile
  }

  const newProfile = {
    email: normalizedEmail,
    full_name: fullName.trim(),
    doc_type: mappedDocType,
    doc_number: docNumber.trim(),
    tafa_explorer_pass: generateTAFAExplorerPassCode(),
    points_earned: 100,
    visited_places: 0,
    role: 'tourist',
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert([newProfile])
    .select()
    .single()

  if (error) {
    console.warn('Profile insert fallback to local:', error.message)
    const localProfile: TAFAProfile = {
      id: `local-${Date.now()}`,
      ...newProfile,
    }
    saveProfileSession(localProfile)
    return localProfile
  }

  const profile = data as TAFAProfile
  saveProfileSession(profile)
  return profile
}

export async function refreshProfilePoints(profileId: string): Promise<TAFAProfile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .maybeSingle()

  if (data) {
    saveProfileSession(data as TAFAProfile)
    return data as TAFAProfile
  }
  return null
}
