import { useId, useLayoutEffect, useRef } from 'react'
import type { ComponentPropsWithRef, ReactNode, RefObject, SyntheticEvent } from 'react'
import closeIcon from './assets/close.svg'
import styles from './OverlaySurface.module.css'

export type OverlayCloseReason = 'closeButton' | 'escape' | 'backdrop' | 'native'
export interface OverlaySurfaceProps extends Omit<ComponentPropsWithRef<'dialog'>, 'open' | 'title' | 'onClose' | 'onCancel' | 'children'> {
  open: boolean; onCloseRequest: (reason: OverlayCloseReason) => void; title: string; description?: string; message?: string
  children?: ReactNode; actions?: ReactNode; presentation: 'dialog' | 'right' | 'bottom' | 'fullscreen'
  size?: 'compact' | 'wide'; intent?: 'neutral' | 'danger'; dismissible?: boolean; dismissOnBackdrop?: boolean
  showClose?: boolean; closeLabel?: string; closeIconSrc?: string; showHandle?: boolean
  initialFocusRef?: RefObject<HTMLElement | null>; returnFocusRef?: RefObject<HTMLElement | null>
}
export function OverlaySurface({ open, onCloseRequest, title, description, message, children, actions, presentation, size = 'compact', intent = 'neutral', dismissible = true, dismissOnBackdrop = false, showClose = true, closeLabel = 'Fechar', closeIconSrc, showHandle = true, initialFocusRef, returnFocusRef, className, ref, ...props }: OverlaySurfaceProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const internalCloseEvents = useRef(0)
  const titleId = useId(), descriptionId = useId()
  if (!title.trim() || (description !== undefined && !description.trim()) || (message !== undefined && !message.trim()) || !closeLabel.trim()) throw new Error('A sobreposição requer título e textos fornecidos não vazios.')
  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !open) return
    const returnTarget = returnFocusRef?.current
    if (!dialog.open) dialog.showModal()
    const target = initialFocusRef?.current
    if (target && dialog.contains(target)) target.focus()
    else titleRef.current?.focus()
    return () => {
      if (dialog.open) { internalCloseEvents.current += 1; dialog.close() }
      if (returnTarget) queueMicrotask(() => {
        if (!dialog.open && returnTarget.isConnected) returnTarget.focus()
      })
    }
  }, [open, initialFocusRef, returnFocusRef])
  const closeNative = (event: SyntheticEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget) return
    if (internalCloseEvents.current > 0) { internalCloseEvents.current -= 1; return }
    if (open) {
      if (dismissible) onCloseRequest('native')
      if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal()
    }
  }
  return <dialog {...props} ref={node => { dialogRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) ref.current = node }} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} className={[styles.surface, styles[presentation], styles[size], styles[intent], className].filter(Boolean).join(' ')} onCancel={event => { if (event.target !== event.currentTarget) return; event.preventDefault(); if (dismissible) onCloseRequest('escape') }} onClose={closeNative} onClick={event => { if (!dismissible || !dismissOnBackdrop || event.target !== event.currentTarget) return; const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onCloseRequest('backdrop') }}>
    {presentation === 'bottom' && showHandle && <span className={styles.handle} aria-hidden="true" />}
    <header className={styles.header}><div className={styles.heading}><h2 ref={titleRef} id={titleId} tabIndex={-1} className={styles.title}>{title}</h2>{description && <p id={descriptionId} className={styles.description}>{description}</p>}</div>{dismissible && showClose && <button type="button" className={styles.close} aria-label={closeLabel} onClick={() => onCloseRequest('closeButton')}><img src={closeIconSrc ?? closeIcon} alt="" /></button>}</header>
    {(message || children != null) && <div className={styles.body}>{message && <p className={styles.message}>{message}</p>}{children}</div>}
    {actions != null && actions !== false && <footer className={styles.actions}>{actions}</footer>}
  </dialog>
}
