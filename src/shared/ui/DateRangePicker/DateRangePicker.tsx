import { useId } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { Button } from '../Button'
import { DatePicker } from '../DatePicker'
import { isCivilDate, validDateLimits } from '../pickerUtils/dateTime'
import styles from './DateRangePicker.module.css'

export interface DateRange { start: string | null; end: string | null }
export interface DateRangeLabels { start: string; end: string; empty: string; selected: string; review: string; hint: string; invalid: string; clear: string; unavailable: string }
export interface DateRangePickerProps extends Omit<ComponentPropsWithRef<'fieldset'>, 'title' | 'children' | 'onChange'> {
  title: string; value: DateRange; onChange: (value: DateRange) => void; minDate?: string; maxDate?: string
  disabledDates?: readonly string[]; error?: string; labels?: Partial<DateRangeLabels>; startName?: string; endName?: string
}
const defaults: DateRangeLabels = { start: 'Data inicial', end: 'Data final', empty: 'Sem período', selected: 'Período selecionado', review: 'Rever datas', hint: 'Escolha a data de início e de fim.', invalid: 'A data final deve ser igual ou posterior à data inicial.', clear: 'Limpar período', unavailable: 'Esta data não está disponível.' }
export function DateRangePicker({ title, value, onChange, minDate, maxDate, disabledDates = [], disabled = false, error, labels, startName, endName, className, ...props }: DateRangePickerProps) {
  const messageId = useId()
  if (!title.trim() || !value || (value.start !== null && !isCivilDate(value.start)) || (value.end !== null && !isCivilDate(value.end)) || !validDateLimits(minDate, maxDate) || disabledDates.some(date => !isCivilDate(date)) || (error !== undefined && !error.trim())) throw new Error('DateRangePicker requer título, datas e limites válidos.')
  const text = { ...defaults, ...labels }
  const startMax = value.end && (!maxDate || value.end < maxDate) && (!minDate || value.end >= minDate) ? value.end : maxDate
  const endMin = value.start && (!minDate || value.start > minDate) && (!maxDate || value.start <= maxDate) ? value.start : minDate
  const message = error || (value.start && value.end && value.start > value.end ? text.invalid : undefined)
  return <fieldset {...props} disabled={disabled} aria-describedby={messageId} className={[styles.root, message && styles.error, className].filter(Boolean).join(' ')}><legend className={styles.legend}>{title}</legend>
    <div className={styles.heading}><span>{message ? text.review : value.start || value.end ? text.selected : text.empty}</span></div>
    <div className={styles.fields}><DatePicker label={text.start} name={startName} value={value.start} minDate={minDate} maxDate={startMax} disabledDates={disabledDates} disabled={disabled} unavailableLabel={text.unavailable} onChange={start => onChange({ ...value, start })} />
      <DatePicker label={text.end} name={endName} value={value.end} minDate={endMin} maxDate={maxDate} disabledDates={disabledDates} disabled={disabled} unavailableLabel={text.unavailable} onChange={end => onChange({ ...value, end })} /></div>
    <div className={styles.footer}><span id={messageId} className={message ? styles.errorText : undefined} aria-live="polite">{message || text.hint}</span>{(value.start || value.end) && !disabled && <Button size="small" variant="outline" onClick={() => onChange({ start: null, end: null })}>{text.clear}</Button>}</div>
  </fieldset>
}
