import { SummaryCard } from '../BusinessCard'
import type { SummaryCardOptions } from '../BusinessCard'

export type EquipmentCardState = 'operational' | 'needsService'
export interface EquipmentCardData { id: string; reference: string; identifier: string; subtitle?: string; location?: string; lastInspection?: string; nextService?: string; issue?: string }
export interface EquipmentCardLabels { operational: string; needsService: string; identifier: string; location: string; lastInspection: string; nextService: string; issue: string; open: string; issueAction: string }
export interface EquipmentCardProps extends SummaryCardOptions { equipment: EquipmentCardData; state: EquipmentCardState; onOpen?: (equipment: EquipmentCardData) => void; labels?: Partial<EquipmentCardLabels> }
const defaults: EquipmentCardLabels = { operational: 'Operacional', needsService: 'Requer revisão', identifier: 'Identificação', location: 'Localização', lastInspection: 'Última inspeção', nextService: 'Próxima revisão', issue: 'Ocorrência', open: 'Ver equipamento', issueAction: 'Ver ocorrência' }
export function EquipmentCard({ equipment, state, onOpen, status, labels, extraFields = [], ...props }: EquipmentCardProps) {
  if (!equipment?.id.trim() || !equipment.reference.trim() || !equipment.identifier.trim() || !['operational', 'needsService'].includes(state)) throw new Error('EquipmentCard requer equipamento e estado válidos.')
  const text = { ...defaults, ...labels }
  const details = [{ label: text.identifier, value: equipment.identifier }, { label: text.location, value: equipment.location }, { label: text.lastInspection, value: equipment.lastInspection }, { label: text.nextService, value: equipment.nextService }, { label: text.issue, value: equipment.issue }, ...extraFields]
  return <SummaryCard {...props} title={equipment.reference} subtitle={equipment.subtitle} status={status ?? { label: text[state], tone: state === 'operational' ? 'success' : 'warning' }} details={details} actionLabel={state === 'operational' ? text.open : text.issueAction} onOpen={onOpen ? () => onOpen(equipment) : undefined} />
}
