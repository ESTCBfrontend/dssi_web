import { useId } from 'react'
import type { ReactNode } from 'react'
import styles from './SelectionGroup.module.css'

export interface SelectionOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface SelectionGroupProps {
  label: string
  description?: string
  error?: string
  layout?: 'stacked' | 'twoColumns'
  disabled?: boolean
  className?: string
  children: (ids: { describedBy?: string; invalid?: boolean }) => ReactNode
}

export function SelectionGroup({ label, description, error, layout = 'stacked', disabled, className, children }: SelectionGroupProps) {
  const id = useId()
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(' ') || undefined
  return <fieldset disabled={disabled} aria-describedby={describedBy} className={[styles.group, styles[layout], error && styles.invalid, className].filter(Boolean).join(' ')}>
    <legend className={styles.legend}>{label}</legend>
    {description && <div className={styles.description} id={descriptionId}>{description}</div>}
    <div className={styles.options}>{children({ describedBy, invalid: error ? true : undefined })}</div>
    {error && <div className={styles.error} id={errorId}>{error}</div>}
  </fieldset>
}
