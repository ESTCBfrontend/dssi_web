import { useState } from 'react'
import { Alert } from '../../../shared/ui/Alert'
import { Button } from '../../../shared/ui/Button'
import { FormField } from '../../../shared/ui/FormField'
import { LoadingIndicator } from '../../../shared/ui/LoadingIndicator'
import { StatusBadge } from '../../../shared/ui/StatusBadge'
import { Textarea } from '../../../shared/ui/Textarea'
import type { InterventionService } from '../application/interventionService'
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

export function InterventionList({ items, loading, error, onRetry, service }: { items: readonly Intervention[]; loading: boolean; error: string | null; onRetry: () => void; service: InterventionService | null }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [requestingCorrection, setRequestingCorrection] = useState(false)
  const [reason, setReason] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [actionError, setActionError] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, setPending] = useState(false)

  async function review(item: Intervention, decision: 'validar' | 'solicitar-correcao') {
    if (!service || pending) return
    if (decision === 'solicitar-correcao' && !reason.trim()) {
      setFieldError('Indique o motivo da correção.')
      return
    }
    setFieldError('')
    setActionError('')
    setSuccess('')
    setPending(true)
    try {
      await service.review(item.workOrderId, item.id, decision, reason)
      setSelected(null)
      setRequestingCorrection(false)
      setReason('')
      setSuccess(decision === 'validar' ? 'Intervenção validada na sessão de testes.' : 'Correção solicitada na sessão de testes.')
    } catch {
      setActionError('Não foi possível registar a análise. Tente novamente.')
    } finally { setPending(false) }
  }

  if (loading) return <LoadingIndicator type="inline" label="A carregar intervenções..." />
  if (error) return <Alert tone="danger" layout="detailed" title="Não foi possível consultar as intervenções" message={error} announcement="polite" action={{ label: 'Tentar novamente', onClick: onRetry }} />
  if (!items.length) return <p className={styles.empty}>Não existem intervenções disponíveis para esta ordem.</p>
  return <>{success && <p role="status" className={styles.success}>{success}</p>}<ul className={styles.list}>{items.map(item => {
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
      {item.review && <p><strong>Análise:</strong> {item.review.status === 'VALIDADA' ? 'Validada' : 'Correção solicitada'}{item.review.reason && <> — {item.review.reason}</>}</p>}
      {!item.review && !['CONCLUIDA', 'PENDENTE'].includes(item.status) && <p>A análise não está disponível para esta intervenção.</p>}
      {!item.review && ['CONCLUIDA', 'PENDENTE'].includes(item.status) && service && selected !== item.id && <div className={styles.actions}><Button size="small" variant="outline" disabled={pending} aria-label={`Analisar intervenção de ${item.technician.name}`} onClick={() => { setSelected(item.id); setRequestingCorrection(false); setReason(''); setFieldError(''); setActionError(''); setSuccess('') }}>Analisar intervenção</Button></div>}
      {selected === item.id && !item.review && service && <section className={styles.review} aria-label={`Análise da intervenção de ${item.technician.name}`}>
        <p>Esta análise é uma simulação local e não altera o estado da ordem.</p>
        {actionError && <p role="alert">{actionError}</p>}
        {fieldError && <span role="alert">{fieldError}</span>}
        {requestingCorrection && <FormField label="Motivo da correção" required error={fieldError || undefined}>{field => <Textarea {...field} value={reason} onChange={event => { setReason(event.target.value); setFieldError('') }} disabled={pending} />}</FormField>}
        <div className={styles.actions}>
          {!requestingCorrection && <><Button size="small" loading={pending} onClick={() => void review(item, 'validar')}>Validar</Button><Button size="small" variant="outline" disabled={pending} onClick={() => setRequestingCorrection(true)}>Pedir correção</Button></>}
          {requestingCorrection && <Button size="small" loading={pending} onClick={() => void review(item, 'solicitar-correcao')}>Confirmar pedido de correção</Button>}
          <Button size="small" variant="secondary" disabled={pending} onClick={() => { setSelected(null); setActionError('') }}>Fechar análise</Button>
        </div>
      </section>}
    </li>
  })}</ul></>
}
