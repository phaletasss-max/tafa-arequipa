import { Bot } from 'lucide-react'

interface AIAccessButtonProps {
  onOpenAI?: () => void
}

export default function AIAccessButton({ onOpenAI }: AIAccessButtonProps) {
  return (
    <button
      onClick={() => onOpenAI && onOpenAI()}
      title="Asistente de Inteligencia Artificial TAFA AI"
      aria-label="Abrir Asistente AI"
      className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3.5 py-1 rounded-full text-xs transition-colors shadow-sm"
    >
      <Bot className="w-3.5 h-3.5 shrink-0" />
      <span>TAFA AI</span>
    </button>
  )
}
