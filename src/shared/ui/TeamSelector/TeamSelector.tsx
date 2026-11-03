import { AssignmentSelector } from '../AssignmentSelectors'
import type { AssignmentOption, AssignmentSelectorProps } from '../AssignmentSelectors'

export type TeamOption = AssignmentOption
export interface TeamSelectorProps extends Omit<AssignmentSelectorProps, 'options' | 'label' | 'placeholder' | 'searchLabel'> { teams: readonly TeamOption[]; label?: string; placeholder?: string; searchLabel?: string }
export function TeamSelector({ teams, label = 'Equipa', placeholder = 'Selecionar equipa', searchLabel = 'Pesquisar equipa', ...props }: TeamSelectorProps) {
  return <AssignmentSelector {...props} options={teams} label={label} placeholder={placeholder} searchLabel={searchLabel} />
}
