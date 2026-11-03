import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ToastContext } from './context'
import { ToastSnackbar } from './ToastSnackbar'
import { validateToast } from './toastModel'
import type { ToastMessage } from './toastModel'
import styles from './ToastProvider.module.css'

export interface ToastProviderProps { children: ReactNode; closeLabel?: string; closeIconSrc?: string }
export function ToastProvider({ children, closeLabel, closeIconSrc }: ToastProviderProps) {
  const [queue, setQueue] = useState<ToastMessage[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const show = useCallback((toast: ToastMessage) => { validateToast(toast); setQueue(current => current.some(item => item.id === toast.id) ? current : [...current, toast]) }, [])
  const dismiss = useCallback((id: string) => { setQueue(current => current.filter(item => item.id !== id)); setHoveredId(current => current === id ? null : current); setFocusedId(current => current === id ? null : current) }, [])
  const clear = useCallback(() => { setQueue([]); setHoveredId(null); setFocusedId(null) }, [])
  const context = useMemo(() => ({ show, dismiss, clear }), [show, dismiss, clear])
  const active = queue[0]
  useEffect(() => {
    if (!active || hoveredId === active.id || focusedId === active.id) return
    const duration = active.durationMs === undefined ? (active.action || active.tone === 'danger' ? null : 5000) : active.durationMs
    if (duration === null) return
    const timer = window.setTimeout(() => dismiss(active.id), duration)
    return () => window.clearTimeout(timer)
  }, [active, dismiss, hoveredId, focusedId])
  const announcement = active ? [active.title, active.message].filter(Boolean).join('. ') : ''
  const displayed = active ? { ...active, action: active.action ? { ...active.action, onPress: () => { try { active.action?.onPress() } finally { dismiss(active.id) } } } : undefined } : undefined
  return <ToastContext.Provider value={context}>{children}<div className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">{active?.tone !== 'danger' ? announcement : ''}</div><div className={styles.srOnly} role="alert" aria-live="assertive" aria-atomic="true">{active?.tone === 'danger' ? announcement : ''}</div>
    {displayed && <div className={styles.host} onMouseEnter={() => setHoveredId(displayed.id)} onMouseLeave={() => setHoveredId(null)} onFocusCapture={() => setFocusedId(displayed.id)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusedId(null) }}><ToastSnackbar key={displayed.id} toast={displayed} announce={false} closeLabel={closeLabel} closeIconSrc={closeIconSrc} onDismiss={() => dismiss(displayed.id)} /></div>}
  </ToastContext.Provider>
}
