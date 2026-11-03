import { Checkbox } from '../Checkbox'
import { SelectionGroup } from '../selection/SelectionGroup'
import type { SelectionOption, SelectionGroupProps } from '../selection/SelectionGroup'

export interface CheckboxGroupProps extends Omit<SelectionGroupProps, 'children'> {
  options: readonly SelectionOption[]
  values: readonly string[]
  onChange: (values: string[]) => void
  name?: string
  size?: 'compact' | 'comfortable'
}

export function CheckboxGroup({ options, values, onChange, name, size, ...group }: CheckboxGroupProps) {
  return <SelectionGroup {...group}>{({ describedBy, invalid }) => options.map(option => <Checkbox key={option.value} label={option.label} description={option.description} size={size} name={name} value={option.value} disabled={group.disabled || option.disabled} checked={values.includes(option.value)} aria-invalid={invalid} aria-describedby={describedBy} onChange={event => onChange(event.target.checked ? [...values, option.value] : values.filter(value => value !== option.value))} />)}</SelectionGroup>
}
