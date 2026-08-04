import { useState } from 'react'
import EmergencyBanner from '@/components/safety/EmergencyBanner'
import CinematicStoryteller from '@/components/CinematicStoryteller'
import DirectAIConversation from '@/components/ai/DirectAIConversation'
import HistoricVisualStories from '@/components/stories/HistoricVisualStories'
import Features from '@/components/Features'
import Highlights from '@/components/Highlights'
import MapPreview from '@/components/MapPreview'
import UnexploredRoutes from '@/components/UnexploredRoutes'
import JoinEcosystem from '@/components/ecosystem/JoinEcosystem'
import AboutProject from '@/components/AboutProject'
import Stats from '@/components/Stats'
import Institutions from '@/components/Institutions'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import QRModal from '@/components/QRModal'
import TouristAIAssistant from '@/components/ai/TouristAIAssistant'
import { QrCode } from 'lucide-react'

export default function App() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [activeQRId, setActiveQRId] = useState('QR-PLAZA-01')
  const [accFilter, setAccFilter] = useState<'motriz' | 'auditiva' | 'visual' | null>(null)

  function handleOpenQR(id: string) {
    setActiveQRId(id)
    setIsQRModalOpen(true)
  }

  return (
    <div className="w-full overflow-x-hidden bg-white text-tafa-text font-sans">

      {/* ── 1. Banner Seguridad & Prevención Turística ──────────────────── */}
      <EmergencyBanner />

      {/* ── 2. PORTAL TURISTA — Storytelling Cinematográfico 9 Capítulos ── */}
      <CinematicStoryteller />

      {/* ── 3. Conversación Directa con IA ─────────────────────────────── */}
      <DirectAIConversation />

      {/* ── 4. Historias Visuales Interactivas de Lugares Históricos ────── */}
      <HistoricVisualStories />

      {/* ── 5. Inventario Oficial de Atractivos (Supabase + mock) ────────── */}
      <Highlights />

      {/* ── 6. Arequipa Inexplorada — 10 Proyectos de Innovación Regional ── */}
      <UnexploredRoutes />

      {/* ── 7. Mapa Interactivo con Coordenadas Reales ───────────────────── */}
      <MapPreview />

      {/* ── 8. ECOSISTEMA MYPE — Servicios de Plataforma & Postulación ───── */}
      <Features />
      <JoinEcosystem />

      {/* ── 10. PROYECTO — Conoce TAFA (Explicación Institucional) ──────── */}
      <AboutProject />

      {/* ── 11. Métricas e Instituciones ─────────────────────────────────── */}
      <Stats />
      <Institutions />

      {/* ── 12. CTA & Footer ─────────────────────────────────────────────── */}
      <CTA />
      <Footer />

      {/* ── Botón flotante de Escaneo QR ─────────────────────────────────── */}


      {/* ── Asistente AI Multilingüe ─────────────────────────────────────── */}
      <TouristAIAssistant />

      {/* ── Modal de Señalética Digital QR ──────────────────────────────── */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrId={activeQRId}
      />
    </div>
  )
}
