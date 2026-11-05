import { Alert } from '../../../shared/ui/Alert'
import { LoadingIndicator } from '../../../shared/ui/LoadingIndicator'
import { StatusBadge } from '../../../shared/ui/StatusBadge'
import type { Intervention } from '../domain/intervention'
import styles from './InterventionList.module.css'

const statuses: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  CONCLUIDA: { label: 'Concluída', tone: 'success' },
  PENDENTE: { label: 'Pendente', tone: 'warning' },
  CANCELADA: { label: 'Cancelada', tone: 'danger' },
}

function formatDateTime(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Data indisponível' : new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short', timeStyle: 'short' }).format(date)
}

export function InterventionList({ items, loading, error, onRetry }: { items: readonly Intervention[]; loading: boolean; error: string | null; onRetry: () => void }) {
  if (loading) return <LoadingIndicator type="inline" label="A carregar intervenções..." />
  if (error) return <Alert tone="danger" layout="detailed" title="Não foi possível consultar as intervenções" message={error} announcement="polite" action={{ label: 'Tentar novamente', onClick: onRetry }} />
  if (!items.length) return <p className={styles.empty}>Não existem intervenções disponíveis para esta ordem.</p>
  return <ul className={styles.list}>{items.map(item => {
    const status = statuses[item.status]
    const start = formatDateTime(item.startedAt)
    const end = formatDateTime(item.endedAt)
    return <li className={styles.item} key={item.id}>
      <div className={styles.heading}><strong>{item.technician.name}</strong><StatusBadge label={status?.label ?? item.status} tone={status?.tone ?? 'neutral'} size="small" showDot /></div>
      {(start || end) && <p className={styles.date}>{start && <>Início: {start}</>}{start && end && ' · '}{end && <>Fim: {end}</>}</p>}
      <p className={styles.description}>{item.description}</p>
      {item.observations && <p><strong>Observações:</strong> {item.observations}</p>}
      {item.pendingReason && <p><strong>Pendência:</strong> {item.pendingReason}</p>}
      {item.nextStep && <p><strong>Próximo passo:</strong> {item.nextStep}</p>}
      {item.materials.length > 0 && <p><strong>Materiais:</strong> {item.materials.join(', ')}</p>}
    </li>
  })}</ul>
}
