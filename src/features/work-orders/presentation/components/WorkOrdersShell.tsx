import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { AppShell } from '../../../../shared/ui/AppShell'
import { AppHeader } from '../../../../shared/ui/AppHeader'
import { NavItem } from '../../../../shared/ui/NavItem'
import { Button } from '../../../../shared/ui/Button'
import { useDataSource } from '../../../../app/data-source/dataSourceContext'
import { useWorkOrderServices } from '../../../../app/work-orders/providers/workOrderServiceContext'
import brand from '../assets/brand.svg'
import bell from '../assets/bell.svg'
import styles from './WorkOrdersShell.module.css'

const nav = [
  ['Visão geral', '⌂'], ['Ordens de serviço', '▤'], ['Planeamento', '▦'], ['Equipas', '♧'],
  ['Clientes e locais', '♙'], ['Equipamentos', '▣'], ['Propostas', '▤'], ['Relatórios', '▥'], ['Definições', '⚙'],
] as const

export function WorkOrdersShell({ children, search }: { children: ReactNode; search?: ReactNode }) {
  const navigate = useNavigate()
  const { source } = useDataSource()
  const { logout } = useWorkOrderServices()
  return <AppShell className={styles.shell}
    header={<AppHeader className={styles.topbar} title="AlarmeON" leading={search} trailing={<>{source === 'api' && <Button size="small" variant="secondary" onClick={logout}>Terminar sessão</Button>}<img src={bell} alt="" aria-hidden="true" /></>} />}
    navigation={<div className={styles.sidebar}><div className={styles.brand}><img src={brand} alt="" /><div><strong>AlarmeON</strong><small>FIELD OPERATIONS</small></div></div><div className={styles.navigation}>{nav.map(([label, icon]) => <NavItem key={label} label={label} selected={label === 'Ordens de serviço'} href={label === 'Ordens de serviço' ? '/ordens-servico' : undefined} onClick={label === 'Ordens de serviço' ? event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); void navigate('/ordens-servico') } } : undefined} disabled={label !== 'Ordens de serviço'} icon={<span>{icon}</span>} />)}</div></div>}>
    {children}
  </AppShell>
}
