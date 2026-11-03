import { SummaryCard } from '../BusinessCard'
import type { SummaryCardOptions } from '../BusinessCard'

export type ServiceOrderCardState = 'planned' | 'active'
export interface ServiceOrderCardData { id: string; reference: string; subtitle?: string; clientName?: string; location?: string; scheduledAt?: string; team?: string; responsible?: string }
export interface ServiceOrderCardLabels { planned: string; active: string; clientName: string; location: string; scheduledAt: string; team: string; responsible: string; open: string; follow: string }
export interface ServiceOrderCardProps extends SummaryCardOptions { order: ServiceOrderCardData; state: ServiceOrderCardState; onOpen?: (order: ServiceOrderCardData) => void; labels?: Partial<ServiceOrderCardLabels> }
const defaults: ServiceOrderCardLabels = { planned: 'Planeada', active: 'Em execução', clientName: 'Cliente', location: 'Local', scheduledAt: 'Agendamento', team: 'Equipa', responsible: 'Responsável', open: 'Ver intervenção', follow: 'Acompanhar' }
export function ServiceOrderCard({ order, state, onOpen, status, labels, extraFields = [], ...props }: ServiceOrderCardProps) {
  if (!order?.id.trim() || !order.reference.trim() || !['planned', 'active'].includes(state)) throw new Error('ServiceOrderCard requer ordem e estado válidos.')
  const text = { ...defaults, ...labels }
  const details = [{ label: text.clientName, value: order.clientName }, { label: text.location, value: order.location }, { label: text.scheduledAt, value: order.scheduledAt }, { label: text.team, value: order.team }, { label: text.responsible, value: order.responsible }, ...extraFields]
  return <SummaryCard {...props} title={order.reference} subtitle={order.subtitle} status={status ?? { label: text[state], tone: state === 'planned' ? 'info' : 'warning' }} details={details} actionLabel={state === 'planned' ? text.open : text.follow} onOpen={onOpen ? () => onOpen(order) : undefined} />
}
