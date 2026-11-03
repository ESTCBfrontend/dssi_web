import type { HTMLAttributes, ReactNode } from 'react'
import styles from './StatusBadge.module.css'
import neutralS from './assets/neutral-s.svg'
import infoS from './assets/info-s.svg'
import successS from './assets/success-s.svg'
import warningS from './assets/warning-s.svg'
import dangerS from './assets/danger-s.svg'
import solidS from './assets/solid-s.svg'
import neutralM from './assets/neutral-m.svg'
import infoM from './assets/info-m.svg'
import successM from './assets/success-m.svg'
import warningM from './assets/warning-m.svg'
import dangerM from './assets/danger-m.svg'
import solidM from './assets/solid-m.svg'

type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'
const dots = { small: { neutral: neutralS, info: infoS, success: successS, warning: warningS, danger: dangerS, solid: solidS }, medium: { neutral: neutralM, info: infoM, success: successM, warning: warningM, danger: dangerM, solid: solidM } }

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string
  tone?: Tone
  variant?: 'soft' | 'solid'
  size?: 'small' | 'medium'
  showDot?: boolean
  icon?: ReactNode
}

export function StatusBadge({ label, tone = 'neutral', variant = 'soft', size = 'small', showDot = false, icon, className, ...props }: StatusBadgeProps) {
  return <span {...props} className={[styles.badge, styles[size], styles[tone], styles[variant], className].filter(Boolean).join(' ')}>
    {showDot && <img src={dots[size][variant === 'solid' ? 'solid' : tone]} alt="" aria-hidden="true" />}
    {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
    <span>{label}</span>
  </span>
}
