import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  loading?: boolean
  iconStart?: ReactNode
  iconEnd?: ReactNode
  fullWidth?: boolean
}

export function Button({ size = 'medium', variant = 'primary', loading = false, disabled = false, iconStart, iconEnd, fullWidth = false, type = 'button', className, children, ...props }: ButtonProps) {
  return (
    <button {...props} type={type} disabled={disabled || loading} aria-busy={loading || undefined} className={[styles.button, styles[size], styles[variant], fullWidth && styles.fullWidth, className].filter(Boolean).join(' ')}>
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : iconStart && <span className={styles.icon} aria-hidden="true">{iconStart}</span>}
      <span>{children}</span>
      {iconEnd && <span className={styles.icon} aria-hidden="true">{iconEnd}</span>}
    </button>
  )
}
