import { useId, useLayoutEffect, useRef } from 'react'
import type { ComponentPropsWithRef } from 'react'
import styles from './Selection.module.css'

export interface SelectionProps extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'type'> {
  label: string
  description?: string
  size?: 'compact' | 'comfortable'
}

export interface CheckboxProps extends SelectionProps { indeterminate?: boolean }

type ControlProps = SelectionProps & { kind: 'checkbox' | 'radio' | 'switch'; indeterminate?: boolean }

export function Selection({ kind, label, description, size = 'comfortable', indeterminate = false, className, ref, id, 'aria-describedby': describedBy, ...props }: ControlProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const labelId = `${inputId}-label`
  const descriptionId = description ? `${inputId}-description` : undefined
  const localRef = useRef<HTMLInputElement | null>(null)
  useLayoutEffect(() => { if (localRef.current && kind === 'checkbox') localRef.current.indeterminate = indeterminate })
  if (!label.trim()) throw new Error('O controlo de seleção requer uma label não vazia.')
  return <label className={[styles.root, styles[size], styles[kind], className].filter(Boolean).join(' ')}>
    <input {...props} id={inputId} ref={node => { localRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) ref.current = node }} type={kind === 'radio' ? 'radio' : 'checkbox'} role={kind === 'switch' ? 'switch' : undefined} aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId)} aria-describedby={[describedBy, descriptionId].filter(Boolean).join(' ') || undefined} className={styles.input} />
    <span aria-hidden="true" className={styles.visual}><span className={styles.mark} /></span>
    <span className={styles.text}><span id={labelId} className={styles.label}>{label}</span>{description && <span id={descriptionId} className={styles.description}>{description}</span>}</span>
  </label>
}
