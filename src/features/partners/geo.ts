/**
 * FASE 6 — Utilidades de proximidad geográfica.
 *
 * En la base MVP los 30 atractivos tienen `place_lat`/`place_lng`, pero los
 * negocios aliados los tienen en NULL. Como el caso más frecuente es escanear el
 * QR de una picantería, ordenar solo por coordenadas dejaría sin recomendaciones
 * justo al escenario principal. Por eso la posición se resuelve en dos niveles:
 *
 *  1. Coordenadas reales de la base, cuando existen.
 *  2. Centroide del distrito deducido de la dirección, marcado como aproximado.
 *
 * Las distancias derivadas del nivel 2 se muestran con "aprox." para no
 * presentar como exacto algo que no lo es.
 */

export interface Coords {
  lat: number
  lng: number
  /** true si proviene del centroide del distrito y no de la base. */
  approximate: boolean
}

const EARTH_RADIUS_KM = 6371

/** Distancia en kilómetros entre dos puntos (fórmula de haversine). */
export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/**
 * Centroides aproximados de los distritos y localidades presentes en el
 * catálogo TAFA (departamento de Arequipa).
 */
const DISTRICT_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  cercado: { lat: -16.3989, lng: -71.535 },
  arequipa: { lat: -16.3989, lng: -71.535 },
  yanahuara: { lat: -16.3897, lng: -71.5433 },
  sachaca: { lat: -16.4147, lng: -71.5697 },
  'cerro colorado': { lat: -16.3667, lng: -71.5833 },
  'jose luis bustamante y rivero': { lat: -16.4283, lng: -71.5286 },
  'selva alegre': { lat: -16.3833, lng: -71.5297 },
  miraflores: { lat: -16.3897, lng: -71.5197 },
  paucarpata: { lat: -16.4197, lng: -71.5033 },
  characato: { lat: -16.4583, lng: -71.4833 },
  sabandia: { lat: -16.4653, lng: -71.4869 },
  tiabaya: { lat: -16.4497, lng: -71.5947 },
  socabaya: { lat: -16.4636, lng: -71.5344 },
  chivay: { lat: -15.6383, lng: -71.6008 },
  yanque: { lat: -15.6503, lng: -71.6478 },
  cabanaconde: { lat: -15.6206, lng: -71.9786 },
  mollendo: { lat: -17.0233, lng: -72.0147 },
  mejia: { lat: -17.1006, lng: -71.9942 },
  corire: { lat: -16.2311, lng: -72.5497 },
  cotahuasi: { lat: -15.2131, lng: -72.8892 },
  andagua: { lat: -15.4964, lng: -72.3536 },
}

/** Normaliza para comparar: minúsculas y sin tildes. */
// Rango de diacríticos combinantes. Se construye desde una cadena escapada para
// que el patrón no dependa de la codificación con la que se guarde el archivo.
const COMBINING_MARKS = new RegExp('[\\u0300-\\u036f]', 'g')

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .trim()
}

/**
 * Deduce el centroide a partir de una dirección buscando el nombre de distrito
 * en cualquiera de sus segmentos ("Calle Grau 204, Sachaca" → Sachaca).
 */
export function centroidFromAddress(address: string | null | undefined): Coords | null {
  if (!address) return null

  const segments = normalize(address).split(',').map(s => s.trim()).filter(Boolean)

  // Se recorre de derecha a izquierda: el distrito suele ir al final.
  for (let i = segments.length - 1; i >= 0; i--) {
    const hit = DISTRICT_CENTROIDS[segments[i]]
    if (hit) return { ...hit, approximate: true }
  }

  // Segundo intento: el nombre del distrito puede ir embebido en el texto.
  const full = normalize(address)
  for (const [district, coords] of Object.entries(DISTRICT_CENTROIDS)) {
    if (full.includes(district)) return { ...coords, approximate: true }
  }

  return null
}

/** Formatea la distancia para mostrarla al turista. */
export function formatDistance(km: number, approximate: boolean): string {
  const value = km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`
  return approximate ? `aprox. ${value}` : `a ${value}`
}
