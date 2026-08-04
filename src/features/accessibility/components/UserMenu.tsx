import { useState, useEffect } from 'react'
import { User, Settings, LogOut, Award, Sparkles, UserCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getStoredProfile, clearProfileSession, type TAFAProfile } from '@/services/authService'

interface UserMenuProps {
  onOpenAuth?: () => void
  onOpenSettings?: () => void
}

export default function UserMenu({ onOpenAuth, onOpenSettings }: UserMenuProps) {
  const { t } = useTranslation('navigation')
  const [profile, setProfile] = useState<TAFAProfile | null>(getStoredProfile())

  useEffect(() => {
    function syncAuth() {
      setProfile(getStoredProfile())
    }
    window.addEventListener('tafa_auth_changed', syncAuth)
    window.addEventListener('storage', syncAuth)
    return () => {
      window.removeEventListener('tafa_auth_changed', syncAuth)
      window.removeEventListener('storage', syncAuth)
    }
  }, [])

  function handleLogout() {
    clearProfileSession()
    setProfile(null)
  }

  if (profile) {
    const firstName = profile.full_name ? profile.full_name.split(' ')[0] : 'Turista'
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onOpenSettings && onOpenSettings()}
          title="Ver mi Pase Turístico TAFA"
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1 text-slate-200 text-xs font-bold transition-all shadow-sm"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-[10px]">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline text-white">Hola, {firstName}</span>
          <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {profile.points_earned || 100} pts
          </span>
        </button>

        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => onOpenAuth && onOpenAuth()}
        title="Acceso de usuario"
        aria-label="Acceder a la cuenta"
        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3.5 py-1 font-semibold text-slate-200 transition-colors"
      >
        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{t('sign_in')}</span>
      </button>

      <button
        onClick={() => onOpenSettings && onOpenSettings()}
        title="Configuración"
        aria-label="Configuración de usuario"
        className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
      >
        <Settings className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
