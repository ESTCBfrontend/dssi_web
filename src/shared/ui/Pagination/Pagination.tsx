import { useId } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { Button } from '../Button'
import { PageButton } from '../PageButton'
import styles from './Pagination.module.css'

export interface PaginationLabels {
  navigation: string
  previous: string
  next: string
  empty: string
  pageSize: string
  total: (total: number) => string
  range: (start: number, end: number, total: number) => string
  page: (page: number, pageCount: number) => string
  pageNumber: (page: number) => string
  sizeOption: (size: number) => string
}

export interface PaginationProps extends Omit<ComponentPropsWithRef<'nav'>, 'children' | 'onChange'> {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: readonly number[]
  disabled?: boolean
  labels?: Partial<PaginationLabels>
}

const defaultLabels: PaginationLabels = {
  navigation: 'Paginação', previous: 'Anterior', next: 'Seguinte', empty: 'Sem páginas', pageSize: 'Registos por página',
  total: total => `${total} ${total === 1 ? 'registo' : 'registos'}`,
  range: (start, end, total) => `${start}–${end} de ${total}`,
  page: (page, count) => `Página ${page} de ${count}`,
  pageNumber: page => `Página ${page}`,
  sizeOption: size => `${size} por página`,
}

function pageNumbers(page: number, count: number): (number | 'ellipsis')[] {
  const numbers = [...new Set([1, page - 1, page, page + 1, count].filter(number => number >= 1 && number <= count))].sort((a, b) => a - b)
  const result: (number | 'ellipsis')[] = []
  numbers.forEach((number, index) => {
    const previous = numbers[index - 1]
    if (index && number - previous === 2) result.push(previous + 1)
    else if (index && number - previous > 2) result.push('ellipsis')
    result.push(number)
  })
  return result
}

export function Pagination({ page, pageSize, total, onPageChange, onPageSizeChange, pageSizeOptions = [10, 25, 50], disabled = false, labels, className, ...props }: PaginationProps) {
  const sizeId = useId()
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(pageSize) || pageSize < 1 || !Number.isSafeInteger(total) || total < 0) throw new Error('Pagination requer página e tamanho positivos e total não negativo, inteiros seguros.')
  const count = Math.ceil(total / pageSize)
  if (page > Math.max(1, count)) throw new Error('Pagination requer uma página dentro do intervalo disponível.')
  if (onPageSizeChange && (pageSizeOptions.some(size => !Number.isSafeInteger(size) || size < 1) || new Set(pageSizeOptions).size !== pageSizeOptions.length)) throw new Error('Pagination requer tamanhos de página positivos e únicos.')
  const text = { ...defaultLabels, ...labels }
  if (![text.navigation, text.previous, text.next, text.empty, text.pageSize].every(label => label.trim())) throw new Error('Pagination requer etiquetas não vazias.')
  if (props['aria-label'] !== undefined && !props['aria-label'].trim()) throw new Error('Pagination requer um nome acessível não vazio.')
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = total === 0 ? 0 : start + Math.min(pageSize - 1, total - start)
  const sizes = [...new Set([...pageSizeOptions, pageSize])].sort((a, b) => a - b)
  return <nav {...props} aria-label={props['aria-label'] ?? text.navigation} className={[styles.root, className].filter(Boolean).join(' ')}>
    <div className={styles.summary}><span>{text.total(total)}</span><span className={styles.range}>{text.range(start, end, total)}</span></div>
    <div className={styles.navigation}>
      <Button variant="outline" disabled={disabled || total === 0 || page === 1} onClick={() => onPageChange(page - 1)}>{text.previous}</Button>
      <div className={styles.pageButtons}>{count > 0 && pageNumbers(page, count).map((entry, index) => entry === 'ellipsis' ? <span key={`ellipsis-${index}`} aria-hidden="true" className={styles.ellipsis}>…</span> : <PageButton key={entry} page={entry} current={entry === page} disabled={disabled} size="compact" aria-label={text.pageNumber(entry)} onSelect={onPageChange} />)}</div>
      <span className={styles.position}>{count === 0 ? text.empty : text.page(page, count)}</span>
      <Button variant="outline" disabled={disabled || total === 0 || page >= count} onClick={() => onPageChange(page + 1)}>{text.next}</Button>
    </div>
    {onPageSizeChange && <div className={styles.size}><label htmlFor={sizeId} className={styles.srOnly}>{text.pageSize}</label><select id={sizeId} value={pageSize} disabled={disabled} onChange={event => onPageSizeChange(Number(event.target.value))}>{sizes.map(size => <option key={size} value={size}>{text.sizeOption(size)}</option>)}</select></div>}
  </nav>
}
