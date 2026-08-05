import { supabase } from '@/lib/supabase'
import {
  CATEGORY_LABELS,
  GUILDS,
  type DistanceKind,
  type NearbyPartner,
  type PartnerCategory,
  type PartnerEntry,
} from './types'
import { centroidFromAddress, formatDistanceValue, haversineKm } from './geo'

/**
 * Clasificación curada por slug.
 * La columna `businesses.category_id` está vacía en la base MVP, así que la
 * categoría se resuelve aquí hasta que se pueble el catálogo en Supabase.
 */
const CATEGORY_BY_SLUG: Record<string, PartnerCategory> = {
  'aliado-la-lucila': 'picanteria',
  'aliado-la-capitana': 'picanteria',
  'aliado-sol-de-mayo': 'picanteria',
  'aliado-la-nueva-palomino': 'picanteria',
  'aliado-la-benita': 'picanteria',
  'aliado-zig-zag': 'restaurante',
  'aliado-salamanto': 'restaurante',
  'aliado-chicha-arequipa': 'restaurante',
  'aliado-crepisimo': 'restaurante',
  'aliado-hatunpa': 'restaurante',
  'aliado-cafe-valenzuela': 'cafe',
  'aliado-capriccio': 'cafe',
  'aliado-casa-andina-premium': 'hotel',
  'aliado-sonesta-arequipa': 'hotel',
  'aliado-libertador-arequipa': 'hotel',
  'aliado-katari-hotel': 'hotel',
  'aliado-hostal-solar': 'hostal',
  'aliado-los-tambos': 'hostal',
  'aliado-wild-rover-arequipa': 'hostal',
  'aliado-flying-dog': 'hostal',
  'aliado-colca-lodge': 'hotel',
  'aliado-pozo-del-cielo': 'hotel',
  'aliado-giardino-tours': 'agencia',
  'aliado-pablo-tour': 'agencia',
  'aliado-sc-tours': 'agencia',
  'aliado-colonial-tours': 'agencia',
  'aliado-fundo-el-fierro': 'cultura',
  'aliado-patio-del-ekeko': 'cultura',
}

/** Extrae el distrito del campo dirección: "Calle Grau 204, Sachaca" → "Sachaca". */
function districtFromAddress(address: string | null | undefined): string {
  if (!address) return 'Arequipa'
  const parts = address.split(',').map(p => p.trim()).filter(Boolean)
  return parts.length > 1 ? parts[parts.length - 1] : 'Arequipa'
}

interface QRLandingRow {
  slug: string
  entity_type: 'place' | 'business'
  effective_points: number | null
  is_active: boolean
  place_name?: string | null
  place_address?: string | null
  place_lat?: number | null
  place_lng?: number | null
  business_name?: string | null
  business_address?: string | null
  business_lat?: number | null
  business_lng?: number | null
}

function toPartnerEntry(row: QRLandingRow): PartnerEntry {
  const isPlace = row.entity_type === 'place'
  const category: PartnerCategory = isPlace
    ? 'atractivo'
    : CATEGORY_BY_SLUG[row.slug] ?? 'restaurante'
  const address = (isPlace ? row.place_address : row.business_address) ?? 'Arequipa, Perú'

  // Los atractivos traen coordenadas reales; los negocios aliados las tienen en
  // NULL en la base MVP, así que se deducen del distrito de su dirección.
  const rawLat = isPlace ? row.place_lat : row.business_lat
  const rawLng = isPlace ? row.place_lng : row.business_lng
  const hasRealCoords = typeof rawLat === 'number' && typeof rawLng === 'number'
  const coords = hasRealCoords
    ? { lat: rawLat as number, lng: rawLng as number, approximate: false }
    : centroidFromAddress(address)

  return {
    slug: row.slug,
    name: (isPlace ? row.place_name : row.business_name) ?? row.slug,
    entityType: row.entity_type,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    district: districtFromAddress(address),
    address,
    points: row.effective_points ?? 50,
    guild: GUILDS[category],
    lat: coords?.lat,
    lng: coords?.lng,
    coordsApproximate: coords?.approximate,
  }
}

/** Catálogo mínimo de respaldo si Supabase no responde (offline / RLS). */
const FALLBACK_PARTNERS: PartnerEntry[] = (
  [
    ['aliado-la-nueva-palomino', 'La Nueva Palomino', 'Calle Leoncio Prado 122, Yanahuara'],
    ['aliado-sol-de-mayo', 'Sol de Mayo', 'Calle Jerusalem 207, Yanahuara'],
    ['aliado-la-lucila', 'La Lucila', 'Calle Grau 204, Sachaca'],
    ['aliado-chicha-arequipa', 'Chicha Arequipa', 'Calle Santa Catalina 210, Cercado'],
    ['aliado-zig-zag', 'Zig Zag', 'Calle Zela 210, Cercado'],
    ['aliado-cafe-valenzuela', 'Cafe Valenzuela', 'Calle San Francisco 125, Cercado'],
    ['aliado-casa-andina-premium', 'Casa Andina Premium', 'Calle Ugarte 403, Cercado'],
    ['aliado-katari-hotel', 'Katari Hotel', 'Calle San Agustin 231, Cercado'],
    ['aliado-giardino-tours', 'Giardino Tours', 'Calle Santa Catalina 500, Cercado'],
    ['aliado-patio-del-ekeko', 'Patio del Ekeko', 'Calle Mercaderes 141, Cercado'],
  ] as const
).map(([slug, name, address]) =>
  toPartnerEntry({
    slug,
    entity_type: 'business',
    effective_points: 50,
    is_active: true,
    business_name: name,
    business_address: address,
  }),
)

/**
 * Devuelve el directorio de aliados y atractivos con QR activo.
 * Nunca lanza: si Supabase falla, entrega el catálogo de respaldo.
 */
export async function fetchPartners(): Promise<PartnerEntry[]> {
  // Los campos se enumeran en línea (no como constante) para que supabase-js
  // conserve la inferencia de tipos sobre el literal.
  const { data, error } = await supabase
    .from('qr_landing')
    .select(
      'slug, entity_type, effective_points, is_active, place_name, place_address, place_lat, place_lng, business_name, business_address, business_lat, business_lng',
    )
    .eq('is_active', true)
    .order('entity_type', { ascending: true })

  if (error || !data?.length) {
    if (error) console.warn('Directorio de aliados — fallback local:', error.message)
    return FALLBACK_PARTNERS
  }

  return (data as QRLandingRow[]).map(toPartnerEntry)
}

/** Solo negocios aliados (excluye atractivos DIRCETUR). */
export async function fetchAlliedBusinesses(): Promise<PartnerEntry[]> {
  const all = await fetchPartners()
  return all.filter(p => p.entityType === 'business')
}

/**
 * FASE 6 — Lugares y aliados más cercanos al slug indicado, ordenados por
 * distancia real.
 *
 * Si ni el origen ni los candidatos tienen posición resoluble, se degrada a
 * coincidencia por distrito y, en último término, a los primeros del catálogo:
 * la sección nunca queda vacía.
 *
 * @param originSlug slug canónico del sitio escaneado
 * @param limit      número máximo de recomendaciones
 */
export async function fetchNearby(originSlug: string, limit = 3): Promise<NearbyPartner[]> {
  const all = await fetchPartners()
  const origin = all.find(p => p.slug === originSlug)
  const candidates = all.filter(p => p.slug !== originSlug)

  const originHasCoords = typeof origin?.lat === 'number' && typeof origin?.lng === 'number'

  if (originHasCoords) {
    const withDistance = candidates
      .filter(p => typeof p.lat === 'number' && typeof p.lng === 'number')
      .map(p => {
        const distanceKm = haversineKm(
          { lat: origin!.lat as number, lng: origin!.lng as number },
          { lat: p.lat as number, lng: p.lng as number },
        )
        // La distancia es aproximada si cualquiera de los dos extremos lo es.
        const approx = Boolean(origin!.coordsApproximate || p.coordsApproximate)

        // Dos casos en los que dar metros exactos mentiría:
        //  · coordenadas reales que coinciden, porque la geocodificación
        //    devuelve el eje de la calle y no el número del local;
        //  · dos entidades del mismo distrito estimadas desde el mismo
        //    centroide, que darían "0 m" leído como "misma puerta".
        let distanceKind: DistanceKind
        if (!approx && distanceKm < 0.03) distanceKind = 'very-close'
        else if (approx && distanceKm < 0.15) distanceKind = 'same-district'
        else distanceKind = approx ? 'approx' : 'exact'

        return { ...p, distanceKm, distanceKind, distanceValue: formatDistanceValue(distanceKm) }
      })
      .sort((a, b) => a.distanceKm - b.distanceKm)

    if (withDistance.length) return withDistance.slice(0, limit)
  }

  // Sin posición utilizable: se prioriza el mismo distrito.
  const sameDistrict = candidates.filter(
    p => origin && p.district.toLowerCase() === origin.district.toLowerCase(),
  )
  const pool = sameDistrict.length ? sameDistrict : candidates

  return pool.slice(0, limit).map(p => ({
    ...p,
    distanceKm: Number.POSITIVE_INFINITY,
    distanceKind: 'unknown' as DistanceKind,
    distanceValue: '',
  }))
}

export { FALLBACK_PARTNERS }
