import { useId } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import styles from './Card.module.css'

export interface CardProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  title?: string
  subtitle?: string
  status?: ReactNode
  footer?: ReactNode
  actions?: ReactNode
  density?: 'compact' | 'comfortable'
  variant?: 'outlined' | 'elevated'
  headingLevel?: 2 | 3 | 4 | 5 | 6
}

export function Card({ title, subtitle, status, children, footer, actions, density = 'compact', variant = 'outlined', headingLevel = 3, className, ...props }: CardProps) {
  const titleId = useId()
  if (title !== undefined && !title.trim()) throw new Error('Card requer um título não vazio quando fornecido.')
  if (subtitle !== undefined && !subtitle.trim()) throw new Error('Card requer um subtítulo não vazio quando fornecido.')
  const Heading = `h${headingLevel}` as const
  const header = !!(title || subtitle || status)
  const hasFooter = footer != null && footer !== false
  const hasActions = actions != null && actions !== false
  return <div {...props} className={[styles.card, styles[density], styles[variant], className].filter(Boolean).join(' ')}>
    {header && <div className={styles.header}><div className={styles.heading}>{title && <Heading id={titleId} className={styles.title}>{title}</Heading>}{subtitle && <p className={styles.subtitle}>{subtitle}</p>}</div>{status && <div className={styles.status}>{status}</div>}</div>}
    {children != null && <div className={styles.body}>{children}</div>}
    {(hasFooter || hasActions) && <div className={styles.footer}>{hasFooter && <div>{footer}</div>}{hasActions && <div className={styles.actions}>{actions}</div>}</div>}
  </div>
}
