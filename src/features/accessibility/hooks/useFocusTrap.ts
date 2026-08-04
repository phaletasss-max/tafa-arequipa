import { useEffect, useRef } from 'react'

/**
 * Hook para gestionar focus trap en modales y diálogos
 * Asegura que:
 * 1. El focus se traslade al modal al abrirse
 * 2. El focus permanezca dentro del modal mientras está abierto
 * 3. La tecla Escape cierre el modal
 * 4. El focus se restaure al elemento anterior cuando se cierre
 * 
 * WCAG 2.2 AA Compliance:
 * - WCAG 2.4.3: Focus Order
 * - WCAG 2.1.1: Keyboard
 */

interface UseFocusTrapOptions {
  isOpen: boolean
  onClose: () => void
  initialFocusRef?: React.RefObject<HTMLElement>
  returnFocusRef?: React.RefObject<HTMLElement>
}

export function useFocusTrap({
  isOpen,
  onClose,
  initialFocusRef,
  returnFocusRef,
}: UseFocusTrapOptions) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    // Guardar el elemento enfocado actual para restaurarlo después
    previousFocusRef.current = document.activeElement as HTMLElement

    // Trasladar foco al elemento inicial (ej: input o botón close)
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus()
    } else if (containerRef.current) {
      containerRef.current.focus()
    }

    // Handler para tecla Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }

      // Focus trap: asegurar que Tab no salga del modal
      if (e.key === 'Tab' && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
        const activeElement = document.activeElement

        // Si Tab en último elemento, volver al primero
        if (e.shiftKey) {
          if (activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)

      // Restaurar foco al elemento anterior al cerrar modal
      if (returnFocusRef?.current) {
        returnFocusRef.current.focus()
      } else if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen, onClose, initialFocusRef, returnFocusRef])

  return containerRef
}
