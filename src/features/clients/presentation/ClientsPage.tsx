import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDataSource } from '../../../app/data-source/dataSourceContext'
import { useWorkOrderServices } from '../../../app/work-orders/providers/workOrderServiceContext'
import { WorkOrdersShell } from '../../work-orders/presentation/components/WorkOrdersShell'
import type { WorkOrderClient, WorkOrderSite } from '../../work-orders/domain/workOrder'
import { Button } from '../../../shared/ui/Button'
import { Card } from '../../../shared/ui/Card'
import { DataTable } from '../../../shared/ui/DataTable'
import type { DataColumn } from '../../../shared/ui/DataTable'
import { PageLayout } from '../../../shared/ui/PageLayout'
import { TextField } from '../../../shared/ui/TextField'
import styles from './ClientsPage.module.css'

export function ClientsPage() {
  const { source } = useDataSource()
  const { apiService, mockExamples, mockVersion } = useWorkOrderServices()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const examples = useQuery({ queryKey: ['work-orders', 'creation-examples', mockVersion], queryFn: () => mockExamples!(), enabled: source === 'mock' && !!mockExamples, retry: false, networkMode: 'always' })
  const apiClients = useQuery({ queryKey: ['work-orders', 'clients', source], queryFn: () => apiService!.listClients(), enabled: source === 'api' && !!apiService, retry: false })
  const clients = useMemo(() => source === 'api' ? apiClients.data ?? [] : [...new Map((examples.data ?? []).map(order => [order.client.id, order.client])).values()], [source, apiClients.data, examples.data])
  const filtered = clients.filter(client => client.name.toLocaleLowerCase('pt-PT').includes(search.trim().toLocaleLowerCase('pt-PT')))
  const selected = clients.find(client => client.id === selectedId)
  const apiSites = useQuery({ queryKey: ['work-orders', 'sites', source, selected?.id], queryFn: () => apiService!.listSites(selected!.id), enabled: source === 'api' && !!apiService && !!selected, retry: false })
  const sites: WorkOrderSite[] = source === 'api' ? apiSites.data ?? [] : [...new Map((examples.data ?? []).filter(order => order.client.id === selected?.id).map(order => [order.site.id, order.site])).values()]
  const current = source === 'api' ? apiClients : examples
  const columns: DataColumn<WorkOrderClient>[] = [
    { id: 'client', label: 'Cliente', rowHeader: true, render: client => client.name },
    { id: 'action', label: 'Locais', render: client => <Button variant="secondary" onClick={() => setSelectedId(client.id)} aria-label={`Consultar locais de ${client.name}`}>Consultar locais</Button> },
  ]
  const siteColumns: DataColumn<WorkOrderSite>[] = [
    { id: 'name', label: 'Local', rowHeader: true, render: site => site.name },
    { id: 'address', label: 'Morada', render: site => site.address || 'Não disponível' },
  ]
  return <WorkOrdersShell search={<TextField type="search" aria-label="Pesquisar clientes" placeholder="Pesquisar clientes..." value={search} onChange={event => setSearch(event.target.value)} />}>
    <PageLayout className={styles.page} title="Clientes e locais" description="Consulte os clientes e os respetivos locais de intervenção." breadcrumbs={<span>OPERAÇÕES / CLIENTES E LOCAIS</span>}>
      <div className={styles.content}>
        <DataTable className={styles.table} title="Clientes" description={source === 'mock' ? 'Exemplos fictícios disponíveis para criar ordens.' : 'Selecione um cliente para consultar os seus locais.'} columns={columns} rows={filtered} getRowId={client => client.id} isLoading={current.isLoading} error={current.isError ? 'Não foi possível carregar os clientes.' : undefined} onRetry={() => { void current.refetch() }} labels={{ emptyTitle: 'Nenhum cliente encontrado', emptyDescription: 'Não existem clientes para apresentar com esta pesquisa.' }} />
        {selected ? <DataTable className={styles.table} title={`Locais de ${selected.name}`} description="Locais associados ao cliente selecionado." columns={siteColumns} rows={sites} getRowId={site => site.id} isLoading={source === 'api' && apiSites.isLoading} error={source === 'api' && apiSites.isError ? 'Não foi possível carregar os locais.' : undefined} onRetry={() => { void apiSites.refetch() }} labels={{ emptyTitle: 'Nenhum local encontrado', emptyDescription: 'Não existem locais disponíveis para este cliente.' }} /> : <Card><h2>Locais de intervenção</h2><p>Selecione um cliente para consultar os seus locais.</p></Card>}
        <div className={styles.panels}><Card><h2>Resumo / contexto</h2><p>Consulte os clientes e os locais de intervenção associados.</p></Card><Card><h2>Ações disponíveis</h2><p>A criação, edição e histórico de clientes ainda não estão disponíveis.</p></Card></div>
      </div>
    </PageLayout>
  </WorkOrdersShell>
}
