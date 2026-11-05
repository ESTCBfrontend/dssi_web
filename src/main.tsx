import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'
import { createConfiguredDataSource } from './app/data-source/configuredDataSource'
import { DataSourceProvider } from './app/data-source/DataSourceProvider'
import { ENABLE_DEBUG_LAYER } from './app/debug/debugConfig'
import { WorkOrderServiceProvider } from './app/work-orders/providers/WorkOrderServiceProvider'

const dataSource = createConfiguredDataSource({
  configuredSource: import.meta.env.VITE_DATA_SOURCE,
  debugLayerEnabled: ENABLE_DEBUG_LAYER,
  development: import.meta.env.DEV,
})

const DebugLayer = import.meta.env.DEV && ENABLE_DEBUG_LAYER
  ? lazy(() => import('./app/debug/DebugLayer'))
  : null

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <DataSourceProvider selection={dataSource}>
        <WorkOrderServiceProvider>
          {DebugLayer && <Suspense fallback={null}><DebugLayer /></Suspense>}
          <BrowserRouter><App /></BrowserRouter>
        </WorkOrderServiceProvider>
      </DataSourceProvider>
    </QueryClientProvider>
  </StrictMode>,
)
