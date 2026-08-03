import { useState } from 'react'
import EmergencyBanner from '@/components/safety/EmergencyBanner'
import AccessibilityBar from '@/components/accessibility/AccessibilityBar'
import CinematicStoryteller from '@/components/CinematicStoryteller'
import DirectAIConversation from '@/components/ai/DirectAIConversation'
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
      {/* Banner de Prevención & Emergencias Turísticas */}
      <EmergencyBanner />

      {/* PORTAL 1: TURISTA — Storytelling Cinematográfico 9 Capítulos */}
      <CinematicStoryteller />

      {/* Conversación Directa con IA (Inmediatamente después de la historia) */}
      <DirectAIConversation />

      {/* Inventario Oficial & Atractivos en Supabase */}
      <Highlights />

      {/* Arequipa Inexplorada (Rutas Alternativas) */}
      <UnexploredRoutes />

      {/* Mapa Interactivo con Coordenadas Reales */}
      <MapPreview />

      {/* PORTAL 3: ECOSISTEMA — Join TAFA Ecosystem (Postulación MYPEs) */}
      <JoinEcosystem />

      {/* PORTAL 2: PROYECTO — Conoce el Proyecto TAFA (Explicación Institucional) */}
      <AboutProject />

      {/* Métricas e Instituciones */}
      <Stats />
      <Institutions />

      {/* Botón Flotante de Escaneo de Señalética QR */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => handleOpenQR('QR-PLAZA-01')}
          title="Escanear Señalética Digital QR"
          className="bg-tafa-volcán hover:bg-tafa-lava text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 border border-white/20"
        >
          <QrCode className="w-5 h-5" />
          <span className="hidden sm:inline">Escanear QR Turístico</span>
        </button>
      </div>

      {/* Asistente AI Multilingüe Gemini 3.6 Flash */}
      <TouristAIAssistant />

      {/* Llamado a la Acción & Pie de Página */}
      <CTA />
      <Footer />

      {/* Barra de Accesibilidad Universal WCAG 2.1 */}
      <AccessibilityBar onFilterAccessibility={setAccFilter} />

      {/* Modal de Señalética Digital QR */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrId={activeQRId}
      />
    </div>
  )
}
