import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from '../../../../../app/routing/AppRoutes'
import { DataSourceProvider } from '../../../../../app/data-source/DataSourceProvider'
import { DataSourceSelection } from '../../../../../app/data-source/dataSource'
import { useDataSource } from '../../../../../app/data-source/dataSourceContext'
import { WorkOrderServiceProvider } from '../../../../../app/work-orders/providers/WorkOrderServiceProvider'
import { useWorkOrderServices } from '../../../../../app/work-orders/providers/workOrderServiceContext'

afterEach(cleanup)

function Controls() {
  const { mockControls, interventionControls, selectMockScenario } = useWorkOrderServices()
  const { select } = useDataSource()
  return <div>
    <button onClick={() => mockControls?.clear()}>Limpar dados</button>
    <button onClick={() => mockControls?.addAllExamples()}>Adicionar dados</button>
    <button onClick={() => select('api')}>Escolher API</button>
    <button onClick={() => select('mock')}>Escolher mock</button>
    <button onClick={() => selectMockScenario('error')}>Simular falha</button>
    <button onClick={() => interventionControls?.addAllExamples()}>Adicionar intervenções de teste</button>
    <button onClick={() => interventionControls?.clear()}>Limpar intervenções de teste</button>
  </div>
}

function showApp(path = '/') {
  render(<QueryClientProvider client={new QueryClient()}><DataSourceProvider selection={new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: true })}><WorkOrderServiceProvider><MemoryRouter initialEntries={[path]}><Controls /><AppRoutes /></MemoryRouter></WorkOrderServiceProvider></DataSourceProvider></QueryClientProvider>)
}

describe('detalhe da ordem de serviço', () => {
  it('atribui técnico fictício e apresenta a alteração no detalhe e na lista', async () => {
    showApp('/ordens-servico/mock-os-1')
    expect(await screen.findByRole('heading', { name: 'OS-EXEMPLO-001' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Gerir atribuição' }))
    const section = screen.getByRole('region', { name: 'Atribuir técnico' })
    const select = await within(section).findByRole('combobox', { name: 'Técnico' })
    await waitFor(() => expect(within(select).getByRole('option', { name: 'João Almeida' })).toBeInTheDocument())
    fireEvent.change(select, { target: { value: 'mock-tech-1' } })
    fireEvent.click(within(section).getByRole('button', { name: 'Confirmar atribuição' }))
    expect(await screen.findByText('Técnico atribuído com sucesso.')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('region', { name: 'Resumo da ordem' })).toHaveTextContent('João Almeida'))
    expect(screen.getByRole('region', { name: 'Resumo da ordem' })).toHaveTextContent('Atribuída')
    fireEvent.click(screen.getByRole('link', { name: 'Voltar à lista de ordens' }))
    expect(await screen.findByRole('heading', { name: 'Ordens de serviço' })).toBeInTheDocument()
    expect(await screen.findByRole('row', { name: /OS-EXEMPLO-001/ })).toHaveTextContent('João Almeida')
  })

  it('permite cancelar sem atribuir e não permite reatribuição', async () => {
    showApp('/ordens-servico/mock-os-1')
    await screen.findByRole('heading', { name: 'OS-EXEMPLO-001' })
    fireEvent.click(screen.getByRole('button', { name: 'Gerir atribuição' }))
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByRole('region', { name: 'Atribuir técnico' })).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Resumo da ordem' })).toHaveTextContent('Por atribuir')
  })

  it('abre a ordem da listagem e permite regressar', async () => {
    showApp()
    fireEvent.click(await screen.findByRole('link', { name: 'Abrir OS-EXEMPLO-001' }))
    expect(await screen.findByRole('heading', { name: 'OS-EXEMPLO-001' })).toBeInTheDocument()
    expect(screen.getByText('Horizonte Azul, Lda.')).toBeInTheDocument()
    expect(screen.getByText('Histórico ainda não disponível.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('link', { name: 'Voltar à lista de ordens' }))
    expect(await screen.findByRole('heading', { name: 'Ordens de serviço' })).toBeInTheDocument()
  })

  it('reage à remoção e reposição de uma ordem e isola a origem API', async () => {
    showApp('/ordens-servico/mock-os-1')
    expect(await screen.findByRole('heading', { name: 'OS-EXEMPLO-001' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpar dados' }))
    expect(await screen.findByText('Ordem não encontrada')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar dados' }))
    expect(await screen.findByRole('heading', { name: 'OS-EXEMPLO-001' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Escolher API' }))
    expect(screen.getByText('A ligação à API de ordens de serviço ainda não está disponível.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'OS-EXEMPLO-001' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Escolher mock' }))
    expect(await screen.findByRole('heading', { name: 'OS-EXEMPLO-001' })).toBeInTheDocument()
  })

  it('distingue ordem inexistente de falha do serviço', async () => {
    showApp('/ordens-servico/inexistente')
    expect(await screen.findByText('Ordem não encontrada')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar à lista de ordens' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Simular falha' }))
    expect(await screen.findByText('Não foi possível carregar a ordem de serviço.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByText('Ordem não encontrada')).not.toBeInTheDocument())
  })

  it('atualiza intervenções da OS aberta sem alterar o estado da ordem', async () => {
    showApp('/ordens-servico/mock-os-4')
    expect(await screen.findByRole('heading', { name: 'OS-EXEMPLO-004' })).toBeInTheDocument()
    const panel = screen.getByRole('region', { name: 'Intervenções' })
    expect(await within(panel).findByText('Não existem intervenções disponíveis para esta ordem.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar intervenções de teste' }))
    expect(await within(panel).findByText('Visita prevista para substituir o sensor da porta do piso térreo.')).toBeInTheDocument()
    expect(within(panel).getByText('Testados os sensores de abertura das portas do piso térreo.')).toBeInTheDocument()
    expect(within(panel).queryByText('Inspecionado o detetor de movimento da zona de carga.')).not.toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Resumo da ordem' })).toHaveTextContent('Em execução')
    fireEvent.click(screen.getByRole('button', { name: 'Escolher API' }))
    expect(screen.queryByRole('region', { name: 'Intervenções' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Escolher mock' }))
    const restoredPanel = await screen.findByRole('region', { name: 'Intervenções' })
    expect(await within(restoredPanel).findByText('Visita prevista para substituir o sensor da porta do piso térreo.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Limpar intervenções de teste' }))
    expect(await within(restoredPanel).findByText('Não existem intervenções disponíveis para esta ordem.')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Resumo da ordem' })).toHaveTextContent('Em execução')
  })
})
