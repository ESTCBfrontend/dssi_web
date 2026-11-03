import type { ComponentPropsWithRef } from 'react'
import { FormField } from '../FormField'
import { Select } from '../Select'
import { validateAssignmentOptions } from './validation'
import type { AssignmentOption } from './validation'

export interface AssignmentSelectorProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
  options: readonly AssignmentOption[]; value: string | null; onChange: (value: string | null) => void
  label: string; placeholder: string; searchLabel: string; selectedLabel?: string; name?: string; id?: string
  required?: boolean; disabled?: boolean; error?: string; helperText?: string; loading?: boolean; loadError?: string
  onRetry?: () => void; searchable?: boolean; clearable?: boolean; emptyLabel?: string; loadingLabel?: string; retryLabel?: string
}
export function AssignmentSelector({ options, value, onChange, label, placeholder, searchLabel, selectedLabel, name, id, required, disabled, error, helperText, loading, loadError, onRetry, searchable = true, clearable = false, emptyLabel, loadingLabel, retryLabel, ...props }: AssignmentSelectorProps) {
  validateAssignmentOptions(options)
  const mapped = options.map(option => ({ value: option.id, label: option.name, description: [option.description, option.statusLabel].filter(part => part?.trim()).join(' · ') || undefined, disabled: option.disabled }))
  return <div {...props}><FormField id={id} label={label} required={required} disabled={disabled} error={error} helperText={helperText}>{field => <Select {...field} options={mapped} value={value} onChange={onChange} name={name} placeholder={placeholder} searchLabel={searchLabel} searchable={searchable} selectedLabel={selectedLabel} loading={loading} loadError={loadError} onRetry={onRetry} clearable={clearable} emptyLabel={emptyLabel} loadingLabel={loadingLabel} retryLabel={retryLabel} />}</FormField></div>
}
