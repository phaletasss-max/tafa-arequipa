import { createClient } from '@supabase/supabase-js'

/**
 * Configuración del cliente Supabase.
 *
 * Los valores se leen de variables de entorno Vite (`.env.local` en desarrollo,
 * Environment Variables del proyecto en Vercel). Se mantienen los valores del
 * proyecto MVP como respaldo para no romper despliegues ya publicados.
 *
 * La `anon key` es pública por diseño: la protección real de los datos depende
 * de las políticas RLS de Supabase (ver `database/migrations/003_rls_hardening.sql`).
 */
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://qorubtwxncubeyqttemn.supabase.co'

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvcnVidHd4bmN1YmV5cXR0ZW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzU2MTIsImV4cCI6MjA4MjYxMTYxMn0.Si8zrorHhIkwJ1sOZhXPmAoYZX1w5sChVi7KEAz8fjY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
