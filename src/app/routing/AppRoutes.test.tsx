import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from './AppRoutes'
import { DataSourceProvider } from '../data-source/DataSourceProvider'
import { DataSourceSelection } from '../data-source/dataSource'
import { WorkOrderServiceProvider } from '../work-orders/providers/WorkOrderServiceProvider'

afterEach(cleanup)

describe('rotas da aplicação', () => {
  it('apresenta o ecrã inicial na raiz', () => {
    render(<QueryClientProvider client={new QueryClient()}><DataSourceProvider selection={new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: true })}><WorkOrderServiceProvider><MemoryRouter initialEntries={['/']}><AppRoutes /></MemoryRouter></WorkOrderServiceProvider></DataSourceProvider></QueryClientProvider>)
    expect(screen.getByRole('heading', { name: 'Ordens de serviço' })).toBeInTheDocument()
  })

  it('apresenta uma alternativa para uma rota desconhecida e permite regressar', async () => {
    render(<QueryClientProvider client={new QueryClient()}><DataSourceProvider selection={new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: true })}><WorkOrderServiceProvider><MemoryRouter initialEntries={['/pagina-inexistente']}><AppRoutes /></MemoryRouter></WorkOrderServiceProvider></DataSourceProvider></QueryClientProvider>)
    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Voltar ao início' }))
    expect(await screen.findByRole('heading', { name: 'Ordens de serviço' })).toBeInTheDocument()
  })
})
