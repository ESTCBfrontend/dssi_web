import type { ComponentPropsWithRef, ReactNode } from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  loading?: boolean
  loadingLabel?: string
  iconStart?: ReactNode
  iconEnd?: ReactNode
  fullWidth?: boolean
}

export function Button({ size = 'medium', variant = 'primary', loading = false, loadingLabel, disabled = false, iconStart, iconEnd, fullWidth = false, type = 'button', className, children, ...props }: ButtonProps) {
  if (loadingLabel !== undefined && !loadingLabel.trim()) throw new Error('Button requer uma loadingLabel não vazia.')
  return (
    <button {...props} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={[styles.button, styles[size], styles[variant], fullWidth && styles.fullWidth, className].filter(Boolean).join(' ')}>
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : iconStart && <span className={styles.icon} aria-hidden="true">{iconStart}</span>}
      <span>{loading && loadingLabel ? loadingLabel : children}</span>
      {iconEnd && <span className={styles.icon} aria-hidden="true">{iconEnd}</span>}
    </button>
  )
}
