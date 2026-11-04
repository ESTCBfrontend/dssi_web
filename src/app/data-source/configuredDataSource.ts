import { DataSourceSelection } from './dataSource'

type DataSourceEnvironment = {
  configuredSource?: string
  debugLayerEnabled: boolean
  development: boolean
}

export function createConfiguredDataSource({
  configuredSource,
  debugLayerEnabled,
  development,
}: DataSourceEnvironment): DataSourceSelection {
  return new DataSourceSelection({
    configuredSource,
    allowRuntimeSelection: development && debugLayerEnabled,
  })
}
