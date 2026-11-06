import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Alert } from '../../../../../shared/ui/Alert'
import { Button } from '../../../../../shared/ui/Button'
import { Card } from '../../../../../shared/ui/Card'
import { ContentPanel } from '../../../../../shared/ui/ContentPanel'
import { LoadingIndicator } from '../../../../../shared/ui/LoadingIndicator'
import { PageLayout } from '../../../../../shared/ui/PageLayout'
import { StatusBadge } from '../../../../../shared/ui/StatusBadge'
import { TextField } from '../../../../../shared/ui/TextField'
import { InterventionList } from '../../../../interventions/presentation/InterventionList'
import motion from '../../../../../shared/ui/motion/DirectionalLink.module.css'
import { WorkOrdersShell } from '../../components/WorkOrdersShell'
import { AssignTechnician } from './AssignTechnician'
import { useWorkOrder } from './hooks/useWorkOrder'
import { useWorkOrderInterventions } from './hooks/useWorkOrderInterventions'
import { formatDate, formatPriority, statusLabels, statusTones } from '../../formatters/workOrderDisplay'
import statusIcon from './assets/detail-status.svg'
import priorityIcon from './assets/detail-priority.svg'
import scheduleIcon from './assets/detail-schedule.svg'
import technicianIcon from './assets/detail-technician.svg'
import styles from './WorkOrderDetailPage.module.css'

function SummaryCard({ label, value, icon, dark = false }: { label: string; value: string; icon: string; dark?: boolean }) {
  return <Card className={dark ? styles.summaryDark : undefined}><div className={styles.summaryInner}><span className={styles.icon}><img src={icon} alt="" /></span><div><span className={styles.summaryLabel}>{label}</span><strong>{value}</strong></div></div></Card>
}

export function WorkOrderDetailPage() {
  const navigate = useNavigate()
  const [assignmentSuccess, setAssignmentSuccess] = useState(false)
  const { id = '' } = useParams()
  const { order, loading, error, reload, available } = useWorkOrder(id)
  const interventionQuery = useWorkOrderInterventions(id, !!order)
  const title = order?.code ?? 'Detalhe da ordem'
  const priority = order ? formatPriority(order.priority) : ''
  return <WorkOrdersShell search={<TextField type="search" aria-label="Pesquisa global indisponível" placeholder="Pesquisar ordens, clientes e equipamentos..." disabled />}>
    <PageLayout className={styles.page} title={title} description={order ? `${order.serviceType} · ${order.client.name}` : undefined} breadcrumbs={<Link className={`${styles.backLink} ${motion.directional}`} data-motion-direction="back" to="/ordens-servico"><span className={motion.arrow} aria-hidden="true">←</span><span className={styles.backLabel}>Voltar à lista de ordens</span></Link>} actions={order ? <Button onClick={() => navigate(`/ordens-servico/${encodeURIComponent(order.id)}/editar`)}>Editar ordem</Button> : undefined}>
      {loading && <LoadingIndicator type="inline" label="A carregar ordem de serviço..." />}
      {error && <Alert tone="danger" layout="detailed" title="Não foi possível consultar a ordem" message={error} announcement="polite" action={available ? { label: 'Tentar novamente', onClick: reload } : undefined} />}
      {!loading && !error && order === null && <Alert tone="warning" layout="detailed" title="Ordem não encontrada" message="A ordem pedida não existe na origem de dados selecionada." />}
      {assignmentSuccess && <Alert tone="success" title="Técnico atribuído com sucesso." announcement="polite" onDismiss={() => setAssignmentSuccess(false)} />}
      {order && <div className={styles.content}>
        <section className={styles.summary} aria-label="Resumo da ordem">
          <SummaryCard label="Estado" value={statusLabels[order.status]} icon={statusIcon} dark />
          <SummaryCard label="Prioridade" value={priority} icon={priorityIcon} />
          <SummaryCard label="Agendamento" value={formatDate(order.scheduledDate)} icon={scheduleIcon} />
          <SummaryCard label="Responsável" value={order.assignedTechnician?.name ?? 'Por atribuir'} icon={technicianIcon} />
        </section>
        <div className={styles.columns}>
          <div className={styles.column}>
            <ContentPanel className={styles.panel} title="Informação da ordem" description="Cliente, local e características do serviço">
              <dl className={styles.fields}>
                <div><dt>Cliente</dt><dd>{order.client.name}</dd></div>
                <div><dt>Local de intervenção</dt><dd>{order.site.name}{order.site.address && <span className={styles.address}>{order.site.address}</span>}</dd></div>
                <div><dt>Tipo de serviço</dt><dd>{order.serviceType}</dd></div>
                <div><dt>Estado</dt><dd><StatusBadge label={statusLabels[order.status]} tone={statusTones[order.status]} size="small" showDot /></dd></div>
              </dl>
              <div className={styles.description}><strong>Descrição do serviço</strong><p>{order.description}</p></div>
              {order.instructions && <div className={styles.description}><strong>Instruções</strong><p>{order.instructions}</p></div>}
            </ContentPanel>
            <ContentPanel className={styles.panel} title="Intervenções" description="Registos associados a esta ordem">
              <InterventionList items={interventionQuery.interventions} loading={interventionQuery.loading} error={interventionQuery.error} onRetry={interventionQuery.reload} />
            </ContentPanel>
            <ContentPanel className={styles.panel} title="Histórico de atividade" description="Alterações e movimentos desta ordem"><p className={styles.unavailable}>Histórico ainda não disponível.</p></ContentPanel>
          </div>
          <div className={styles.column}>
            <ContentPanel className={styles.panel} title="Planeamento e equipa" description="Atribuição e data da intervenção">
              <dl className={styles.planning}><div><dt>Data prevista</dt><dd>{formatDate(order.scheduledDate)}</dd></div><div><dt>Técnico responsável</dt><dd>{order.assignedTechnician?.name ?? 'Por atribuir'}</dd></div></dl>
              <div className={styles.actions}><Button size="small" variant="outline" disabled>Reagendar</Button><AssignTechnician order={order} onAssigned={() => setAssignmentSuccess(true)} /></div>
            </ContentPanel>
            <ContentPanel className={styles.panel} title="Documentos" description="Ficheiros associados à ordem"><p className={styles.unavailable}>Documentos ainda não disponíveis.</p></ContentPanel>
          </div>
        </div>
      </div>}
    </PageLayout>
  </WorkOrdersShell>
}
