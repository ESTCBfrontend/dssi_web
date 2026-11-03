import { useId } from 'react'
import type { HTMLAttributes } from 'react'
import styles from './ProgressBar.module.css'

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: number
  min?: number
  max?: number
  label: string
  size?: 'compact' | 'regular'
  status?: 'active' | 'complete' | 'error'
  statusText?: string
  showStatusText?: boolean
  showValue?: boolean
  className?: string
}

export function ProgressBar({ value, min = 0, max = 100, label, size = 'regular', status = 'active', statusText, showStatusText = true, showValue = true, className, ...props }: ProgressBarProps) {
  const id = useId()
  if (!label.trim()) throw new Error('ProgressBar requer uma label não vazia.')
  if (![value, min, max].every(Number.isFinite) || max <= min || !Number.isFinite(max - min)) throw new Error('ProgressBar requer valores finitos e max maior que min.')
  if (statusText !== undefined && !statusText.trim()) throw new Error('ProgressBar requer um texto de estado não vazio.')
  const current = Math.min(max, Math.max(min, value))
  if (status === 'complete' && current !== max) throw new Error('ProgressBar complete requer o valor máximo.')
  const percentage = Math.round((current - min) / (max - min) * 100)
  const displayValue = `${percentage}%`
  const stateText = status === 'active' ? undefined : statusText?.trim() || (status === 'complete' ? 'Concluído' : 'Erro')
  return <div {...props} className={[styles.root, styles[size], styles[status], className].filter(Boolean).join(' ')}>
    <div className={styles.heading}><span id={id}>{label}{showStatusText && stateText ? ` · ${stateText}` : ''}</span>{showValue && <span className={styles.value} aria-hidden="true">{displayValue}</span>}</div>
    <div className={styles.track} role="progressbar" aria-label={[label.trim(), stateText].filter(Boolean).join('. ')} aria-valuemin={min} aria-valuemax={max} aria-valuenow={current} aria-valuetext={displayValue}>
      <div className={styles.fill} style={{ width: `${percentage}%` }} />
    </div>
  </div>
}
