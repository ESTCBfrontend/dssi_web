import type { ComponentPropsWithRef, ReactNode } from 'react'
import styles from './PageLayout.module.css'

export interface PageLayoutProps extends Omit<ComponentPropsWithRef<'div'>, 'title'> {
  title: string; description?: string; breadcrumbs?: ReactNode; actions?: ReactNode; footer?: ReactNode
  layout?: 'stacked' | 'wide'; scrollable?: boolean; headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}
export function PageLayout({ title, description, breadcrumbs, actions, children, footer, layout = 'wide', scrollable = false, headingLevel = 1, className, ...props }: PageLayoutProps) {
  if (!title.trim() || (description !== undefined && !description.trim())) throw new Error('PageLayout requer título e descrição não vazios.')
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <div {...props} className={[styles.root, styles[layout], scrollable && styles.scrollable, className].filter(Boolean).join(' ')}>{breadcrumbs != null && <div className={styles.breadcrumbs}>{breadcrumbs}</div>}<div className={styles.heading}><div className={styles.copy}><Heading className={styles.title}>{title}</Heading>{description && <p className={styles.description}>{description}</p>}</div>{actions != null && <div className={styles.actions}>{actions}</div>}</div><div className={styles.content}>{children}</div>{footer != null && <div className={styles.footer}>{footer}</div>}</div>
}
