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

export type DocType = 'DNI' | 'PASSPORT' | 'CE'

export type AuthOutcome =
  | { ok: true; profile: TAFAProfile }
  /** Registro creado pero pendiente de confirmar el correo: aún no hay sesión. */
  | { ok: 'email_confirmation_required'; email: string }
  | { ok: false; error: string }

const SESSION_KEY = 'tafa_profile_user'
const PENDING_QR_KEY = 'tafa_pending_qr_checkin'

/**
 * Copia local del perfil. Es solo caché de UI para pintar el menú sin esperar a
 * la red: la fuente de verdad de la identidad es la sesión de Supabase Auth.
 */
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
  // Cierra también la sesión de Supabase; si falla, la caché local ya se limpió.
  void supabase.auth.signOut().catch(() => {})
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

function mapDocType(docType: DocType): string {
  return docType === 'PASSPORT' ? 'PASAPORTE' : docType
}

/** Traduce los errores de Supabase Auth a mensajes para el turista. */
function translateAuthError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (m.includes('email not confirmed')) return 'Debes confirmar tu correo antes de iniciar sesión.'
  if (m.includes('user already registered') || m.includes('already been registered')) {
    return 'Ese correo ya tiene una cuenta TAFA. Inicia sesión.'
  }
  if (m.includes('password should be')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (m.includes('rate limit') || m.includes('too many')) {
    return 'Demasiados intentos. Espera un momento e inténtalo de nuevo.'
  }
  return message
}

/**
 * Obtiene el perfil del usuario autenticado; lo crea si aún no existe
 * (por ejemplo cuando la cuenta se creó vía OAuth).
 */
async function ensureProfile(
  userId: string,
  email: string,
  fallback: { fullName?: string; docType?: DocType; docNumber?: string },
): Promise<TAFAProfile> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (existing) return existing as TAFAProfile

  const nuevo = {
    id: userId,
    email,
    full_name: fallback.fullName?.trim() || email.split('@')[0],
    doc_type: mapDocType(fallback.docType ?? 'DNI'),
    doc_number: fallback.docNumber?.trim() ?? '',
    tafa_explorer_pass: generateTAFAExplorerPassCode(),
    points_earned: 100, // bono de bienvenida
    visited_places: 0,
    role: 'tourist',
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert([nuevo])
    .select()
    .single()

  if (error) {
    console.warn('No se pudo crear el perfil en Supabase:', error.message)
    return nuevo as TAFAProfile
  }
  return data as TAFAProfile
}

/**
 * FASE 3 — Registro de turista con Supabase Auth (email + contraseña).
 * `profiles.id` queda ligado a `auth.users.id`, que es lo que exigen las
 * políticas RLS de `database/migrations/004_rls_hardening.sql`.
 */
export async function signUpTourist(params: {
  fullName: string
  email: string
  password: string
  docType: DocType
  docNumber: string
  country?: string
  language?: string
}): Promise<AuthOutcome> {
  const email = params.email.trim().toLowerCase()

  const { data, error } = await supabase.auth.signUp({
    email,
    password: params.password,
    options: {
      data: {
        full_name: params.fullName.trim(),
        doc_type: mapDocType(params.docType),
        doc_number: params.docNumber.trim(),
        country: params.country ?? null,
        preferred_language: params.language ?? null,
      },
    },
  })

  if (error) return { ok: false, error: translateAuthError(error.message) }

  // Sin sesión ⇒ el proyecto exige confirmar el correo. El perfil se creará en
  // el primer inicio de sesión, cuando ya exista `auth.uid()`.
  if (!data.session || !data.user) {
    return { ok: 'email_confirmation_required', email }
  }

  const profile = await ensureProfile(data.user.id, email, {
    fullName: params.fullName,
    docType: params.docType,
    docNumber: params.docNumber,
  })
  saveProfileSession(profile)
  return { ok: true, profile }
}

/** FASE 3 — Inicio de sesión con correo y contraseña. */
export async function signInTourist(email: string, password: string): Promise<AuthOutcome> {
  const normalized = email.trim().toLowerCase()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalized,
    password,
  })

  if (error) return { ok: false, error: translateAuthError(error.message) }
  if (!data.user) return { ok: false, error: 'No se pudo iniciar sesión.' }

  const profile = await ensureProfile(data.user.id, normalized, {})
  saveProfileSession(profile)
  return { ok: true, profile }
}

/**
 * Google OAuth — preparado según el roadmap (FASE 3).
 * Requiere habilitar el proveedor Google en el panel de Supabase.
 */
export async function signInWithGoogle(): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
  return error ? { ok: false, error: translateAuthError(error.message) } : { ok: true }
}

export async function signOutTourist(): Promise<void> {
  await supabase.auth.signOut()
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem('tafa_tourist_user')
  window.dispatchEvent(new Event('tafa_auth_changed'))
}

/**
 * Rehidrata el perfil desde la sesión activa de Supabase.
 * Llamar al arrancar la app: la caché de `localStorage` puede sobrevivir a una
 * sesión ya expirada, y sin esto la UI mostraría a un usuario que ya no lo está.
 */
export async function loadSessionProfile(): Promise<TAFAProfile | null> {
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem('tafa_tourist_user')
    return null
  }

  const profile = await ensureProfile(data.user.id, data.user.email ?? '', {})
  saveProfileSession(profile)
  return profile
}

/** Relee los puntos del turista autenticado tras un check-in. */
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
