import { supabase } from '@/lib/supabase'

export interface TAFAExplorerPassUser {
  id?: string
  email: string
  nombre_completo: string
  tipo_doc: 'DNI' | 'PASAPORTE' | 'CE' | 'OTRO'
  num_doc: string
  tafa_explorer_pass: string
  puntos_acumulados: number
}

export interface AccesibilidadUsuario {
  usa_silla_ruedas: boolean
  usa_baston: boolean
  movilidad_reducida: boolean
  adulto_mayor: boolean
  coche_bebe: boolean
  baja_vision: boolean
  ceguera_total: boolean
  hipoacusia: boolean
  lengua_senas: boolean
  lectura_simplificada: boolean
  idioma_pref: string
}

export interface NegocioAliado {
  id: string
  ruc: string
  razon_social: string
  nombre_comercial: string
  categoria: string
  estado: 'pendiente' | 'evaluacion' | 'aprobado' | 'aliado' | 'suspendido' | 'retirado'
  distrito: string
  direccion: string
  lat: number
  lng: number
  calificacion_promedio: number
  distintivo_dircetur: boolean
  acc_motriz: boolean
}

export interface RecompensaCatalogo {
  id: string
  negocio_aliado_id: string
  titulo: string
  descripcion: string
  puntos_requeridos: number
  stock_disponible: number
}

/**
 * Genera un código único TAFA Explorer Pass (Ej: TAFA-PASS-9B2F1)
 */
export function generateTAFAExplorerPassCode(): string {
  const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `TAFA-PASS-${randomHex}`
}

/**
 * Registra un nuevo usuario con su TAFA Explorer Pass en Supabase
 */
export async function registerTAFAExplorerPass(
  nombre: string,
  email: string,
  tipoDoc: 'DNI' | 'PASAPORTE' | 'CE' | 'OTRO',
  numDoc: string,
  accesibilidad?: Partial<AccesibilidadUsuario>
): Promise<TAFAExplorerPassUser> {
  const passCode = generateTAFAExplorerPassCode()

  const newUser: Partial<TAFAExplorerPassUser> = {
    email: email.trim().toLowerCase(),
    nombre_completo: nombre.trim(),
    tipo_doc: tipoDoc,
    num_doc: numDoc.trim(),
    tafa_explorer_pass: passCode,
    puntos_acumulados: 100, // Puntos de bienvenida por registro
  }

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([newUser])
      .select()
      .single()

    if (error) {
      console.warn('Advertencia al insertar en Supabase usuarios:', error.message)
    }

    const created = data || { ...newUser, id: 'local-' + Date.now() }

    // Guardar accesibilidad si fue provista
    if (accesibilidad && created.id) {
      await supabase.from('accesibilidad_usuario').insert([{
        usuario_id: created.id,
        ...accesibilidad
      }])
    }

    localStorage.setItem('tafa_explorer_pass_user', JSON.stringify(created))
    return created as TAFAExplorerPassUser
  } catch (e) {
    console.warn('Fallback guardando TAFA Explorer Pass en localStorage:', e)
    localStorage.setItem('tafa_explorer_pass_user', JSON.stringify(newUser))
    return newUser as TAFAExplorerPassUser
  }
}

/**
 * Consulta negocios aliados aprobados desde Supabase
 */
export async function getNegociosAliados(): Promise<NegocioAliado[]> {
  try {
    const { data, error } = await supabase
      .from('negocios_aliados')
      .select('*')
      .or('estado.eq.aliado,estado.eq.aprobado')
      .order('calificacion_promedio', { ascending: false })

    if (error) throw error
    if (data && data.length > 0) return data as NegocioAliado[]
  } catch (e) {
    console.warn('Fallback negocios aliados:', e)
  }

  return [
    {
      id: 'n1',
      ruc: '20123456781',
      razon_social: 'La Nueva Palomino E.I.R.L.',
      nombre_comercial: 'La Nueva Palomino',
      categoria: 'Picantería Tradicional',
      estado: 'aliado',
      distrito: 'Yanahuara',
      direccion: 'Calle Leoncio Prado 122',
      lat: -16.3847,
      lng: -71.5461,
      calificacion_promedio: 4.8,
      distintivo_dircetur: true,
      acc_motriz: true,
    },
    {
      id: 'n2',
      ruc: '20987654321',
      razon_social: 'Chicha por Gastón Acurio S.A.C.',
      nombre_comercial: 'Chicha Arequipa',
      categoria: 'Restaurante Fusión',
      estado: 'aliado',
      distrito: 'Cercado',
      direccion: 'Santa Catalina 210',
      lat: -16.3991,
      lng: -71.5374,
      calificacion_promedio: 4.7,
      distintivo_dircetur: true,
      acc_motriz: true,
    },
  ]
}

/**
 * Consulta catálogo de recompensas canjeables con puntos
 */
export async function getRecompensasCatalogo(): Promise<RecompensaCatalogo[]> {
  try {
    const { data, error } = await supabase
      .from('recompensas_catalogo')
      .select('*')
      .eq('activo', true)

    if (error) throw error
    if (data && data.length > 0) return data as RecompensaCatalogo[]
  } catch (e) {
    console.warn('Fallback catálogo de recompensas:', e)
  }

  return [
    {
      id: 'r1',
      negocio_aliado_id: 'n1',
      titulo: '15% de Descuento en Rocoto Relleno Tradicional',
      descripcion: 'Canjea 150 Puntos TAFA por un 15% de descuento en tu consumo en La Nueva Palomino.',
      puntos_requeridos: 150,
      stock_disponible: 50,
    },
    {
      id: 'r2',
      negocio_aliado_id: 'n2',
      titulo: 'Bebida de Chicha de Jora Gratis',
      descripcion: 'Canjea 100 Puntos TAFA por una jarra de chicha de jora artesanal.',
      puntos_requeridos: 100,
      stock_disponible: 80,
    },
  ]
}
