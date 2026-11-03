import { useState } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { Button } from '../Button'
import { FormField } from '../FormField'
import { Select } from '../Select'
import { TextField } from '../TextField'
import { isCivilTime } from '../pickerUtils/dateTime'
import styles from './TimePicker.module.css'

export interface TimePickerProps {
  label: string; value: string | null; onChange: (value: string | null) => void
  minTime?: string; maxTime?: string; availableSlots?: readonly string[]; disabled?: boolean; required?: boolean
  helperText?: string; error?: string; clearable?: boolean; clearLabel?: string; unavailableLabel?: string; emptyLabel?: string
  id?: string; name?: string; className?: string; inputRef?: ComponentPropsWithRef<'input'>['ref']
}
export function TimePicker({ label, value, onChange, minTime, maxTime, availableSlots, disabled = false, required, helperText, error, clearable = false, clearLabel = 'Limpar hora', unavailableLabel = 'Esta hora não está disponível.', emptyLabel = 'Sem horários disponíveis', id, name, className, inputRef }: TimePickerProps) {
  const [selectionError, setSelectionError] = useState<string>()
  if (!label.trim() || (value !== null && !isCivilTime(value)) || (minTime !== undefined && !isCivilTime(minTime)) || (maxTime !== undefined && !isCivilTime(maxTime)) || (minTime && maxTime && minTime > maxTime) || availableSlots?.some(slot => !isCivilTime(slot)) || (availableSlots && new Set(availableSlots).size !== availableSlots.length) || !clearLabel.trim() || !unavailableLabel.trim() || !emptyLabel.trim() || (error !== undefined && !error.trim())) throw new Error('TimePicker requer etiqueta, horas e limites válidos.')
  const slots = availableSlots?.filter(slot => (!minTime || slot >= minTime) && (!maxTime || slot <= maxTime))
  const choose = (time: string | null) => {
    if (time === null || time === '') { setSelectionError(undefined); onChange(null); return }
    if (!isCivilTime(time) || (minTime && time < minTime) || (maxTime && time > maxTime) || (availableSlots && !availableSlots.includes(time))) { setSelectionError(unavailableLabel); return }
    setSelectionError(undefined); onChange(time)
  }
  return <div className={[styles.root, className].filter(Boolean).join(' ')}><FormField id={id} label={label} required={required} disabled={disabled} helperText={helperText} error={error || selectionError}>{field => slots ? <Select {...field} name={name} options={slots.map(slot => ({ value: slot, label: slot }))} value={value} onChange={choose} placeholder="HH:MM" emptyLabel={emptyLabel} /> : <TextField {...field} ref={inputRef} className={styles.input} type="time" name={name} lang="pt-PT" step={60} value={value ?? ''} min={minTime} max={maxTime} onChange={event => choose(event.target.value)} />}</FormField>
    {clearable && value && !disabled && <div><Button size="small" variant="outline" onClick={() => choose(null)}>{clearLabel}</Button></div>}
  </div>
}
