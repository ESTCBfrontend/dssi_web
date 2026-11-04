import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { useState } from 'react'
import { DataSourceProvider } from '../data-source/DataSourceProvider'
import { DataSourceSelection } from '../data-source/dataSource'
import { WorkOrderServiceProvider } from '../work-orders/providers/WorkOrderServiceProvider'
import { useWorkOrderServices } from '../work-orders/providers/workOrderServiceContext'
import type { MockWorkOrderControls } from '../../features/work-orders/infrastructure/mock/services/MockWorkOrderControls'
import { MockWorkOrderService } from '../../features/work-orders/infrastructure/mock/services/MockWorkOrderService'
import { ToastProvider } from '../../shared/ui/ToastSnackbar'
import { WorkOrderMockMenu } from './components/WorkOrderMockMenu'
import DebugLayer from './DebugLayer'

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) { this.open = true },
  })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) { this.open = false },
  })
})

afterEach(cleanup)
afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

function WorkOrderProbe() {
  const { service } = useWorkOrderServices()
  const [count, setCount] = useState<number | null>(null)
  return <div>
    <button onClick={() => { void service?.list().then(orders => setCount(orders.length)) }}>Consultar ordens</button>
    <output aria-label="Número de ordens">{count === null ? '—' : count}</output>
  </div>
}

async function viWaitForCount(counter: HTMLElement, expected?: number) {
  await waitFor(() => {
    expect(counter).not.toHaveTextContent('—')
    if (expected !== undefined) expect(counter.textContent).toBe(String(expected))
  })
}

describe('ferramentas de desenvolvimento', () => {
  it('abre modais sobrepostos e mantém a seleção ao fechar', async () => {
    const selection = new DataSourceSelection({ allowRuntimeSelection: true })
    render(<DataSourceProvider selection={selection}><WorkOrderServiceProvider><DebugLayer /></WorkOrderServiceProvider></DataSourceProvider>)

    expect(screen.queryByText('Origem selecionada:')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }))
    expect(screen.getByRole('dialog', { name: 'Ferramentas de desenvolvimento' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Cenário de ordens de serviço/ })).not.toBeInTheDocument()
    const option = screen.getByRole('button', { name: 'Origem de dados: API' })
    expect(option).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(option)
    expect(option).toHaveAttribute('aria-expanded', 'true')
    fireEvent.change(screen.getByRole('combobox', { name: 'Origem de dados' }), { target: { value: 'mock' } })
    expect(selection.source).toBe('mock')
    expect(screen.getByRole('button', { name: 'Origem de dados: Mock' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Fechar origem de dados' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Origem de dados: Mock' })).toHaveFocus())
    fireEvent.click(screen.getByRole('button', { name: 'Mocks' }))
    expect(screen.getByRole('dialog', { name: 'Ferramentas de desenvolvimento' })).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Mocks' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Cenário OS: Normal' }))
    const scenarioDialog = screen.getByRole('dialog', { name: 'Cenário de ordens de serviço' })
    fireEvent.click(scenarioDialog, { clientX: -1, clientY: -1 })
    // React pode propagar o evento de fecho nativo ao diálogo pai.
    fireEvent(scenarioDialog, new Event('close', { bubbles: true }))
    expect(screen.queryByRole('dialog', { name: 'Cenário de ordens de serviço' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Mocks' })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cenário OS: Normal' })).toHaveFocus())
    fireEvent.click(screen.getByRole('button', { name: 'Cenário OS: Normal' }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Cenário de ordens de serviço' }), { target: { value: 'empty' } })
    expect(screen.getByRole('button', { name: 'Cenário OS: Sem ordens' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Fechar mocks' }))
    fireEvent.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }))
    expect(screen.getByRole('button', { name: 'Origem de dados: Mock' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('não apresenta o menu quando a seleção está desativada', () => {
    const selection = new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: false })
    render(<DataSourceProvider selection={selection}><WorkOrderServiceProvider><DebugLayer /></WorkOrderServiceProvider></DataSourceProvider>)

    expect(screen.queryByRole('button', { name: 'Abrir ferramentas de desenvolvimento' })).not.toBeInTheDocument()
    expect(selection.source).toBe('mock')
  })

  it('adiciona, limpa e repõe dados no mesmo serviço usado pela aplicação', async () => {
    const selection = new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: true })
    render(<DataSourceProvider selection={selection}><WorkOrderServiceProvider><DebugLayer /><WorkOrderProbe /></WorkOrderServiceProvider></DataSourceProvider>)
    const query = () => fireEvent.click(screen.getByRole('button', { name: 'Consultar ordens' }))
    query()
    const counter = screen.getByLabelText('Número de ordens')
    await viWaitForCount(counter)
    const initialCount = Number(counter.textContent)

    fireEvent.click(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }))
    fireEvent.click(screen.getByRole('button', { name: 'Mocks' }))
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar OS' }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Exemplo de ordem de serviço' }), { target: { value: 'mock-os-1' } })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Exemplo de ordem de serviço' }), { target: { value: 'mock-os-2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }))
    const addDialog = screen.getByRole('dialog', { name: 'Adicionar OS' })
    expect(within(addDialog).getAllByText('OS adicionada.').length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: 'Fechar adicionar OS' }))
    query()
    await viWaitForCount(counter, initialCount + 2)

    fireEvent.click(screen.getByRole('button', { name: 'Remover todas as OS' }))
    expect(within(screen.getByRole('dialog', { name: 'Mocks' })).getAllByText(`${initialCount + 2} OS removidas.`).length).toBeGreaterThan(0)
    query()
    await viWaitForCount(counter, 0)
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar todas as OS' }))
    query()
    await viWaitForCount(counter, initialCount)
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar todas as OS' }))
    query()
    await viWaitForCount(counter, initialCount * 2)
    fireEvent.click(screen.getByRole('button', { name: 'Repor cenário' }))
    query()
    await viWaitForCount(counter, initialCount)

    fireEvent.click(screen.getByRole('dialog', { name: 'Mocks' }), { clientX: -1, clientY: -1 })
    expect(screen.queryByRole('dialog', { name: 'Mocks' })).not.toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Ferramentas de desenvolvimento' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('dialog', { name: 'Ferramentas de desenvolvimento' }), { clientX: -1, clientY: -1 })
    expect(screen.queryByRole('dialog', { name: 'Ferramentas de desenvolvimento' })).not.toBeInTheDocument()
  })

  it('apresenta falhas parciais de adição num toast', () => {
    const selection = new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: true })
    const controls: MockWorkOrderControls = {
      listExamples: () => [],
      addExample: () => { throw new Error('Não disponível') },
      addAllExamples: () => ({ added: 2, total: 3 }),
      clear: () => 0,
      reset: () => 0,
    }
    render(<DataSourceProvider selection={selection}><WorkOrderServiceProvider><ToastProvider><WorkOrderMockMenu controls={controls} /></ToastProvider></WorkOrderServiceProvider></DataSourceProvider>)

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar todas as OS' }))
    expect(screen.getAllByText('Não foi possível adicionar 1 de 3 OS. 2 adicionadas.').length).toBeGreaterThan(0)
    expect(screen.getByRole('alert')).toHaveTextContent('Não foi possível adicionar 1 de 3 OS.')
  })

  it('apresenta o erro de adição no diálogo que está aberto', () => {
    const selection = new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: true })
    const controls = new MockWorkOrderService()
    vi.spyOn(controls, 'addExample').mockImplementation(() => { throw new Error('Falha simulada') })
    render(<DataSourceProvider selection={selection}><WorkOrderServiceProvider><ToastProvider><WorkOrderMockMenu controls={controls} /></ToastProvider></WorkOrderServiceProvider></DataSourceProvider>)

    fireEvent.click(screen.getByRole('button', { name: 'Adicionar OS' }))
    const addDialog = screen.getByRole('dialog', { name: 'Adicionar OS' })
    fireEvent.change(within(addDialog).getByRole('combobox', { name: 'Exemplo de ordem de serviço' }), { target: { value: 'mock-os-1' } })
    fireEvent.click(within(addDialog).getByRole('button', { name: 'Adicionar' }))
    expect(within(addDialog).getByRole('alert')).toHaveTextContent('Não foi possível adicionar a OS selecionada.')
  })
})
