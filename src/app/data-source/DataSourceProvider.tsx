import type { ReactNode } from 'react'
import type { DataSourceSelection } from './dataSource'
import { DataSourceContext } from './dataSourceContext'

type DataSourceProviderProps = {
  selection: DataSourceSelection
  children: ReactNode
}

export function DataSourceProvider({ selection, children }: DataSourceProviderProps) {
  return <DataSourceContext.Provider value={selection}>{children}</DataSourceContext.Provider>
}
