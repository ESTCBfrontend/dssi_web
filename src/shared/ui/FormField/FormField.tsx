import { useId } from 'react'
import type { ReactNode } from 'react'
import styles from './FormField.module.css'

export interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: boolean
  required?: boolean
  disabled?: boolean
}

export interface FormFieldProps {
  label: string
  children: (props: FieldControlProps) => ReactNode
  id?: string
  helperText?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function FormField({ label, children, id, helperText, error, required, disabled, className }: FormFieldProps) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const message = error || helperText
  const messageId = message ? `${controlId}-message` : undefined
  return <div className={[styles.field, disabled && styles.disabled, className].filter(Boolean).join(' ')}>
    <label htmlFor={controlId} className={styles.label}>{label}{required && <span aria-hidden="true" className={styles.required}> *</span>}</label>
    {children({ id: controlId, 'aria-describedby': messageId, 'aria-invalid': error ? true : undefined, required, disabled })}
    {message && <div id={messageId} className={error ? styles.error : styles.help}>{message}</div>}
  </div>
}
