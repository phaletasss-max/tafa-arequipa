import { useState } from 'react'
import EmergencyBanner from '@/components/safety/EmergencyBanner'
import AccessibilityBar from '@/components/accessibility/AccessibilityBar'
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

      {/* ── 5. 6 Servicios Principales de la Plataforma TAFA ────────────── */}
      <Features />

      {/* ── 6. Inventario Oficial de Atractivos (Supabase + mock) ────────── */}
      <Highlights />

      {/* ── 7. Arequipa Inexplorada — Rutas Alternativas ─────────────────── */}
      <UnexploredRoutes />

      {/* ── 8. Mapa Interactivo con Coordenadas Reales ───────────────────── */}
      <MapPreview />

      {/* ── 9. ECOSISTEMA — Join TAFA (Postulación MYPEs) ───────────────── */}
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
      <div className="fixed bottom-6 left-6 z-40">
        <button
          id="btn-scan-qr"
          onClick={() => handleOpenQR('QR-PLAZA-01')}
          title="Escanear Señalética Digital QR — Turismo para Todos"
          aria-label="Escanear código QR turístico"
          className="bg-tafa-volcán hover:bg-tafa-lava text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 border border-white/20"
        >
          <QrCode className="w-5 h-5" />
          <span className="hidden sm:inline">Escanear QR Turístico</span>
        </button>
      </div>

      {/* ── Asistente AI Multilingüe ─────────────────────────────────────── */}
      <TouristAIAssistant />

      {/* ── Barra de Accesibilidad Universal WCAG 2.1 ───────────────────── */}
      <AccessibilityBar onFilterAccessibility={setAccFilter} />

      {/* ── Modal de Señalética Digital QR ──────────────────────────────── */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrId={activeQRId}
      />
    </div>
  )
}
