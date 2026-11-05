import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DataSourceProvider } from '../../../app/data-source/DataSourceProvider'
import { DataSourceSelection } from '../../../app/data-source/dataSource'
import { WorkOrderServiceProvider } from '../../../app/work-orders/providers/WorkOrderServiceProvider'
import { useWorkOrderServices } from '../../../app/work-orders/providers/workOrderServiceContext'
import { useDataSource } from '../../../app/data-source/dataSourceContext'
import { WorkOrdersPage } from './WorkOrdersPage'

afterEach(cleanup)

function Controls() {
  const { mockControls, selectMockScenario } = useWorkOrderServices()
  const { select } = useDataSource()
  return <div>
    <button onClick={() => mockControls?.clear()}>Limpar dados de teste</button>
    <button onClick={() => mockControls?.addAllExamples()}>Adicionar dados de teste</button>
    <button onClick={() => selectMockScenario('error')}>Simular erro</button>
    <button onClick={() => selectMockScenario('empty')}>Cenário vazio</button>
    <button onClick={() => selectMockScenario('normal')}>Cenário normal</button>
    <button onClick={() => selectMockScenario('slow')}>Cenário lento</button>
    <button onClick={() => select('api')}>Selecionar API</button>
    <button onClick={() => select('mock')}>Selecionar mock</button>
  </div>
}

function showPage(source: 'mock' | 'api' = 'mock') {
  return render(<QueryClientProvider client={new QueryClient()}><DataSourceProvider selection={new DataSourceSelection({ configuredSource: source, allowRuntimeSelection: true })}>
    <WorkOrderServiceProvider><MemoryRouter><Controls /><WorkOrdersPage /></MemoryRouter></WorkOrderServiceProvider>
  </DataSourceProvider></QueryClientProvider>)
}

describe('listagem de ordens de serviço', () => {
  it('mostra os dados e filtra as ordens pela pesquisa', async () => {
    showPage()
    expect(await screen.findByText('OS-EXEMPLO-001')).toBeInTheDocument()
    const tableRegion = screen.getByRole('region', { name: 'Tabela: Todas as ordens' })
    tableRegion.focus()
    expect(tableRegion).toHaveFocus()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Pesquisar' }), { target: { value: 'OS-EXEMPLO-001' } })
    expect(screen.getByText('1 resultado')).toBeInTheDocument()
    expect(screen.getByText('OS-EXEMPLO-001')).toBeInTheDocument()
    fireEvent.change(screen.getByRole('searchbox', { name: 'Pesquisar' }), { target: { value: 'inexistente' } })
    expect(screen.getByText('Nenhuma ordem encontrada')).toBeInTheDocument()
  })

  it('atualiza a listagem quando os dados mock são removidos e adicionados', async () => {
    showPage()
    expect(await screen.findByText('OS-EXEMPLO-001')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpar dados de teste' }))
    expect(await screen.findByText('Nenhuma ordem encontrada')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar dados de teste' }))
    expect(await screen.findByText('OS-EXEMPLO-001')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('7 resultados')).toBeInTheDocument())
  })

  it('permite ordenar os estados mantendo o cabeçalho acessível', async () => {
    showPage()
    expect(await screen.findByText('OS-EXEMPLO-001')).toBeInTheDocument()
    const sortButton = screen.getByRole('button', { name: /Estado: sem ordenação/ })
    const header = sortButton.closest('th')
    fireEvent.click(sortButton)
    expect(header).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.getByRole('table', { name: 'Todas as ordens' })).toBeInTheDocument()
  })

  it('mostra o erro do serviço e permite nova tentativa', async () => {
    showPage()
    expect(await screen.findByText('OS-EXEMPLO-001')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Simular erro' }))
    expect(await screen.findByText('Não foi possível carregar as ordens de serviço.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
  })

  it('isola a API e repõe os dados ao voltar a criar um cenário', async () => {
    showPage()
    expect(await screen.findByText('OS-EXEMPLO-001')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpar dados de teste' }))
    expect(await screen.findByText('Nenhuma ordem encontrada')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Selecionar API' }))
    expect(screen.getByText('A ligação à API de ordens de serviço ainda não está disponível.')).toBeInTheDocument()
    expect(screen.queryByText('OS-EXEMPLO-001')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Selecionar mock' }))
    expect(await screen.findByText('Nenhuma ordem encontrada')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cenário vazio' }))
    expect(await screen.findByText('Nenhuma ordem encontrada')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cenário normal' }))
    expect(await screen.findByText('OS-EXEMPLO-001')).toBeInTheDocument()
  })

  it('não substitui o cenário atual por uma resposta atrasada do cenário anterior', async () => {
    showPage()
    expect(await screen.findByText('OS-EXEMPLO-001')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cenário lento' }))
    expect(screen.getByText('A carregar registos...')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cenário vazio' }))
    expect(await screen.findByText('Nenhuma ordem encontrada')).toBeInTheDocument()
    await new Promise(resolve => setTimeout(resolve, 1300))
    expect(screen.getByText('Nenhuma ordem encontrada')).toBeInTheDocument()
    expect(screen.queryByText('OS-EXEMPLO-001')).not.toBeInTheDocument()
  })

  it('não apresenta dados mock quando a API está indisponível', () => {
    showPage('api')
    expect(screen.getByText('A ligação à API de ordens de serviço ainda não está disponível.')).toBeInTheDocument()
    expect(screen.queryByText('OS-EXEMPLO-001')).not.toBeInTheDocument()
  })
})
