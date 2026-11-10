import { useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useDataSource } from '../../../../../app/data-source/dataSourceContext'
import { useWorkOrderServices } from '../../../../../app/work-orders/providers/workOrderServiceContext'
import { Alert } from '../../../../../shared/ui/Alert'
import { ContentPanel } from '../../../../../shared/ui/ContentPanel'
import { Form } from '../../../../../shared/ui/Form'
import { FormField } from '../../../../../shared/ui/FormField'
import { LoadingIndicator } from '../../../../../shared/ui/LoadingIndicator'
import { PageLayout } from '../../../../../shared/ui/PageLayout'
import { Select } from '../../../../../shared/ui/Select'
import { Textarea } from '../../../../../shared/ui/Textarea'
import { TextField } from '../../../../../shared/ui/TextField'
import type { WorkOrder } from '../../../domain/workOrder'
import { WorkOrdersShell } from '../../components/WorkOrdersShell'
import { priorityOptions } from '../../formatters/workOrderDisplay'
import { useWorkOrder } from '../detail/hooks/useWorkOrder'
import styles from '../create/CreateWorkOrderPage.module.css'

export function EditWorkOrderPage() {
  const { id = '' } = useParams()
  const { source } = useDataSource()
  const { mockVersion } = useWorkOrderServices()
  const { order, loading, error, reload, available } = useWorkOrder(id, false)
  const back = `/ordens-servico/${encodeURIComponent(id)}`
  return <WorkOrdersShell search={<TextField type="search" aria-label="Pesquisa global indisponível" placeholder="Pesquisar ordens, clientes e equipamentos..." disabled />}>
    <PageLayout className={styles.page} title="Editar ordem de serviço" description={order?.code} breadcrumbs={<Link to={back}>Voltar ao detalhe da ordem</Link>}>
      {loading && <LoadingIndicator type="inline" label="A carregar ordem de serviço..." />}
      {error && <Alert tone="danger" layout="detailed" title="Não foi possível consultar a ordem" message={error} announcement="polite" action={available ? { label: 'Tentar novamente', onClick: reload } : undefined} />}
      {!loading && !error && order === null && <Alert tone="warning" layout="detailed" title="Ordem não encontrada" message="A ordem pedida não existe na origem de dados selecionada." />}
      {order && (source === 'mock' ? <EditForm key={`${source}-${mockVersion}-${order.id}`} order={order} /> : <Alert tone="warning" layout="detailed" title="Edição indisponível" message="A edição de ordens ainda não está disponível no backend." />)}
    </PageLayout>
  </WorkOrdersShell>
}

function EditForm({ order }: { order: WorkOrder }) {
  const { service } = useWorkOrderServices()
  const navigate = useNavigate()
  const [priority, setPriority] = useState(order.priority)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()
  const active = useRef(true)
  useLayoutEffect(() => {
    active.current = true
    return () => { active.current = false }
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    if (!service || pending) return
    const data = new FormData(event.currentTarget)
    const value = (name: string) => String(data.get(name) ?? '').trim()
    if (!value('serviceType') || !value('description') || !priority.trim()) {
      setError('Preenche os campos obrigatórios.')
      return
    }
    setPending(true)
    setError(undefined)
    try {
      const updated = await service.update(order.id, { serviceType: value('serviceType'), description: value('description'), priority, scheduledDate: value('scheduledDate') || null, instructions: value('instructions') || null })
      if (!active.current) return
      if (!updated) { setError('A ordem já não está disponível.'); return }
      navigate(`/ordens-servico/${encodeURIComponent(order.id)}`)
    } catch {
      if (active.current) setError('Não foi possível guardar a ordem. Tenta novamente.')
    } finally {
      if (active.current) setPending(false)
    }
  }

  return <Form title="Editar ordem" description="As alterações fictícias são guardadas apenas em memória." submitLabel="Guardar alterações" loadingLabel="A guardar..." pending={pending} error={error} onSubmit={submit} layout="wide">
    <ContentPanel title="Dados da ordem" description="Atualize os dados do serviço e o planeamento." className={styles.panel}>
      <div className={styles.fields}>
        <FormField label="Tipo de serviço" required>{props => <TextField {...props} name="serviceType" defaultValue={order.serviceType} disabled={pending} />}</FormField>
        <FormField label="Prioridade" required>{props => <Select {...props} disabled={pending} value={priority} onChange={value => setPriority(value ?? '')} options={priorityOptions} />}</FormField>
        <div className={styles.full}><FormField label="Descrição do serviço" required>{props => <Textarea {...props} name="description" defaultValue={order.description} disabled={pending} />}</FormField></div>
        <div className={styles.full}><FormField label="Instruções" helperText="Opcional">{props => <Textarea {...props} name="instructions" defaultValue={order.instructions ?? ''} disabled={pending} />}</FormField></div>
        <FormField label="Data prevista" helperText="Opcional">{props => <TextField {...props} name="scheduledDate" type="date" defaultValue={order.scheduledDate ?? ''} disabled={pending} />}</FormField>
      </div>
    </ContentPanel>
  </Form>
}
