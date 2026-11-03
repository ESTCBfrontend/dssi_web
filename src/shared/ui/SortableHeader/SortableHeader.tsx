import type { ComponentPropsWithRef } from 'react'
import styles from './SortableHeader.module.css'

export type SortDirection = 'none' | 'ascending' | 'descending'
export interface SortableHeaderLabels { none: string; ascending: string; descending: string; sortAscending: string; sortDescending: string; clear: string }
export interface SortableHeaderProps extends Omit<ComponentPropsWithRef<'th'>, 'children' | 'onClick'> {
  label: string; direction: SortDirection; onSort: (direction: SortDirection) => void; disabled?: boolean; labels?: Partial<SortableHeaderLabels>
}
const defaults: SortableHeaderLabels = { none: 'sem ordenação', ascending: 'ordem ascendente', descending: 'ordem descendente', sortAscending: 'ordenar por ordem ascendente', sortDescending: 'ordenar por ordem descendente', clear: 'limpar ordenação' }
export function SortableHeader({ label, direction, onSort, disabled = false, labels, className, ...props }: SortableHeaderProps) {
  if (!label.trim() || !['none', 'ascending', 'descending'].includes(direction)) throw new Error('SortableHeader requer etiqueta e direção válidas.')
  const text = { ...defaults, ...labels }
  const next = direction === 'none' ? 'ascending' : direction === 'ascending' ? 'descending' : 'none'
  const action = next === 'ascending' ? text.sortAscending : next === 'descending' ? text.sortDescending : text.clear
  return <th {...props} scope="col" aria-sort={direction === 'none' ? undefined : direction} className={[styles.header, className].filter(Boolean).join(' ')}><button type="button" className={styles.button} disabled={disabled} aria-label={`${label}: ${text[direction]}, ${action}`} onClick={() => onSort(next)}><span>{label}</span><span aria-hidden="true">{direction === 'ascending' ? '↑' : direction === 'descending' ? '↓' : '↕'}</span></button></th>
}
