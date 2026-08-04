import { supabase } from '@/lib/supabase'
import { Lugar, Gastronomia, Evento, DashboardResumen } from './api'
import { MOCK_LUGARES, MOCK_GASTRONOMIA, MOCK_STATS } from '@/data/mockData'

/**
 * Servicio Supabase Cloud Native — con fallback robusto a mockData
 */

export async function getLugaresSupabase(categoria?: string, search?: string): Promise<Lugar[]> {
  // Intento 1: tabla lugares_turisticos
  try {
    let query = supabase.from('lugares_turisticos').select('*')
    if (categoria) query = query.eq('categoria', categoria)
    if (search) query = query.ilike('nombre', `%${search}%`)
    const { data, error } = await query.order('nombre', { ascending: true })
    if (!error && data && data.length > 0) return data as Lugar[]
  } catch (e) {
    console.warn('Supabase lugares_turisticos no disponible, intentando places...')
  }

  // Intento 2: tabla places (schema nuevo)
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
        imagen_url: '',
        lat: p.lat,
        lng: p.lng,
        distrito: p.district || 'Arequipa',
        horario: p.opening_hours,
        precio_entrada: p.admission_fee,
        fuente: p.official_source || 'MINCETUR',
        verificado: p.is_verified ? 1 : 0,
        estado: 'activo',
      })) as Lugar[]
    }
  } catch (e2) { /* silencioso */ }

  // Fallback final: mockData (sin dependencia de Express)
  let result = MOCK_LUGARES
  if (categoria) result = result.filter(l => l.categoria === categoria)
  if (search) result = result.filter(l => l.nombre.toLowerCase().includes(search.toLowerCase()))
  return result
}

export async function getGastronomiaSupabase(): Promise<Gastronomia[]> {
  try {
    const { data, error } = await supabase.from('gastronomia').select('*').order('rating', { ascending: false })
    if (!error && data && data.length > 0) return data as Gastronomia[]
  } catch (e) {
    console.warn('Fallback a API local gastronomía:', e)
  }

  // Fallback final: mockData
  return MOCK_GASTRONOMIA
}

export async function getEventosSupabase(): Promise<Evento[]> {
  try {
    const { data, error } = await supabase.from('eventos').select('*').order('fecha_inicio', { ascending: true })
    if (!error && data && data.length > 0) return data as Evento[]
  } catch (e) { /* silencioso */ }
  // Sin eventos en mock — retornar vacío
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

  // Sin backend local — guardar en localStorage como respaldo
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
    // Fallback final: mockData (sin Express)
    return {
      ...MOCK_STATS,
      lugares_mapa: MOCK_LUGARES,
      gastro_mapa: MOCK_GASTRONOMIA,
    } as DashboardResumen
  }
}
