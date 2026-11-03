import compactSpinner from './assets/compact.svg'
import comfortableSpinner from './assets/comfortable.svg'
import styles from './LoadingIndicator.module.css'

export interface LoadingIndicatorProps {
  type?: 'spinner' | 'inline' | 'skeleton'
  size?: 'compact' | 'comfortable'
  label?: string
  active?: boolean
  reducedMotion?: boolean
  className?: string
}

export function LoadingIndicator({ type = 'spinner', size = 'compact', label = 'A processar...', active = true, reducedMotion = false, className }: LoadingIndicatorProps) {
  if (!active) return null
  return <div role="status" className={[styles.root, styles[type], styles[size], reducedMotion && styles.reducedMotion, className].filter(Boolean).join(' ')}>
    {type === 'skeleton' ? <><span className={styles.srOnly}>{label}</span><span className={styles.lines} aria-hidden="true"><span /><span /><span /></span></> : <><img alt="" aria-hidden="true" className={styles.spinnerArt} src={size === 'compact' ? compactSpinner : comfortableSpinner} /><span className={type === 'inline' ? styles.label : styles.srOnly}>{label}</span></>}
  </div>
}
