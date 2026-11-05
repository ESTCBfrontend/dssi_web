import { useId } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Alert } from '../Alert'
import { LoadingIndicator } from '../LoadingIndicator'
import { Pagination } from '../Pagination'
import type { PaginationProps } from '../Pagination'
import { SortableHeader } from '../SortableHeader'
import type { SortDirection } from '../SortableHeader'
import { TableRow } from '../TableRow'
import styles from './DataTable.module.css'

export interface DataColumn<T> { id: string; label: string; render: (row: T, index: number) => ReactNode; sortable?: boolean; rowHeader?: boolean }
export interface TableSorting { columnId: string; direction: Exclude<SortDirection, 'none'> }
export interface DataTableLabels { count: (total: number) => string; emptyTitle: string; emptyDescription: string; loading: string; errorTitle: string; retry: string }
export interface DataTableProps<T> extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> {
  title: string; description?: string; rows: readonly T[]; columns: readonly DataColumn<T>[]; getRowId: (row: T) => string
  sorting?: TableSorting | null; onSort?: (sorting: TableSorting | null) => void; isRowSelected?: (row: T) => boolean
  pagination?: PaginationProps; total?: number; filters?: ReactNode; isLoading?: boolean; error?: string; onRetry?: () => void
  layout?: 'table' | 'cards'; renderCard?: (row: T, index: number) => ReactNode; labels?: Partial<DataTableLabels>; headingLevel?: 2 | 3 | 4 | 5 | 6
}
const defaults: DataTableLabels = { count: total => `${total} ${total === 1 ? 'registo' : 'registos'}`, emptyTitle: 'Nenhum registo encontrado', emptyDescription: 'Não há resultados para apresentar.', loading: 'A carregar registos...', errorTitle: 'Não foi possível carregar os registos', retry: 'Tentar novamente' }
export function DataTable<T>({ title, description, rows, columns, getRowId, sorting, onSort, isRowSelected, pagination, total, filters, isLoading = false, error, onRetry, layout = 'table', renderCard, labels, headingLevel = 2, className, ...props }: DataTableProps<T>) {
  const titleId = useId()
  if (!title.trim() || (description !== undefined && !description.trim()) || (error !== undefined && !error.trim()) || columns.length === 0 || columns.some(column => !column.id.trim() || !column.label.trim()) || new Set(columns.map(column => column.id)).size !== columns.length) throw new Error('DataTable requer título e colunas válidas e únicas.')
  const ids = rows.map(getRowId)
  if (ids.some(id => !id.trim()) || new Set(ids).size !== ids.length) throw new Error('DataTable requer identificadores de registo únicos e não vazios.')
  const count = total ?? pagination?.total ?? rows.length
  if (!Number.isSafeInteger(count) || count < rows.length || (total !== undefined && pagination && total !== pagination.total)) throw new Error('DataTable requer total coerente com os registos e a paginação.')
  if (sorting && (!columns.some(column => column.id === sorting.columnId && column.sortable) || !['ascending', 'descending'].includes(sorting.direction))) throw new Error('DataTable requer uma ordenação de coluna válida.')
  if (layout === 'cards' && !renderCard) throw new Error('DataTable em cartões requer renderCard.')
  const text = { ...defaults, ...labels }
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <section {...props} aria-labelledby={props['aria-labelledby'] ?? (props['aria-label'] ? undefined : titleId)} className={[styles.root, className].filter(Boolean).join(' ')}><header className={styles.header}><div><Heading id={titleId} className={styles.title}>{title}</Heading>{description && <p className={styles.description}>{description}</p>}</div><span>{text.count(count)}</span></header>
    {filters}{error && <Alert tone="danger" layout="detailed" title={text.errorTitle} message={error} announcement="polite" action={onRetry && !isLoading ? { label: text.retry, onClick: onRetry } : undefined} />}
    {isLoading && <LoadingIndicator type="inline" size="compact" label={text.loading} />}
    {layout === 'table' ? <div className={styles.overflow} role="region" aria-label={`Tabela: ${title}`} tabIndex={0}><table className={styles.table} aria-busy={isLoading || undefined}><caption className={styles.srOnly}>{title}</caption><thead><tr>{columns.map(column => column.sortable ? <SortableHeader key={column.id} label={column.label} direction={sorting?.columnId === column.id ? sorting.direction : 'none'} disabled={isLoading || !onSort} onSort={direction => onSort?.(direction === 'none' ? null : { columnId: column.id, direction })} /> : <th className={styles.plainHeader} key={column.id} scope="col">{column.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <TableRow key={ids[index]} selected={isRowSelected?.(row)} cells={columns.map(column => ({ id: column.id, rowHeader: column.rowHeader, content: column.render(row, index) }))} />)}{!rows.length && !isLoading && !error && <tr><td colSpan={columns.length} className={styles.empty}><strong>{text.emptyTitle}</strong><span>{text.emptyDescription}</span></td></tr>}</tbody></table></div> : rows.length ? <ul className={styles.cards} aria-busy={isLoading || undefined}>{rows.map((row, index) => <li key={ids[index]}>{renderCard!(row, index)}</li>)}</ul> : !isLoading && !error && <div className={styles.empty}><strong>{text.emptyTitle}</strong><span>{text.emptyDescription}</span></div>}
    {pagination && <Pagination {...pagination} disabled={pagination.disabled || isLoading} />}
  </section>
}
