import { useId } from 'react'
import styles from './ProgressBar.module.css'

export interface ProgressBarProps {
  value: number
  min?: number
  max?: number
  label: string
  size?: 'compact' | 'regular'
  status?: 'active' | 'complete' | 'error'
  showValue?: boolean
  className?: string
}

export function ProgressBar({ value, min = 0, max = 100, label, size = 'compact', status = 'active', showValue = true, className }: ProgressBarProps) {
  const id = useId()
  const validRange = Number.isFinite(min) && Number.isFinite(max) && max > min
  const lower = validRange ? min : 0
  const upper = validRange ? max : 100
  const current = Math.min(upper, Math.max(lower, Number.isFinite(value) ? value : lower))
  const percentage = (current - lower) / (upper - lower) * 100
  const displayValue = `${Math.round(percentage)}%`
  const stateText = status === 'complete' ? 'concluído' : status === 'error' ? 'erro' : ''
  return <div className={[styles.root, styles[size], styles[status], className].filter(Boolean).join(' ')}>
    <div className={styles.heading}><span id={id}>{label}</span>{showValue && <span className={styles.value} aria-hidden="true">{displayValue}</span>}</div>
    <div className={styles.track} role="progressbar" aria-labelledby={id} aria-valuemin={lower} aria-valuemax={upper} aria-valuenow={current} aria-valuetext={stateText ? `${displayValue}, ${stateText}` : displayValue}>
      <div className={styles.fill} style={{ width: `${percentage}%` }} />
    </div>
  </div>
}
