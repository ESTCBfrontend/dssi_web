import { Alert } from '../../../../../shared/ui/Alert'
import { LoadingIndicator } from '../../../../../shared/ui/LoadingIndicator'
import type { WorkOrderActivity as Event } from '../../../domain/workOrderActivity'
import styles from './WorkOrderActivity.module.css'

const labels: Record<Event['action'], string> = {
  criada: 'Ordem criada',
  editada: 'Ordem editada',
  atribuida: 'Técnico atribuído',
  'intervencao-validada': 'Intervenção validada',
  'correcao-solicitada': 'Correção de intervenção solicitada',
}

export function WorkOrderActivity({ events, loading, error, onRetry }: { events: readonly Event[]; loading: boolean; error: string | null; onRetry: () => void }) {
  if (loading) return <LoadingIndicator type="inline" label="A carregar histórico..." />
  if (error) return <Alert tone="danger" layout="detailed" title="Não foi possível consultar o histórico" message={error} announcement="polite" action={{ label: 'Tentar novamente', onClick: onRetry }} />
  if (!events.length) return <p className={styles.empty}>Ainda não existem atividades nesta sessão de testes.</p>
  return <ol className={styles.list}>{events.map(event => <li className={styles.item} key={event.id}>
    <strong>{labels[event.action]}</strong>
    <time dateTime={new Date(event.timestamp).toISOString()}>{new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' }).format(event.timestamp)}</time>
  </li>)}</ol>
}
