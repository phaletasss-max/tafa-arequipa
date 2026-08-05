/**
 * FASE 5 — Aliados turísticos.
 * Tipos compartidos del directorio de socios y atractivos con QR activo.
 */

export type PartnerCategory =
  | 'picanteria'
  | 'restaurante'
  | 'cafe'
  | 'hotel'
  | 'hostal'
  | 'agencia'
  | 'cultura'
  | 'atractivo'

export interface PartnerEntry {
  /** Slug canónico tal como existe en `qr_landing.slug` de Supabase. */
  slug: string
  name: string
  entityType: 'place' | 'business'
  category: PartnerCategory
  categoryLabel: string
  district: string
  address: string
  points: number
  /** Gremio o asociación que agrupa al aliado (roadmap FASE 5). */
  guild?: string
}

export const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  picanteria: 'Picantería Tradicional',
  restaurante: 'Restaurante',
  cafe: 'Café & Repostería',
  hotel: 'Hotel',
  hostal: 'Hostal & Albergue',
  agencia: 'Agencia de Viajes',
  cultura: 'Cultura & Artesanía',
  atractivo: 'Atractivo Turístico',
}

/**
 * Gremios registrados en la FASE 5 del roadmap.
 * Se usan para agrupar aliados en el directorio público.
 */
export const GUILDS: Record<PartnerCategory, string> = {
  picanteria: 'Sociedad Picantera de Arequipa',
  restaurante: 'AGAR — Asociación Gastronómica de Arequipa',
  cafe: 'AGAR — Asociación Gastronómica de Arequipa',
  hotel: 'AHORA Arequipa — Hoteles, Restaurantes y Afines',
  hostal: 'AHORA Arequipa — Hoteles, Restaurantes y Afines',
  agencia: 'AVIT — Agencias de Viajes y Turismo',
  cultura: 'COLITUR Arequipa',
  atractivo: 'DIRCETUR Arequipa',
}
