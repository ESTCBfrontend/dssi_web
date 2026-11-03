import { useId } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import styles from './AppShell.module.css'

export interface AppShellProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  header?: ReactNode; navigation?: ReactNode; children: ReactNode; footer?: ReactNode
  navigationLabel?: string; skipLabel?: string; sidebarCollapsed?: boolean; mainId?: string
}
export function AppShell({ header, navigation, children, footer, navigationLabel = 'Navegação principal', skipLabel = 'Saltar para o conteúdo', sidebarCollapsed = false, mainId, className, ...props }: AppShellProps) {
  const generatedId = useId()
  const contentId = mainId ?? generatedId
  if ((navigation != null && !navigationLabel.trim()) || !skipLabel.trim() || !contentId.trim()) throw new Error('AppShell requer etiquetas e identificação válidas.')
  return <div {...props} className={[styles.root, sidebarCollapsed && styles.collapsed, className].filter(Boolean).join(' ')}><a className={styles.skip} href={`#${contentId}`}>{skipLabel}</a><div className={[styles.layout, navigation == null && styles.noNavigation].filter(Boolean).join(' ')}>{header != null && <div className={styles.header}>{header}</div>}{navigation != null && <nav className={styles.navigation} aria-label={navigationLabel}>{navigation}</nav>}<main id={contentId} className={styles.main} tabIndex={-1}>{children}{footer != null && <footer>{footer}</footer>}</main></div></div>
}
