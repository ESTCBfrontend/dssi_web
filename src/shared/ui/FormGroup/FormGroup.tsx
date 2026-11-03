import { useId } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import styles from './FormGroup.module.css'

export interface FormGroupProps extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
  title?: string
  description?: string
  secondary?: ReactNode
  actions?: ReactNode
  layout?: 'stacked' | 'twoColumns'
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

export function FormGroup({ title, description, children, secondary, actions, layout = 'stacked', headingLevel = 2, className, ...props }: FormGroupProps) {
  const titleId = useId()
  if (title !== undefined && !title.trim()) throw new Error('FormGroup requer um título não vazio quando fornecido.')
  if (description !== undefined && !description.trim()) throw new Error('FormGroup requer uma descrição não vazia quando fornecida.')
  const Heading = `h${headingLevel}` as const
  return <section {...props} aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : title ? titleId : undefined)} className={[styles.group, styles[layout], className].filter(Boolean).join(' ')}>
    {(title || description) && <div className={styles.heading}>{title && <Heading id={titleId} className={styles.title}>{title}</Heading>}{description && <p className={styles.description}>{description}</p>}</div>}
    <div className={styles.fields}><div className={styles.block}>{children}</div>{secondary != null && secondary !== false && <div className={styles.block}>{secondary}</div>}</div>
    {actions && <div className={styles.actions}>{actions}</div>}
  </section>
}
