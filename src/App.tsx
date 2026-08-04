import CinematicStoryteller from '@/components/CinematicStoryteller'
import Highlights from '@/components/Highlights'
import Footer from '@/components/Footer'
import TouristAIAssistant from '@/components/ai/TouristAIAssistant'

export default function App() {
  return (
    <div className="w-full overflow-x-hidden bg-white text-tafa-text font-sans">
      {/* ── 1. Hero Principal Cinematográfico ───────────────────────────── */}
      <CinematicStoryteller />

      {/* ── 2. Explorador Turístico Oficial (Atractivos + Proyectos) ────── */}
      <Highlights />

      {/* ── 3. Footer ────────────────────────────────────────────────────── */}
      <Footer />

      {/* ── Asistente AI Multilingüe ─────────────────────────────────────── */}
      <TouristAIAssistant />
    </div>
  )
}
