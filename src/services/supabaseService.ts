import { supabase } from '@/lib/supabase'
import { Lugar, Gastronomia, Evento, DashboardResumen } from './api'
import { MOCK_LUGARES, MOCK_GASTRONOMIA, MOCK_STATS } from '@/data/mockData'

/**
 * Servicio Supabase Cloud Native — con fallback robusto a mockData
 * Garantiza que todo lugar tenga imagen_url válida en public/images/places/
 */

function getMockImageForPlace(idOrName: number | string): string {
  const match = MOCK_LUGARES.find(m => m.id === idOrName || m.nombre.toLowerCase() === String(idOrName).toLowerCase())
  return match?.imagen_url || '/images/places/plaza-de-armas.jpg'
}

export async function getLugaresSupabase(categoria?: string, search?: string): Promise<Lugar[]> {
  // La tabla del catálogo es `places`. Antes se consultaba primero
  // `lugares_turisticos`, que no existe en el proyecto: cada carga disparaba un
  // 404 contra PostgREST antes de caer a este mismo camino.
  try {
    let query2 = supabase.from('places').select('*')
    if (search) query2 = query2.ilike('name', `%${search}%`)
    const { data: d2 } = await query2
    if (d2 && d2.length > 0) {
      return d2.map(p => ({
        id: p.id,
        nombre: p.name,
        categoria: p.category || 'Atractivo',
        descripcion: p.description,
        imagen_url: p.image_url || getMockImageForPlace(p.id || p.name),
        lat: p.lat,
        lng: p.lng,
        distrito: p.district || 'Arequipa',
        horario: p.opening_hours || '24 horas',
        precio_entrada: p.admission_fee || 'Acceso Libre',
        fuente: p.official_source || 'MINCETUR',
        verificado: p.is_verified ? 1 : 0,
        estado: 'activo',
      })) as Lugar[]
    }
  } catch (e2) { /* silencioso */ }

  // Fallback final: MOCK_LUGARES directo de data/mockData.ts
  let result = MOCK_LUGARES
  if (categoria) result = result.filter(l => l.categoria === categoria)
  if (search) result = result.filter(l => l.nombre.toLowerCase().includes(search.toLowerCase()))
  return result
}

/**
 * Picanterías y restaurantes aliados.
 *
 * La tabla real es `businesses`; la anterior consulta a `gastronomia` no existe
 * en el proyecto y devolvía 404 en cada carga, dejando siempre el mock. Se
 * filtran los rubros gastronómicos y se mapean al tipo `Gastronomia`.
 */
export async function getGastronomiaSupabase(): Promise<Gastronomia[]> {
  const RUBROS_GASTRONOMICOS = /picanter|restaurant|cafe|chicher|gastron/i

  try {
    const { data, error } = await supabase
      .from('businesses')
      .select('id, trade_name, business_name, description, address, slug, lat, lng')

    if (!error && data && data.length > 0) {
      const mapeados = data.map((b, i) => {
        const nombre = b.trade_name || b.business_name || b.slug
        const direccion: string = b.address ?? 'Arequipa, Perú'
        const distrito = direccion.split(',').map(s => s.trim()).filter(Boolean).pop() ?? 'Arequipa'
        return {
          id: typeof b.id === 'number' ? b.id : i + 1,
          nombre,
          tipo: 'Gastronomía Arequipeña',
          ubicacion: direccion,
          precio_rango: 'S/ 25 - 60',
          imagen_url: getMockImageForPlace(nombre),
          distrito,
          descripcion: b.description ?? '',
          rating: 0,
          lat: b.lat ?? 0,
          lng: b.lng ?? 0,
          slug: b.slug,
        } as Gastronomia & { slug?: string }
      })

      // Si algún registro identifica rubro gastronómico se prioriza; si no, se
      // devuelven todos los aliados (la base MVP no tiene `category_id` poblado).
      const soloGastro = mapeados.filter(m => RUBROS_GASTRONOMICOS.test(m.nombre) || RUBROS_GASTRONOMICOS.test(m.descripcion))
      return (soloGastro.length > 0 ? soloGastro : mapeados) as Gastronomia[]
    }
  } catch (e) {
    console.warn('Fallback a catálogo local de gastronomía:', e)
  }
  return MOCK_GASTRONOMIA
}

export async function getEventosSupabase(): Promise<Evento[]> {
  try {
    const { data, error } = await supabase.from('eventos').select('*').order('fecha_inicio', { ascending: true })
    if (!error && data && data.length > 0) return data as Evento[]
  } catch (e) { /* silencioso */ }
  return []
}

export async function submitEncuestaSupabase(encuesta: {
  origen: string;
  motivo: string;
  satisfaccion: number;
  gasto_promedio?: number;
  dias_estancia?: number;
}): Promise<boolean> {
  try {
    const { error } = await supabase.from('encuestas').insert([encuesta])
    if (!error) return true
  } catch (e) {
    console.warn('Fallback enviando encuesta local:', e)
  }

  try {
    const prev = JSON.parse(localStorage.getItem('tafa_encuestas_local') || '[]')
    prev.push({ ...encuesta, id: Date.now(), created_at: new Date().toISOString() })
    localStorage.setItem('tafa_encuestas_local', JSON.stringify(prev))
  } catch (_) {}
  return true
}

export async function getDashboardSupabase(): Promise<DashboardResumen> {
  try {
    const [lugares, gastro, eventos, encuestas] = await Promise.all([
      getLugaresSupabase(),
      getGastronomiaSupabase(),
      getEventosSupabase(),
      supabase.from('encuestas').select('satisfaccion'),
    ])

    const totalVerificados = lugares.filter(l => l.verificado === 1 || (l.verificado as any) === true).length
    const sats = (encuestas.data || []).map(e => e.satisfaccion)
    const avgSat = sats.length > 0 ? parseFloat((sats.reduce((a, b) => a + b, 0) / sats.length).toFixed(2)) : 4.8

    return {
      totales: {
        lugares: lugares.length,
        gastronomia: gastro.length,
        eventos: eventos.length,
        encuestas: sats.length || 10,
        verificados: totalVerificados,
      },
      avg_satisfaccion: avgSat,
      por_categoria: [],
      por_distrito: [],
      lugares_mapa: lugares,
      gastro_mapa: gastro,
      proximos_eventos: eventos.slice(0, 5),
    }
  } catch (e) {
    return {
      ...MOCK_STATS,
      lugares_mapa: MOCK_LUGARES,
      gastro_mapa: MOCK_GASTRONOMIA,
    } as DashboardResumen
  }
}
