import { User, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface UserMenuProps {
  onOpenAuth?: () => void
  onOpenSettings?: () => void
}

export default function UserMenu({ onOpenAuth, onOpenSettings }: UserMenuProps) {
  const { t } = useTranslation('navigation')

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
