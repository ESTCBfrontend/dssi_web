import type { ComponentPropsWithRef, ReactNode } from 'react'
import styles from './TableRow.module.css'

export interface TableCell { id: string; content: ReactNode; rowHeader?: boolean }
export interface TableRowProps extends Omit<ComponentPropsWithRef<'tr'>, 'children'> { cells: readonly TableCell[]; selected?: boolean }
export function TableRow({ cells, selected, className, ...props }: TableRowProps) {
  if (cells.some(cell => !cell.id.trim()) || new Set(cells.map(cell => cell.id)).size !== cells.length) throw new Error('TableRow requer identificadores de célula únicos e não vazios.')
  return <tr {...props} aria-selected={selected} className={[styles.row, selected && styles.selected, className].filter(Boolean).join(' ')}>{cells.map(cell => cell.rowHeader ? <th key={cell.id} scope="row">{cell.content}</th> : <td key={cell.id}>{cell.content}</td>)}</tr>
}
