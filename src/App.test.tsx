import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { DataSourceProvider } from './app/data-source/DataSourceProvider'
import { DataSourceSelection } from './app/data-source/dataSource'
import { WorkOrderServiceProvider } from './app/work-orders/providers/WorkOrderServiceProvider'

describe('aplicação', () => {
  it('apresenta a página inicial do projeto', () => {
    render(<QueryClientProvider client={new QueryClient()}><DataSourceProvider selection={new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: true })}><WorkOrderServiceProvider><MemoryRouter><App /></MemoryRouter></WorkOrderServiceProvider></DataSourceProvider></QueryClientProvider>)
    expect(screen.getByRole('heading', { name: 'Ordens de serviço' })).toBeInTheDocument()
  })
})
