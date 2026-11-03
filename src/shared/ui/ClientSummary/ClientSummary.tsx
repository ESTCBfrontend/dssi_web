import { SummaryCard } from '../BusinessCard'
import type { SummaryCardOptions } from '../BusinessCard'

export type ClientSummaryState = 'active' | 'review'
export interface ClientSummaryData { id: string; name: string; subtitle?: string; contact?: string; responsible?: string; sites?: string; activeOrders?: string; pending?: string }
export interface ClientSummaryLabels { active: string; review: string; contact: string; responsible: string; sites: string; activeOrders: string; pending: string; open: string; reviewAction: string }
export interface ClientSummaryProps extends SummaryCardOptions { client: ClientSummaryData; state: ClientSummaryState; onOpen?: (client: ClientSummaryData) => void; labels?: Partial<ClientSummaryLabels> }
const defaults: ClientSummaryLabels = { active: 'Ativo', review: 'Por validar', contact: 'Contacto', responsible: 'Responsável', sites: 'Locais associados', activeOrders: 'Ordens em curso', pending: 'Pendência', open: 'Ver cliente', reviewAction: 'Rever dados' }
export function ClientSummary({ client, state, onOpen, status, labels, extraFields = [], ...props }: ClientSummaryProps) {
  if (!client?.id.trim() || !client.name.trim() || !['active', 'review'].includes(state)) throw new Error('ClientSummary requer cliente e estado válidos.')
  const text = { ...defaults, ...labels }
  const details = [{ label: text.contact, value: client.contact }, { label: text.responsible, value: client.responsible }, { label: text.sites, value: client.sites }, { label: text.activeOrders, value: client.activeOrders }, { label: text.pending, value: client.pending }, ...extraFields]
  return <SummaryCard {...props} title={client.name} subtitle={client.subtitle} status={status ?? { label: text[state], tone: state === 'active' ? 'success' : 'warning' }} details={details} actionLabel={state === 'active' ? text.open : text.reviewAction} onOpen={onOpen ? () => onOpen(client) : undefined} />
}
