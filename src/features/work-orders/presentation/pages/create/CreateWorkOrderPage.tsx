import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'
import { useDataSource } from '../../../../../app/data-source/dataSourceContext'
import { useWorkOrderServices } from '../../../../../app/work-orders/providers/workOrderServiceContext'
import { Alert } from '../../../../../shared/ui/Alert'
import { ContentPanel } from '../../../../../shared/ui/ContentPanel'
import { Form } from '../../../../../shared/ui/Form'
import { FormField } from '../../../../../shared/ui/FormField'
import { PageLayout } from '../../../../../shared/ui/PageLayout'
import { Select } from '../../../../../shared/ui/Select'
import { Textarea } from '../../../../../shared/ui/Textarea'
import { TextField } from '../../../../../shared/ui/TextField'
import motion from '../../../../../shared/ui/motion/DirectionalLink.module.css'
import { WorkOrdersShell } from '../../components/WorkOrdersShell'
import { priorityOptions } from '../../formatters/workOrderDisplay'
import styles from './CreateWorkOrderPage.module.css'

export function CreateWorkOrderPage() {
  const { source } = useDataSource()
  const { mockVersion } = useWorkOrderServices()
  return <CreateWorkOrderContent key={`${source}-${mockVersion}`} />
}

function CreateWorkOrderContent() {
  const { service, mockExamples, mockVersion } = useWorkOrderServices()
  const navigate = useNavigate()
  const [clientId, setClientId] = useState<string | null>(null)
  const [siteId, setSiteId] = useState<string | null>(null)
  const [priority, setPriority] = useState('NORMAL')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()
  const active = useRef(true)
  useLayoutEffect(() => {
    const mounted = active
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  const examples = useQuery({
    queryKey: ['work-orders', 'creation-examples', mockVersion],
    queryFn: () => mockExamples!(),
    enabled: mockExamples !== null,
    retry: false,
    networkMode: 'always',
  })
  const clients = useMemo(() => [...new Map((examples.data ?? []).map(order => [order.client.id, order.client])).values()], [examples.data])
  const sites = useMemo(() => [...new Map((examples.data ?? []).filter(order => order.client.id === clientId).map(order => [order.site.id, order.site])).values()], [examples.data, clientId])

  async function submit(event: FormEvent<HTMLFormElement>) {
    if (!service || pending) return
    const client = clients.find(item => item.id === clientId)
    const site = sites.find(item => item.id === siteId)
    if (!client || !site) { setError('Seleciona um cliente e um local disponíveis.'); return }
    const data = new FormData(event.currentTarget)
    const value = (name: string) => String(data.get(name) ?? '').trim()
    if (!value('code') || !value('serviceType') || !value('description')) {
      setError('Preenche os campos obrigatórios.'); return
    }
    setPending(true)
    setError(undefined)
    try {
      const order = await service.create({ code: value('code'), client, site, serviceType: value('serviceType'), description: value('description'), priority, scheduledDate: value('scheduledDate') || null, instructions: value('instructions') || null })
      if (active.current) navigate(`/ordens-servico/${encodeURIComponent(order.id)}`)
    } catch {
      if (active.current) setError('Não foi possível criar a ordem. Tenta novamente.')
    } finally { if (active.current) setPending(false) }
  }

  return <WorkOrdersShell search={<TextField type="search" aria-label="Pesquisa global indisponível" placeholder="Pesquisar ordens, clientes e equipamentos..." disabled />}>
    <PageLayout className={styles.page} title="Nova ordem de serviço" description="Registe o serviço e defina o planeamento quando necessário." breadcrumbs={<Link className={`${styles.back} ${motion.directional}`} data-motion-direction="back" to="/ordens-servico"><span className={motion.arrow} aria-hidden="true">←</span><span>Voltar à lista de ordens</span></Link>}>
      {!service || !mockExamples ? <Alert tone="warning" layout="detailed" title="Criação indisponível" message="A criação nesta origem de dados ainda não está disponível." /> :
        <Form title="Criar ordem" description="Os clientes e locais disponíveis são exemplos fictícios." submitLabel="Criar ordem de serviço" loadingLabel="A criar ordem..." pending={pending} error={error} onSubmit={submit} layout="wide">
          {examples.isError && <Alert tone="danger" layout="detailed" title="Dados indisponíveis" message="Não foi possível carregar os exemplos de clientes e locais." action={{ label: 'Tentar novamente', onClick: () => { void examples.refetch() } }} />}
          <div className={styles.columns}>
            <ContentPanel title="Dados da ordem" description="Informação essencial para identificar o serviço e o local da intervenção." className={styles.panel}>
              <div className={styles.fields}>
                <FormField label="Referência" required>{props => <TextField {...props} name="code" disabled={pending} />}</FormField>
                <FormField label="Cliente" required>{props => <Select {...props} disabled={pending || examples.isPending || examples.isError} value={clientId} onChange={value => { setClientId(value); setSiteId(null) }} placeholder="Selecionar cliente" options={clients.map(client => ({ value: client.id, label: client.name }))} />}</FormField>
                <FormField label="Local de intervenção" required>{props => <Select {...props} disabled={pending || !clientId} value={siteId} onChange={setSiteId} placeholder="Selecionar local" options={sites.map(site => ({ value: site.id, label: site.name }))} />}</FormField>
                <FormField label="Tipo de serviço" required>{props => <TextField {...props} name="serviceType" disabled={pending} />}</FormField>
                <FormField label="Prioridade" required>{props => <Select {...props} disabled={pending} value={priority} onChange={value => setPriority(value ?? 'NORMAL')} options={priorityOptions} />}</FormField>
                <div className={styles.full}><FormField label="Descrição do serviço" required>{props => <Textarea {...props} name="description" disabled={pending} />}</FormField></div>
                <div className={styles.full}><FormField label="Instruções" helperText="Opcional">{props => <Textarea {...props} name="instructions" disabled={pending} />}</FormField></div>
              </div>
              <p className={styles.initial}>A ordem será criada com o estado <strong>Nova</strong>.</p>
            </ContentPanel>
            <ContentPanel title="Planeamento e atribuição" description="Pode preencher estes dados agora ou mais tarde." className={styles.panel}>
              <FormField label="Data prevista" helperText="Opcional">{props => <TextField {...props} name="scheduledDate" type="date" disabled={pending} />}</FormField>
              <p className={styles.note}>A atribuição de técnico estará disponível numa próxima etapa.</p>
            </ContentPanel>
          </div>
        </Form>}
    </PageLayout>
  </WorkOrdersShell>
}
