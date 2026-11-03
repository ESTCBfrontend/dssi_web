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
  helperText?: string
  error?: string
  layout?: 'stacked' | 'twoColumns'
  disabled?: boolean
  className?: string
  children: (ids: { describedBy?: string; invalid?: boolean }) => ReactNode
}

export function SelectionGroup({ label, description, helperText, error, layout = 'stacked', disabled, className, children }: SelectionGroupProps) {
  const id = useId()
  if (!label.trim()) throw new Error('O grupo de seleção requer uma label não vazia.')
  if (error !== undefined && !error.trim()) throw new Error('O grupo de seleção requer uma mensagem de erro não vazia.')
  const descriptionId = description ? `${id}-description` : undefined
  const message = error || helperText
  const messageId = message ? `${id}-message` : undefined
  const describedBy = [descriptionId, messageId].filter(Boolean).join(' ') || undefined
  return <fieldset disabled={disabled} aria-describedby={describedBy} className={[styles.group, styles[layout], error && styles.invalid, className].filter(Boolean).join(' ')}>
    <legend className={styles.legend}>{label}</legend>
    {description && <div className={styles.description} id={descriptionId}>{description}</div>}
    <div className={styles.options}>{children({ describedBy, invalid: error ? true : undefined })}</div>
    {message && <div className={error ? styles.error : styles.help} id={messageId}>{message}</div>}
  </fieldset>
}
