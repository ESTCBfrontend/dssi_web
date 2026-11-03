import compactSpinner from './assets/compact.svg'
import comfortableSpinner from './assets/comfortable.svg'
import styles from './LoadingIndicator.module.css'
import type { HTMLAttributes } from 'react'

export interface LoadingIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  type?: 'spinner' | 'inline' | 'skeleton'
  size?: 'compact' | 'comfortable'
  label?: string
  active?: boolean
  reducedMotion?: boolean
  skeletonLines?: number
  spinnerSrc?: string
  className?: string
}

export function LoadingIndicator({ type = 'spinner', size = 'comfortable', label = 'A processar...', active = true, reducedMotion = false, skeletonLines = 3, spinnerSrc, className, ...props }: LoadingIndicatorProps) {
  if (!label.trim()) throw new Error('LoadingIndicator requer uma label não vazia.')
  if (!Number.isSafeInteger(skeletonLines) || skeletonLines < 1 || skeletonLines > 20) throw new Error('LoadingIndicator requer entre 1 e 20 linhas inteiras.')
  if (!active) return null
  return <div {...props} role="status" aria-live={props['aria-live'] ?? 'off'} className={[styles.root, styles[type], styles[size], reducedMotion && styles.reducedMotion, className].filter(Boolean).join(' ')}>
    {type === 'skeleton' ? <><span className={styles.srOnly}>{label}</span><span className={styles.lines} aria-hidden="true">{Array.from({ length: skeletonLines }, (_, index) => <span key={index} />)}</span></> : <><img alt="" aria-hidden="true" className={[styles.spinnerArt, styles[`${size}Art`]].join(' ')} src={spinnerSrc ?? (size === 'compact' ? compactSpinner : comfortableSpinner)} /><span className={type === 'inline' ? styles.label : styles.srOnly}>{label}</span></>}
  </div>
}
