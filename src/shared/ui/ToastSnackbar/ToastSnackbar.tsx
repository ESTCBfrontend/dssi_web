import type { ComponentPropsWithRef } from 'react'
import { AlertIcon } from '../AlertIcon'
import { Button } from '../Button'
import { validateToast } from './toastModel'
import type { ToastMessage } from './toastModel'
import closeIcon from './assets/close.svg'
import styles from './ToastSnackbar.module.css'

export interface ToastSnackbarProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> { toast: ToastMessage; onDismiss?: () => void; closeLabel?: string; closeIconSrc?: string; announce?: boolean }
export function ToastSnackbar({ toast, onDismiss, closeLabel = 'Fechar notificação', closeIconSrc, announce = true, className, ...props }: ToastSnackbarProps) {
  validateToast(toast)
  if (!closeLabel.trim()) throw new Error('ToastSnackbar requer uma etiqueta de fecho não vazia.')
  return <div {...props} className={[styles.toast, className].filter(Boolean).join(' ')}><AlertIcon tone={toast.tone ?? 'info'} /><div className={styles.message} role={announce ? (toast.tone === 'danger' ? 'alert' : 'status') : undefined} aria-live={announce ? (toast.tone === 'danger' ? 'assertive' : 'polite') : undefined}>{toast.title && <strong>{toast.title}</strong>}<span>{toast.message}</span></div>
    {toast.action && <Button variant="outline" onClick={toast.action.onPress}>{toast.action.label}</Button>}{onDismiss && toast.dismissible !== false && <button type="button" className={styles.close} aria-label={closeLabel} onClick={onDismiss}><img src={closeIconSrc ?? closeIcon} alt="" /></button>}</div>
}
