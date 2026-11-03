import { useId } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import styles from './ContentPanel.module.css'

export interface ContentPanelProps extends Omit<ComponentPropsWithRef<'section'>, 'title'> {
  title?: string
  description?: string
  actions?: ReactNode
  footer?: ReactNode
  layout?: 'stacked' | 'wide'
  surface?: 'surface' | 'muted'
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

export function ContentPanel({ title, description, actions, children, footer, layout = 'stacked', surface = 'surface', headingLevel = 2, className, ...props }: ContentPanelProps) {
  const titleId = useId()
  if (title !== undefined && !title.trim()) throw new Error('ContentPanel requer um título não vazio quando fornecido.')
  if (description !== undefined && !description.trim()) throw new Error('ContentPanel requer uma descrição não vazia quando fornecida.')
  const Heading = `h${headingLevel}` as const
  const header = !!(title || description || actions)
  const body = children != null && children !== false
  const hasFooter = footer != null && footer !== false
  return <section {...props} aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : title ? titleId : undefined)} className={[styles.panel, styles[layout], styles[surface], className].filter(Boolean).join(' ')}>
    {header && <div className={styles.header}><div className={styles.heading}>{title && <Heading id={titleId} className={styles.title}>{title}</Heading>}{description && <p className={styles.description}>{description}</p>}</div>{actions && <div className={styles.actions}>{actions}</div>}</div>}
    {body && <div className={[styles.body, header && styles.separated].filter(Boolean).join(' ')}>{children}</div>}
    {hasFooter && <div className={[styles.footer, (header || body) && styles.separated].filter(Boolean).join(' ')}>{footer}</div>}
  </section>
}
