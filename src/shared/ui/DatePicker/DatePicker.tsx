import { useState } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { Button } from '../Button'
import { FormField } from '../FormField'
import { TextField } from '../TextField'
import { isCivilDate, validDateLimits } from '../pickerUtils/dateTime'
import styles from './DatePicker.module.css'

export interface DatePickerProps {
  label: string; value: string | null; onChange: (value: string | null) => void
  minDate?: string; maxDate?: string; disabledDates?: readonly string[]; disabled?: boolean; required?: boolean
  helperText?: string; error?: string; clearable?: boolean; clearLabel?: string; unavailableLabel?: string
  id?: string; name?: string; className?: string; inputRef?: ComponentPropsWithRef<'input'>['ref']
}
export function DatePicker({ label, value, onChange, minDate, maxDate, disabledDates = [], disabled = false, required, helperText, error, clearable = false, clearLabel = 'Limpar data', unavailableLabel = 'Esta data não está disponível.', id, name, className, inputRef }: DatePickerProps) {
  const [selectionError, setSelectionError] = useState<string>()
  if (!label.trim() || (value !== null && !isCivilDate(value)) || !validDateLimits(minDate, maxDate) || disabledDates.some(date => !isCivilDate(date)) || !clearLabel.trim() || !unavailableLabel.trim() || (error !== undefined && !error.trim())) throw new Error('DatePicker requer etiqueta, datas e limites válidos.')
  const choose = (date: string) => {
    if (!date) { setSelectionError(undefined); onChange(null); return }
    if (!isCivilDate(date) || (minDate && date < minDate) || (maxDate && date > maxDate) || disabledDates.includes(date)) { setSelectionError(unavailableLabel); return }
    setSelectionError(undefined); onChange(date)
  }
  return <div className={[styles.root, className].filter(Boolean).join(' ')}><FormField id={id} label={label} required={required} disabled={disabled} helperText={helperText} error={error || selectionError}>{field => <TextField {...field} ref={inputRef} className={styles.input} type="date" name={name} lang="pt-PT" value={value ?? ''} min={minDate} max={maxDate} onChange={event => choose(event.target.value)} />}</FormField>
    {clearable && value && !disabled && <div><Button size="small" variant="outline" onClick={() => choose('')}>{clearLabel}</Button></div>}
  </div>
}
