/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL del proyecto Supabase (https://xxxx.supabase.co). */
  readonly VITE_SUPABASE_URL?: string
  /** Clave anónima pública de Supabase. La seguridad real depende de RLS. */
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Base pública del sitio, usada para construir las URLs de los QR impresos. */
  readonly VITE_PUBLIC_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
