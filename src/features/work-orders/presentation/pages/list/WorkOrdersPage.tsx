import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '../../../../../shared/ui/Button'
import { Card } from '../../../../../shared/ui/Card'
import { DataTable } from '../../../../../shared/ui/DataTable'
import type { DataColumn, TableSorting } from '../../../../../shared/ui/DataTable'
import { FilterBar } from '../../../../../shared/ui/FilterBar'
import { PageLayout } from '../../../../../shared/ui/PageLayout'
import { StatusBadge } from '../../../../../shared/ui/StatusBadge'
import { TextField } from '../../../../../shared/ui/TextField'
import motion from '../../../../../shared/ui/motion/DirectionalLink.module.css'
import type { WorkOrder } from '../../../domain/workOrder'
import { useWorkOrders } from './hooks/useWorkOrders'
import { WorkOrdersShell } from '../../components/WorkOrdersShell'
import { formatDate, formatPriority, formatServiceType, statusLabels, statusTones } from '../../formatters/workOrderDisplay'
import add from './assets/add.svg'
import ordersIcon from './assets/orders.svg'
import unassignedIcon from './assets/unassigned.svg'
import unscheduledIcon from './assets/unscheduled.svg'
import styles from './WorkOrdersPage.module.css'

const columns: DataColumn<WorkOrder>[] = [
  { id: 'code', label: 'Referência', rowHeader: true, sortable: true, render: order => order.code },
  { id: 'client', label: 'Cliente / local', render: order => <><strong>{order.client.name}</strong><span className={styles.location}>{order.site.name}</span></> },
  { id: 'serviceType', label: 'Tipo de serviço', render: order => formatServiceType(order.serviceType) },
  { id: 'scheduledDate', label: 'Agendamento', sortable: true, render: order => formatDate(order.scheduledDate) },
  { id: 'technician', label: 'Responsável', render: order => order.assignedTechnician?.name ?? 'Por atribuir' },
  { id: 'status', label: 'Estado', sortable: true, render: order => <StatusBadge className={styles.statusBadge} label={statusLabels[order.status]} tone={statusTones[order.status]} size="small" showDot /> },
  { id: 'action', label: 'Ação', render: order => <Link className={`${styles.rowAction} ${motion.directional}`} data-motion-direction="forward" to={`/ordens-servico/${encodeURIComponent(order.id)}`} aria-label={`Abrir ${order.code}`}><span>Abrir</span><span className={motion.arrow} aria-hidden="true">→</span></Link> },
]

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

  return <WorkOrdersShell search={<TextField aria-label="Pesquisar ordens, clientes ou locais" type="search" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} placeholder="Pesquisar ordens, clientes e locais..." />}>
    <PageLayout className={styles.page} title="Ordens de serviço" description="Consulte, organize e acompanhe todas as intervenções." breadcrumbs={<span>OPERAÇÕES / ORDENS DE SERVIÇO</span>} actions={<Button disabled={!available} title={!available ? 'Criação indisponível nesta origem' : undefined} onClick={() => navigate('/ordens-servico/nova')} iconStart={<img src={add} alt="" />}>Nova ordem</Button>}>
      <div className={styles.content}>
        <section className={styles.summary} aria-label="Resumo de ordens">
          <Card className={styles.summaryPrimary}><div className={styles.summaryInner}><span className={styles.summaryIcon}><img src={ordersIcon} alt="" /></span><div><strong>{count(orders.length)}</strong><span>Ordens registadas</span><small>Total no sistema</small></div></div></Card>
          <Card><div className={styles.summaryInner}><span className={`${styles.summaryIcon} ${styles.orange}`}><img src={unassignedIcon} alt="" /></span><div><strong>{count(orders.filter(order => !order.assignedTechnician).length)}</strong><span>Por atribuir</span><small>Sem responsável definido</small></div></div></Card>
          <Card><div className={styles.summaryInner}><span className={`${styles.summaryIcon} ${styles.blue}`}><img src={unscheduledIcon} alt="" /></span><div><strong>{count(orders.filter(order => !order.scheduledDate).length)}</strong><span>Por agendar</span><small>Sem data prevista</small></div></div></Card>
        </section>
        <FilterBar className={styles.filters} title="FILTRAR ORDENS" search={{ label: 'Pesquisar', value: search, placeholder: 'Referência, cliente ou local...', onChange: value => { setSearch(value); setPage(1) } }} filters={[
          { id: 'status', label: 'Estado', value: status, placeholder: 'Todos os estados', options: Object.entries(statusLabels).map(([value, label]) => ({ value, label })), onChange: value => { setStatus(value); setPage(1) } },
          { id: 'priority', label: 'Prioridade', value: priority, placeholder: 'Todas', options: [...new Set(orders.map(order => order.priority))].sort().map(value => ({ value, label: formatPriority(value) })), onChange: value => { setPriority(value); setPage(1) } },
          { id: 'schedule', label: 'Agendamento', value: scheduled, placeholder: 'Qualquer data', options: [{ value: 'scheduled', label: 'Com data' }, { value: 'unscheduled', label: 'Sem data' }], onChange: value => { setScheduled(value); setPage(1) } },
        ]} onReset={reset} />
        <DataTable className={styles.table} title="Todas as ordens" description="Consulte as ordens de serviço disponíveis." rows={rows} columns={columns} getRowId={order => order.id} total={filtered.length} sorting={sorting} onSort={setSorting} isLoading={loading} error={error ?? undefined} onRetry={available ? reload : undefined} labels={{ count: total => `${total} ${total === 1 ? 'resultado' : 'resultados'}`, emptyTitle: 'Nenhuma ordem encontrada', emptyDescription: 'Não há ordens para apresentar com os filtros atuais.' }} pagination={{ page: currentPage, pageSize, total: filtered.length, pageSizeOptions: [5, 10, 25], onPageChange: setPage, onPageSizeChange: value => { setPageSize(value); setPage(1) } }} />
      </div>
    </PageLayout>
  </WorkOrdersShell>
}
