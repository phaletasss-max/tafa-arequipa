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
        {/* ── Skip to Main Content Link (WCAG 2.1 — Navigation) ─────────── */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:p-4 focus:bg-tafa-volcán focus:text-white focus:font-bold"
        >
          {typeof document !== 'undefined' && document.documentElement.lang === 'es' 
            ? 'Ir al contenido principal' 
            : 'Skip to main content'}
        </a>

        {/* ── Barra Superior de Configuración Institucional (WCAG 2.2 AA) ─── */}
        <QuickAccessBar
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenSettings={() => setIsPassOpen(true)}
          onOpenAI={() => setIsAIOpen(true)}
          onOpenSignLanguage={() => setIsSignLanguageOpen(true)}
        />

        {/* ── Main Content Area (WCAG 2.4.1 — Main landmark) ────────────── */}
        <main id="main-content" role="main">
          {/* ── 1. Hero Principal Cinematográfico ─────────────────────────────── */}
          <CinematicStoryteller />

          {/* ── 2. Explorador Turístico Oficial (Atractivos + Proyectos) ──────── */}
          <Highlights />

          {/* ── Asistente AI Multilingüe ──────────────────────────────────────── */}
          <TouristAIAssistant />
        </main>

        {/* ── 3. Footer ────────────────────────────────────────────────────── */}
        <Footer />

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
