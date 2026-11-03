import { useId, useState } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Button } from '../Button'
import { TextField } from '../TextField'
import styles from './Select.module.css'

export interface SelectOption { value: string; label: string; description?: string; disabled?: boolean }
export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size' | 'value' | 'defaultValue' | 'onChange' | 'children' | 'multiple'> {
  options: readonly SelectOption[]; value: string | null; onChange: (value: string | null) => void
  size?: 'small' | 'medium' | 'large'; placeholder?: string; selectedLabel?: string; iconStart?: ReactNode
  searchable?: boolean; searchLabel?: string; clearable?: boolean; loading?: boolean; loadingLabel?: string
  loadError?: string; onRetry?: () => void; retryLabel?: string; emptyLabel?: string
}
export function Select({ options, value, onChange, size = 'medium', placeholder = 'Selecione uma opção', selectedLabel, iconStart, searchable = false, searchLabel = 'Pesquisar opções', clearable = false, loading = false, loadingLabel = 'A carregar opções', loadError, onRetry, retryLabel = 'Tentar novamente', emptyLabel = 'Sem opções disponíveis', disabled = false, className, 'aria-describedby': describedBy, ...props }: SelectProps) {
  const [query, setQuery] = useState('')
  const searchId = useId()
  const messageId = useId()
  if (!placeholder.trim() || !searchLabel.trim() || !loadingLabel.trim() || !emptyLabel.trim() || !retryLabel.trim() || (loadError !== undefined && !loadError.trim())) throw new Error('Select requer etiquetas e mensagens não vazias.')
  if (options.some(option => !option.value.trim() || !option.label.trim()) || new Set(options.map(option => option.value)).size !== options.length) throw new Error('Select requer opções com valores únicos e etiquetas não vazias.')
  if (value !== null && !value.trim()) throw new Error('Select requer um valor não vazio ou null.')
  const search = query.trim().toLocaleLowerCase()
  const visible = search ? options.filter(option => `${option.label} ${option.description ?? ''}`.toLocaleLowerCase().includes(search)) : options
  const selected = options.find(option => option.value === value)
  const selectedVisible = visible.some(option => option.value === value)
  const message = loading ? loadingLabel : loadError || (visible.length === 0 ? emptyLabel : undefined)
  const descriptions = [describedBy, message ? messageId : undefined].filter(Boolean).join(' ') || undefined
  return <div className={styles.root}>
    {searchable && <div className={styles.search}><label htmlFor={searchId}>{searchLabel}</label><TextField id={searchId} value={query} disabled={disabled || loading} onChange={event => setQuery(event.target.value)} /></div>}
    <span className={styles.wrapper}>{iconStart && <span className={styles.icon} aria-hidden="true">{iconStart}</span>}
      <select {...props} className={[styles.control, styles[size], value === null && styles.placeholder, iconStart && styles.withIcon, className].filter(Boolean).join(' ')} value={value ?? ''} disabled={disabled || loading} aria-describedby={descriptions} onChange={event => onChange(event.target.value === '' ? null : event.target.value)}>
        <option value="" disabled={!clearable}>{placeholder}</option>
        {value !== null && !selectedVisible && <option value={value} disabled={selected?.disabled}>{selected?.label ?? selectedLabel ?? value}</option>}
        {visible.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.description ? `${option.label} — ${option.description}` : option.label}</option>)}
      </select>
    </span>
    {message && <div id={messageId} role={loadError && !loading ? 'alert' : 'status'} className={loadError && !loading ? styles.error : styles.message}>{message}</div>}
    {loadError && !loading && onRetry && <div><Button variant="outline" size="small" disabled={disabled} onClick={onRetry}>{retryLabel}</Button></div>}
  </div>
}
