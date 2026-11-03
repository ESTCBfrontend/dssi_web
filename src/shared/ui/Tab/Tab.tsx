import type { ComponentPropsWithRef } from 'react'
import styles from './Tab.module.css'

export interface TabProps extends Omit<ComponentPropsWithRef<'button'>, 'children' | 'onSelect' | 'size'> {
  id: string
  label: string
  selected: boolean
  onSelect: (id: string) => void
  count?: number
  size?: 'compact' | 'comfortable'
}

export function Tab({ id, label, selected, onSelect, count, size = 'comfortable', disabled, className, tabIndex, onClick, ...props }: TabProps) {
  if (!id.trim() || !label.trim()) throw new Error('Tab requer um id e uma label não vazios.')
  if (props['aria-label'] !== undefined && !props['aria-label'].trim()) throw new Error('Tab requer um nome acessível não vazio.')
  if (count !== undefined && (!Number.isSafeInteger(count) || count < 0)) throw new Error('Tab requer um contador inteiro não negativo.')
  return <button {...props} id={id} type="button" role="tab" aria-label={props['aria-label'] ?? (count !== undefined ? `${label}, ${count}` : undefined)} aria-selected={selected} disabled={disabled} tabIndex={tabIndex ?? (selected && !disabled ? 0 : -1)} className={[styles.tab, styles[size], className].filter(Boolean).join(' ')} onClick={event => { onClick?.(event); if (!event.defaultPrevented) onSelect(id) }}>
    <span className={styles.label}>{label}</span>{count !== undefined && <span className={styles.count}>{count}</span>}
  </button>
}
