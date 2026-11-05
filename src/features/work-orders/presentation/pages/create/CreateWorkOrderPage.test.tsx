import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { DataSourceSelection } from '../../../../../app/data-source/dataSource'
import { DataSourceProvider } from '../../../../../app/data-source/DataSourceProvider'
import { useDataSource } from '../../../../../app/data-source/dataSourceContext'
import { AppRoutes } from '../../../../../app/routing/AppRoutes'
import { WorkOrderServiceProvider } from '../../../../../app/work-orders/providers/WorkOrderServiceProvider'
import { useWorkOrderServices } from '../../../../../app/work-orders/providers/workOrderServiceContext'

afterEach(cleanup)

function Controls() {
  const { mockControls, selectMockScenario } = useWorkOrderServices()
  const { select } = useDataSource()
  return <><button onClick={() => mockControls?.clear()}>Limpar mocks</button><button onClick={() => selectMockScenario('error')}>Simular erro</button><button onClick={() => select('api')}>Selecionar API</button></>
}

function showPage() {
  render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><DataSourceProvider selection={new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: true })}><WorkOrderServiceProvider><MemoryRouter initialEntries={['/ordens-servico/nova']}><Controls /><AppRoutes /></MemoryRouter></WorkOrderServiceProvider></DataSourceProvider></QueryClientProvider>)
}

async function fillForm() {
  await screen.findByRole('option', { name: 'Vale Sereno, Lda.' })
  fireEvent.change(screen.getByRole('textbox', { name: 'Referência' }), { target: { value: 'OS-TESTE-123' } })
  fireEvent.change(screen.getByRole('combobox', { name: 'Cliente' }), { target: { value: 'CLI-1002' } })
  fireEvent.change(screen.getByRole('combobox', { name: 'Local de intervenção' }), { target: { value: 'LOC-1002' } })
  fireEvent.change(screen.getByRole('textbox', { name: 'Tipo de serviço' }), { target: { value: 'Manutenção' } })
  fireEvent.change(screen.getByRole('textbox', { name: 'Descrição do serviço' }), { target: { value: 'Verificar equipamento.' } })
}

describe('criação de ordem', () => {
  it('cria uma ordem mock mesmo após limpar a lista e apresenta o detalhe', async () => {
    showPage()
    fireEvent.click(screen.getByRole('button', { name: 'Limpar mocks' }))
    await fillForm()
    expect(screen.getByRole('combobox', { name: 'Prioridade' })).toHaveValue('NORMAL')
    fireEvent.click(screen.getByRole('button', { name: 'Criar ordem de serviço' }))
    expect(await screen.findByRole('heading', { name: 'OS-TESTE-123' })).toBeInTheDocument()
    expect(screen.getByText('Verificar equipamento.')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Resumo da ordem' })).toHaveTextContent('Normal')
  })

  it.each([['BAIXA', 'Baixa'], ['ALTA', 'Alta']])('guarda e apresenta a prioridade %s', async (value, label) => {
    showPage()
    await fillForm()
    fireEvent.change(screen.getByRole('combobox', { name: 'Prioridade' }), { target: { value } })
    fireEvent.click(screen.getByRole('button', { name: 'Criar ordem de serviço' }))
    expect(await screen.findByRole('heading', { name: 'OS-TESTE-123' })).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Resumo da ordem' })).toHaveTextContent(label)
    fireEvent.click(screen.getByRole('link', { name: 'Voltar à lista de ordens' }))
    const filter = await screen.findByRole('combobox', { name: 'Prioridade' })
    expect(await within(filter).findByRole('option', { name: label })).toHaveValue(value)
    fireEvent.change(filter, { target: { value } })
    expect(await screen.findByText('OS-TESTE-123')).toBeInTheDocument()
    expect(screen.queryByText('OS-EXEMPLO-001')).not.toBeInTheDocument()
  })

  it('mostra uma falha sem abandonar o formulário e não disponibiliza mocks na API', async () => {
    showPage()
    fireEvent.click(screen.getByRole('button', { name: 'Simular erro' }))
    await fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Criar ordem de serviço' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível criar a ordem')
    expect(screen.getByRole('textbox', { name: 'Referência' })).toHaveValue('OS-TESTE-123')
    fireEvent.click(screen.getByRole('button', { name: 'Selecionar API' }))
    expect(screen.getByText('Criação indisponível')).toBeInTheDocument()
    expect(screen.queryByRole('combobox', { name: 'Cliente' })).not.toBeInTheDocument()
  })
})
