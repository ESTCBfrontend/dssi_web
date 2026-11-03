import { useId } from 'react'
import { Radio } from '../Radio'
import { SelectionGroup } from '../selection/SelectionGroup'
import type { SelectionOption, SelectionGroupProps } from '../selection/SelectionGroup'

export interface RadioGroupProps extends Omit<SelectionGroupProps, 'children'> {
  options: readonly SelectionOption[]
  value: string | null
  onChange: (value: string) => void
  name?: string
  required?: boolean
  size?: 'compact' | 'comfortable'
}

export function RadioGroup({ options, value, onChange, name, required, size, ...group }: RadioGroupProps) {
  const generatedName = useId()
  return <SelectionGroup {...group}>{({ describedBy, invalid }) => options.map(option => <Radio key={option.value} label={option.label} description={option.description} size={size} name={name ?? generatedName} value={option.value} disabled={group.disabled || option.disabled} required={required} checked={value === option.value} aria-invalid={invalid} aria-describedby={describedBy} onChange={() => onChange(option.value)} />)}</SelectionGroup>
}
