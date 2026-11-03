import { useId, useState } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Button } from '../Button'
import { FormField } from '../FormField'
import { Select } from '../Select'
import type { SelectOption } from '../Select'
import { TextField } from '../TextField'
import searchIcon from './assets/search.svg'
import styles from './FilterBar.module.css'

export interface FilterSearch { label: string; value: string; onChange: (value: string) => void; placeholder?: string; disabled?: boolean }
export interface FilterCriterion { id: string; label: string; value: string | null; options: readonly SelectOption[]; onChange: (value: string | null) => void; placeholder?: string; selectedLabel?: string; disabled?: boolean; loading?: boolean; loadError?: string; onRetry?: () => void }
export interface FilterBarProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children' | 'onChange'> {
  title?: string; search?: FilterSearch; filters?: readonly FilterCriterion[]; onReset?: () => void; resetLabel?: string
  extraFilters?: ReactNode; extraFiltersTitle?: string; activeExtraCount?: number; actions?: ReactNode; disabled?: boolean; searchIconSrc?: string; headingLevel?: 2 | 3 | 4 | 5 | 6
}
export function FilterBar({ title, search, filters = [], onReset, resetLabel = 'Limpar', extraFilters, extraFiltersTitle = 'Filtros adicionais', activeExtraCount = 0, actions, disabled = false, searchIconSrc, headingLevel = 3, className, ...props }: FilterBarProps) {
  const [expanded, setExpanded] = useState(false)
  const extraId = useId()
  const titleId = useId()
  if ((title !== undefined && !title.trim()) || (search && !search.label.trim()) || !resetLabel.trim() || !extraFiltersTitle.trim() || !Number.isSafeInteger(activeExtraCount) || activeExtraCount < 0 || filters.some(filter => !filter.id.trim() || !filter.label.trim()) || new Set(filters.map(filter => filter.id)).size !== filters.length) throw new Error('FilterBar requer etiquetas, identificadores e contagem válidos.')
  const open = expanded && !disabled
  const hasExtra = extraFilters != null && extraFilters !== false
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <section {...props} aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : title ? titleId : undefined)} className={[styles.root, className].filter(Boolean).join(' ')}>{title && <Heading id={titleId} className={styles.title}>{title}</Heading>}<div className={styles.controls}>
    {search && <div className={styles.search}><FormField label={search.label} disabled={disabled || search.disabled}>{field => <TextField {...field} type="search" value={search.value} placeholder={search.placeholder} iconStart={<img src={searchIconSrc ?? searchIcon} alt="" />} onChange={event => search.onChange(event.target.value)} />}</FormField></div>}
    {filters.map(filter => <div className={styles.filter} key={filter.id}><FormField label={filter.label} disabled={disabled || filter.disabled}>{field => <Select {...field} options={filter.options} value={filter.value} onChange={filter.onChange} placeholder={filter.placeholder} selectedLabel={filter.selectedLabel} clearable loading={filter.loading} loadError={filter.loadError} onRetry={filter.onRetry} />}</FormField></div>)}
    {onReset && <Button variant="outline" disabled={disabled} onClick={onReset}>{resetLabel}</Button>}{actions}
    {hasExtra && <Button variant="outline" disabled={disabled} aria-expanded={open} aria-controls={extraId} onClick={() => setExpanded(!expanded)}>{extraFiltersTitle}{activeExtraCount > 0 ? ` (${activeExtraCount})` : ''}</Button>}
    </div>{hasExtra && <div id={extraId} hidden={!open}>{extraFilters}</div>}</section>
}
