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
  /** Latitud: de la base si existe, si no del centroide del distrito. */
  lat?: number
  lng?: number
  /** true si `lat`/`lng` provienen del centroide del distrito y no de la base. */
  coordsApproximate?: boolean
}

/**
 * Cómo debe presentarse la distancia. La capa de datos no traduce: decide el
 * caso y el componente elige la frase en el idioma activo.
 */
export type DistanceKind =
  /** Distancia calculada entre coordenadas reales de la base. */
  | 'exact'
  /** Alguno de los dos extremos se estimó desde el centroide de su distrito. */
  | 'approx'
  /** Ambos comparten centroide de distrito: dar metros sería fingir precisión. */
  | 'same-district'
  /** Prácticamente en el mismo punto (misma calle en la geocodificación). */
  | 'very-close'
  /** No hubo forma de situarlos; solo se conoce el distrito. */
  | 'unknown'

/** Aliado con la distancia calculada respecto a un punto de origen. */
export interface NearbyPartner extends PartnerEntry {
  distanceKm: number
  distanceKind: DistanceKind
  /** Magnitud ya formateada, sin preposición: "450 m", "2.1 km". */
  distanceValue: string
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
