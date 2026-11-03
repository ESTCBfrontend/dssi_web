import type { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import sidebarDefault from './assets/sidebar-default.svg'
import sidebarActive from './assets/sidebar-active.svg'
import sidebarDisabled from './assets/sidebar-disabled.svg'
import bottomDefault from './assets/bottom-default.svg'
import bottomActive from './assets/bottom-active.svg'
import bottomDisabled from './assets/bottom-disabled.svg'
import styles from './NavItem.module.css'

export interface NavItemProps {
  label: string; href?: string; selected?: boolean; disabled?: boolean; place?: 'sidebar' | 'bottom' | 'auto'
  icon?: ReactNode; badge?: string; indicatorSrc?: string; onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  target?: string; rel?: string; id?: string; className?: string; style?: CSSProperties; 'aria-label'?: string
}
const indicators = { sidebar: { default: sidebarDefault, active: sidebarActive, disabled: sidebarDisabled }, bottom: { default: bottomDefault, active: bottomActive, disabled: bottomDisabled } }
export function NavItem({ label, href, selected = false, disabled = false, place = 'auto', icon, badge, indicatorSrc, onClick, target, rel, id, className, style, 'aria-label': ariaLabel }: NavItemProps) {
  if (!label.trim() || (ariaLabel !== undefined && !ariaLabel.trim()) || (!disabled && !href && !onClick)) throw new Error('NavItem requer uma etiqueta e um destino ou ação.')
  const state = disabled ? 'disabled' : selected ? 'active' : 'default'
  const visual = icon ?? <><img className={styles.sidebarIndicator} src={indicatorSrc ?? indicators.sidebar[state]} alt="" /><img className={styles.bottomIndicator} src={indicatorSrc ?? indicators.bottom[state]} alt="" /></>
  const content = <><span className={styles.icon} aria-hidden="true">{visual}</span><span className={styles.label}>{label}</span>{badge && <span className={styles.badge}>{badge}</span>}</>
  const classes = [styles.root, styles[place], selected && styles.selected, disabled && styles.disabled, className].filter(Boolean).join(' ')
  const common = { id, className: classes, style, 'aria-label': ariaLabel ?? (badge ? `${label} ${badge}` : undefined), 'aria-current': selected ? 'page' as const : undefined }
  return href && !disabled ? <a {...common} href={href} target={target} rel={rel} onClick={onClick}>{content}</a> : <button {...common} type="button" disabled={disabled} onClick={onClick}>{content}</button>
}
