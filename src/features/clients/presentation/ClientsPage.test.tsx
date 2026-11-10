import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { DataSourceSelection } from '../../../app/data-source/dataSource'
import { DataSourceProvider } from '../../../app/data-source/DataSourceProvider'
import { AppRoutes } from '../../../app/routing/AppRoutes'
import { WorkOrderServiceProvider } from '../../../app/work-orders/providers/WorkOrderServiceProvider'

afterEach(cleanup)

describe('clientes e locais', () => {
  it('abre a página, filtra clientes e mostra os locais associados', async () => {
    render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><DataSourceProvider selection={new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: true })}><WorkOrderServiceProvider><MemoryRouter initialEntries={['/ordens-servico']}><AppRoutes /></MemoryRouter></WorkOrderServiceProvider></DataSourceProvider></QueryClientProvider>)
    fireEvent.click(screen.getByRole('link', { name: /Clientes e locais/ }))
    expect(await screen.findByRole('heading', { name: 'Clientes e locais' })).toBeInTheDocument()
    const search = screen.getByRole('searchbox', { name: 'Pesquisar clientes' })
    fireEvent.change(search, { target: { value: 'Vale Sereno' } })
    const table = await screen.findByRole('region', { name: 'Tabela: Clientes' })
    expect(await within(table).findByText('Vale Sereno, Lda.')).toBeInTheDocument()
    fireEvent.click(within(table).getByRole('button', { name: 'Consultar locais de Vale Sereno, Lda.' }))
    expect(await screen.findByRole('heading', { name: 'Locais de Vale Sereno, Lda.' })).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'Tabela: Locais de Vale Sereno, Lda.' })).getAllByRole('row').length).toBeGreaterThan(1)
    fireEvent.change(search, { target: { value: 'cliente inexistente' } })
    expect(screen.getByText('Nenhum cliente encontrado')).toBeInTheDocument()
  })
})
