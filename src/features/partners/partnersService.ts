import { supabase } from '@/lib/supabase'
import { CATEGORY_LABELS, GUILDS, type PartnerCategory, type PartnerEntry } from './types'

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
  business_name?: string | null
  business_address?: string | null
}

function toPartnerEntry(row: QRLandingRow): PartnerEntry {
  const isPlace = row.entity_type === 'place'
  const category: PartnerCategory = isPlace
    ? 'atractivo'
    : CATEGORY_BY_SLUG[row.slug] ?? 'restaurante'
  const address = (isPlace ? row.place_address : row.business_address) ?? 'Arequipa, Perú'

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
  const { data, error } = await supabase
    .from('qr_landing')
    .select(
      'slug, entity_type, effective_points, is_active, place_name, place_address, business_name, business_address',
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

export { FALLBACK_PARTNERS }
