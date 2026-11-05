import { createContext, useContext, useSyncExternalStore } from 'react'
import type { DataSourceSelection } from './dataSource'

export const DataSourceContext = createContext<DataSourceSelection | null>(null)

export function useDataSource() {
  const selection = useContext(DataSourceContext)
  if (!selection) throw new Error('A origem de dados não foi configurada na aplicação.')

  const source = useSyncExternalStore(selection.subscribe, selection.getSnapshot, selection.getSnapshot)
  return { source, canSelect: selection.canSelect, select: (value: typeof source) => selection.select(value) }
}
