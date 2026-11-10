import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { AppShell } from '../../../../shared/ui/AppShell'
import { AppHeader } from '../../../../shared/ui/AppHeader'
import { NavItem } from '../../../../shared/ui/NavItem'
import brand from '../assets/brand.svg'
import bell from '../assets/bell.svg'
import styles from './WorkOrdersShell.module.css'

const nav = [
  ['Visão geral', '⌂'], ['Ordens de serviço', '▤'], ['Planeamento', '▦'], ['Equipas', '♧'],
  ['Clientes e locais', '♙'], ['Equipamentos', '▣'], ['Propostas', '▤'], ['Relatórios', '▥'], ['Definições', '⚙'],
] as const

export function WorkOrdersShell({ children, search }: { children: ReactNode; search?: ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  return <AppShell className={styles.shell}
    header={<AppHeader className={styles.topbar} title="AlarmeON" leading={search} trailing={<img src={bell} alt="" aria-hidden="true" />} />}
    navigation={<div className={styles.sidebar}><div className={styles.brand}><img src={brand} alt="" /><div><strong>AlarmeON</strong><small>FIELD OPERATIONS</small></div></div><div className={styles.navigation}>{nav.map(([label, icon]) => {
      const href = label === 'Ordens de serviço' ? '/ordens-servico' : label === 'Clientes e locais' ? '/clientes' : undefined
      const selected = href === '/clientes' ? location.pathname.startsWith('/clientes') : href === '/ordens-servico' && (location.pathname === '/' || location.pathname.startsWith('/ordens-servico'))
      return <NavItem key={label} label={label} selected={selected} href={href} onClick={href ? event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); void navigate(href) } } : undefined} disabled={!href} icon={<span>{icon}</span>} />
    })}</div></div>}>
    {children}
  </AppShell>
}
