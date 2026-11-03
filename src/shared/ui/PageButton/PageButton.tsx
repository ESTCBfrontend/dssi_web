import type { ComponentPropsWithRef } from 'react'
import { Button } from '../Button'
import styles from './PageButton.module.css'

export interface PageButtonProps extends Omit<ComponentPropsWithRef<'button'>, 'children' | 'onSelect' | 'size' | 'onClick'> {
  page: number
  onSelect: (page: number) => void
  current?: boolean
  size?: 'compact' | 'comfortable'
}

export function PageButton({ page, onSelect, current = false, disabled = false, size = 'comfortable', className, ...props }: PageButtonProps) {
  if (!Number.isSafeInteger(page) || page < 1) throw new Error('PageButton requer uma página inteira positiva e segura.')
  if (props['aria-label'] !== undefined && !props['aria-label'].trim()) throw new Error('PageButton requer um nome acessível não vazio.')
  return <Button {...props} className={[styles.page, styles[size], current && styles.current, className].filter(Boolean).join(' ')} aria-label={props['aria-label'] ?? `Página ${page}`} aria-current={current ? 'page' : undefined} disabled={disabled} onClick={() => onSelect(page)}>{page}</Button>
}
