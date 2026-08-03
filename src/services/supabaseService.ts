import { supabase } from '@/lib/supabase'
import { Lugar, Gastronomia, Evento, DashboardResumen } from './api'

/**
 * Servicio Supabase Cloud Native para el Portal del Turista
 */

export async function getLugaresSupabase(categoria?: string, search?: string): Promise<Lugar[]> {
  try {
    let query = supabase.from('lugares_turisticos').select('*').eq('estado', 'activo')

    if (categoria) query = query.eq('categoria', categoria)
    if (search) query = query.ilike('nombre', `%${search}%`)

    const { data, error } = await query.order('verificado', { ascending: false }).order('nombre', { ascending: true })

    if (error) throw error
    if (data && data.length > 0) return data as Lugar[]
  } catch (e) {
    console.warn('⚠️ Supabase no disponible o vacío. Usando API local fallback:', e)
  }

  // Fallback a API local
  const params = new URLSearchParams()
  if (categoria) params.append('categoria', categoria)
  if (search) params.append('search', search)
  const res = await fetch(`/api/lugares?${params.toString()}`)
  const json = await res.json()
  return json.data || []
}

export async function getGastronomiaSupabase(): Promise<Gastronomia[]> {
  try {
    const { data, error } = await supabase.from('gastronomia').select('*').eq('estado', 'activo').order('rating', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) return data as Gastronomia[]
  } catch (e) {
    console.warn('⚠️ Fallback a API local gastronomía:', e)
  }
  const res = await fetch('/api/gastronomia')
  const json = await res.json()
  return json.data || []
}

export async function getEventosSupabase(): Promise<Evento[]> {
  try {
    const { data, error } = await supabase.from('eventos').select('*').eq('estado', 'activo').order('fecha_inicio', { ascending: true })
    if (error) throw error
    if (data && data.length > 0) return data as Evento[]
  } catch (e) {
    console.warn('⚠️ Fallback a API local eventos:', e)
  }
  const res = await fetch('/api/eventos')
  const json = await res.json()
  return json.data || []
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
    console.warn('⚠️ Fallback enviando encuesta local:', e)
  }

  const res = await fetch('/api/encuestas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(encuesta),
  })
  return res.ok
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
    const res = await fetch('/api/dashboard')
    return res.json()
  }
}
