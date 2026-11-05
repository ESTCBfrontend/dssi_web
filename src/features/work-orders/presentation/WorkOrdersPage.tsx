import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { AppShell } from '../../../shared/ui/AppShell'
import { AppHeader } from '../../../shared/ui/AppHeader'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { DataTable } from '../../../shared/ui/DataTable'
import type { DataColumn, TableSorting } from '../../../shared/ui/DataTable'
import { FilterBar } from '../../../shared/ui/FilterBar'
import { NavItem } from '../../../shared/ui/NavItem'
import { PageLayout } from '../../../shared/ui/PageLayout'
import { StatusBadge } from '../../../shared/ui/StatusBadge'
import { TextField } from '../../../shared/ui/TextField'
import type { WorkOrder, WorkOrderStatus } from '../domain/workOrder'
import { useWorkOrders } from './hooks/useWorkOrders'
import brand from './assets/brand.svg'
import bell from './assets/bell.svg'
import add from './assets/add.svg'
import ordersIcon from './assets/orders.svg'
import unassignedIcon from './assets/unassigned.svg'
import unscheduledIcon from './assets/unscheduled.svg'
import styles from './WorkOrdersPage.module.css'

const statusLabels: Record<WorkOrderStatus, string> = {
  NOVA: 'Nova', ATRIBUIDA: 'Atribuída', EM_EXECUCAO: 'Em execução',
  CONCLUIDA_TECNICAMENTE: 'Concluída tecnicamente', VALIDADA: 'Validada', PENDENTE: 'Pendente', CANCELADA: 'Cancelada',
}
const statusTones: Record<WorkOrderStatus, 'neutral' | 'info' | 'success' | 'warning' | 'danger'> = {
  NOVA: 'neutral', ATRIBUIDA: 'info', EM_EXECUCAO: 'info', CONCLUIDA_TECNICAMENTE: 'success', VALIDADA: 'success', PENDENTE: 'warning', CANCELADA: 'danger',
}
function formatDate(value: string | null): string {
  if (!value) return 'Sem data'
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? 'Data inválida' : new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
}
const columns: DataColumn<WorkOrder>[] = [
  { id: 'code', label: 'Referência', rowHeader: true, sortable: true, render: order => order.code },
  { id: 'client', label: 'Cliente / local', render: order => <><strong>{order.client.name}</strong><span className={styles.location}>{order.site.name}</span></> },
  { id: 'serviceType', label: 'Tipo de serviço', render: order => order.serviceType },
  { id: 'scheduledDate', label: 'Agendamento', sortable: true, render: order => formatDate(order.scheduledDate) },
  { id: 'technician', label: 'Responsável', render: order => order.assignedTechnician?.name ?? 'Por atribuir' },
  { id: 'status', label: 'Estado', sortable: true, render: order => <StatusBadge className={styles.statusBadge} label={statusLabels[order.status]} tone={statusTones[order.status]} size="small" showDot /> },
  { id: 'action', label: 'Ação', render: order => <Button size="small" variant="outline" disabled aria-label={`Abrir ${order.code}`} title="Detalhes ainda não disponíveis">Abrir →</Button> },
]

const nav = [
  ['Visão geral', '⌂'], ['Ordens de serviço', '▤'], ['Planeamento', '▦'], ['Equipas', '♧'],
  ['Clientes e locais', '♙'], ['Equipamentos', '▣'], ['Propostas', '▤'], ['Relatórios', '▥'], ['Definições', '⚙'],
] as const

export function WorkOrdersPage() {
  const { orders, loading, error, reload, available } = useWorkOrders()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [priority, setPriority] = useState<string | null>(null)
  const [scheduled, setScheduled] = useState<string | null>(null)
  const [sorting, setSorting] = useState<TableSorting | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('pt-PT')
    const result = orders.filter(order => {
      const match = !query || [order.code, order.client.name, order.site.name].some(value => value.toLocaleLowerCase('pt-PT').includes(query))
      return match && (!status || order.status === status) && (!priority || order.priority === priority)
        && (!scheduled || (scheduled === 'scheduled' ? !!order.scheduledDate : !order.scheduledDate))
    })
    if (sorting) {
      const value = (order: WorkOrder) => sorting.columnId === 'code' ? order.code : sorting.columnId === 'scheduledDate' ? order.scheduledDate ?? '' : statusLabels[order.status]
      result.sort((a, b) => value(a).localeCompare(value(b), 'pt-PT', { numeric: true }) * (sorting.direction === 'ascending' ? 1 : -1))
    }
    return result
  }, [orders, search, status, priority, scheduled, sorting])
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)))
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const count = (number: number) => loading || error ? '—' : String(number)
  const reset = () => { setSearch(''); setStatus(null); setPriority(null); setScheduled(null); setPage(1) }

  return <AppShell className={styles.shell}
    header={<AppHeader className={styles.topbar} title="AlarmeON" leading={<TextField aria-label="Pesquisar ordens, clientes ou locais" type="search" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} placeholder="Pesquisar ordens, clientes e locais..." />} trailing={<img src={bell} alt="" aria-hidden="true" />} />}
    navigation={<div className={styles.sidebar}><div className={styles.brand}><img src={brand} alt="" /><div><strong>AlarmeON</strong><small>FIELD OPERATIONS</small></div></div><div className={styles.navigation}>{nav.map(([label, icon]) => <NavItem key={label} label={label} selected={label === 'Ordens de serviço'} href={label === 'Ordens de serviço' ? '/ordens-servico' : undefined} onClick={label === 'Ordens de serviço' ? event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); void navigate('/ordens-servico') } } : undefined} disabled={label !== 'Ordens de serviço'} icon={<span>{icon}</span>} />)}</div></div>}>
    <PageLayout className={styles.page} title="Ordens de serviço" description="Consulte, organize e acompanhe todas as intervenções." breadcrumbs={<span>OPERAÇÕES / ORDENS DE SERVIÇO</span>} actions={<Button disabled title="Criação de ordens ainda não disponível" iconStart={<img src={add} alt="" />}>Nova ordem</Button>}>
      <div className={styles.content}>
        <section className={styles.summary} aria-label="Resumo de ordens">
          <Card className={styles.summaryPrimary}><div className={styles.summaryInner}><span className={styles.summaryIcon}><img src={ordersIcon} alt="" /></span><div><strong>{count(orders.length)}</strong><span>Ordens registadas</span><small>Total no sistema</small></div></div></Card>
          <Card><div className={styles.summaryInner}><span className={`${styles.summaryIcon} ${styles.orange}`}><img src={unassignedIcon} alt="" /></span><div><strong>{count(orders.filter(order => !order.assignedTechnician).length)}</strong><span>Por atribuir</span><small>Sem responsável definido</small></div></div></Card>
          <Card><div className={styles.summaryInner}><span className={`${styles.summaryIcon} ${styles.blue}`}><img src={unscheduledIcon} alt="" /></span><div><strong>{count(orders.filter(order => !order.scheduledDate).length)}</strong><span>Por agendar</span><small>Sem data prevista</small></div></div></Card>
        </section>
        <FilterBar className={styles.filters} title="FILTRAR ORDENS" search={{ label: 'Pesquisar', value: search, placeholder: 'Referência, cliente ou local...', onChange: value => { setSearch(value); setPage(1) } }} filters={[
          { id: 'status', label: 'Estado', value: status, placeholder: 'Todos os estados', options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })), onChange: value => { setStatus(value); setPage(1) } },
          { id: 'priority', label: 'Prioridade', value: priority, placeholder: 'Todas', options: [...new Set(orders.map(order => order.priority))].sort().map(value => ({ value, label: value })), onChange: value => { setPriority(value); setPage(1) } },
          { id: 'schedule', label: 'Agendamento', value: scheduled, placeholder: 'Qualquer data', options: [{ value: 'scheduled', label: 'Com data' }, { value: 'unscheduled', label: 'Sem data' }], onChange: value => { setScheduled(value); setPage(1) } },
        ]} onReset={reset} />
        <DataTable className={styles.table} title="Todas as ordens" description="Consulte as ordens de serviço disponíveis." rows={rows} columns={columns} getRowId={order => order.id} total={filtered.length} sorting={sorting} onSort={setSorting} isLoading={loading} error={error ?? undefined} onRetry={available ? reload : undefined} labels={{ count: total => `${total} ${total === 1 ? 'resultado' : 'resultados'}`, emptyTitle: 'Nenhuma ordem encontrada', emptyDescription: 'Não há ordens para apresentar com os filtros atuais.' }} pagination={{ page: currentPage, pageSize, total: filtered.length, pageSizeOptions: [5, 10, 25], onPageChange: setPage, onPageSizeChange: value => { setPageSize(value); setPage(1) } }} />
      </div>
    </PageLayout>
  </AppShell>
}
