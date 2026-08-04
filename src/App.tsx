import { useState, useEffect } from 'react'
import { AccessibilityProvider } from '@/features/accessibility/context/AccessibilityContext'
import QuickAccessBar from '@/features/accessibility/components/QuickAccessBar'
import Hero from '@/components/Hero'
import CinematicStoryteller from '@/components/CinematicStoryteller'
import Highlights from '@/components/Highlights'
import Footer from '@/components/Footer'
import TouristAIAssistant from '@/components/ai/TouristAIAssistant'
import AuthModal from '@/components/auth/AuthModal'
import TAFAExplorerPassModal from '@/components/rewards/TAFAExplorerPassModal'

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isPassOpen, setIsPassOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isSignLanguageOpen, setIsSignLanguageOpen] = useState(false)
  const [touristUser, setTouristUser] = useState<{ nombre: string; docType: string; docNum: string } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('tafa_tourist_user')
    if (saved) {
      try { setTouristUser(JSON.parse(saved)); } catch (e) {}
    }
  }, [])

  return (
    <AccessibilityProvider>
      <div className="w-full overflow-x-hidden bg-white text-tafa-text font-sans">
        {/* ── Barra Superior de Configuración Institucional (WCAG 2.2 AA) ─── */}
        <QuickAccessBar
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenPass={() => setIsPassOpen(true)}
          onOpenAI={() => setIsAIOpen(true)}
          onOpenSignLanguage={() => setIsSignLanguageOpen(true)}
          touristUser={touristUser}
        />

        {/* ── 1. Hero Principal Cinematográfico ───────────────────────────── */}
        <CinematicStoryteller />

        {/* ── 2. Explorador Turístico Oficial (Atractivos + Proyectos) ────── */}
        <Highlights />

        {/* ── 3. Footer ────────────────────────────────────────────────────── */}
        <Footer />

        {/* ── Asistente AI Multilingüe ─────────────────────────────────────── */}
        <TouristAIAssistant />

        {/* ── Modales de Cuenta & Puntos ──────────────────────────────────── */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(u) => setTouristUser(u)}
        />

        <TAFAExplorerPassModal
          isOpen={isPassOpen}
          onClose={() => setIsPassOpen(false)}
        />
      </div>
    </AccessibilityProvider>
  )
}
