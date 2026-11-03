import { createContext, useContext } from 'react'
import type { ToastMessage } from './toastModel'
export interface ToastContextValue { show: (toast: ToastMessage) => void; dismiss: (id: string) => void; clear: () => void }
export const ToastContext = createContext<ToastContextValue | null>(null)
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast deve ser usado dentro de ToastProvider.')
  return context
}
