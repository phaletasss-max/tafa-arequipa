import { User, ShieldCheck } from 'lucide-react'

interface UserMenuProps {
  touristUser?: { nombre: string; docType: string; docNum: string } | null
  onOpenAuth?: () => void
  onOpenPass?: () => void
}

export default function UserMenu({ touristUser, onOpenAuth, onOpenPass }: UserMenuProps) {
  if (touristUser) {
    return (
      <button
        onClick={() => onOpenPass && onOpenPass()}
        title="Perfil de Turista y Puntos TAFA Pass"
        aria-label="Ver perfil de turista"
        className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 rounded-full px-3.5 py-1 font-semibold hover:bg-emerald-900/80 transition-colors"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>{touristUser.nombre} ({touristUser.docType})</span>
      </button>
    )
  }

  return (
    <button
      onClick={() => onOpenAuth && onOpenAuth()}
      title="Acceso o registro de turista"
      aria-label="Cuenta Turista"
      className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3.5 py-1 font-semibold text-slate-200 transition-colors"
    >
      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span>Cuenta Turista</span>
    </button>
  )
}
