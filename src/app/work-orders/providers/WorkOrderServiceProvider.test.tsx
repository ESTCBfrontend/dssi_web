import { useState } from 'react'
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DataSourceProvider } from '../../data-source/DataSourceProvider'
import { DataSourceSelection } from '../../data-source/dataSource'
import { WorkOrderServiceProvider } from './WorkOrderServiceProvider'
import { useWorkOrderServices } from './workOrderServiceContext'

afterEach(cleanup)

function ServiceConsumer() {
  const { service, status, mockScenario, selectMockScenario } = useWorkOrderServices()
  const [result, setResult] = useState('')
  return (
    <div>
      <output aria-label="Estado">{status}</output>
      <output aria-label="Cenário">{mockScenario}</output>
      <button onClick={() => selectMockScenario('empty')}>Selecionar vazio</button>
      <button onClick={() => selectMockScenario('error')}>Selecionar erro</button>
      <button onClick={() => {
        setResult('A criar')
        void service?.create({
          code: 'OS-TESTE', client: { id: '1', name: 'Cliente' }, site: { id: '1', name: 'Local' },
          serviceType: 'Manutenção', description: 'Inspeção',
        }).then(() => setResult('Criada'))
      }}>Criar ordem</button>
      <button onClick={() => {
        setResult('A carregar')
        void service?.list()
          .then(orders => setResult(orders.map(order => order.code).join(', ')))
          .catch(() => setResult('Erro simulado'))
      }}>Listar ordens</button>
      <output aria-label="Resultado">{result}</output>
    </div>
  )
}

describe('composição do serviço de ordens de serviço', () => {
  it('isola API indisponível e preserva o mock ao alternar a origem', async () => {
    const selection = new DataSourceSelection({ allowRuntimeSelection: true })
    render(<DataSourceProvider selection={selection}><WorkOrderServiceProvider><ServiceConsumer /></WorkOrderServiceProvider></DataSourceProvider>)

    expect(screen.getByLabelText('Estado')).toHaveTextContent('unavailable')
    act(() => selection.select('mock'))
    expect(await screen.findByText('ready')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Criar ordem' }))
    expect(await screen.findByText('Criada')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Listar ordens' }))
    expect(await screen.findByText(/OS-TESTE/)).toBeInTheDocument()

    act(() => selection.select('api'))
    expect(screen.getByLabelText('Estado')).toHaveTextContent('unavailable')
    act(() => selection.select('mock'))
    fireEvent.click(screen.getByRole('button', { name: 'Listar ordens' }))
    expect(await screen.findByText(/OS-TESTE/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Selecionar vazio' }))
    expect(screen.getByLabelText('Cenário')).toHaveTextContent('empty')
    fireEvent.click(screen.getByRole('button', { name: 'Listar ordens' }))
    await waitFor(() => expect(screen.getByLabelText('Resultado')).toBeEmptyDOMElement())

    fireEvent.click(screen.getByRole('button', { name: 'Selecionar erro' }))
    fireEvent.click(screen.getByRole('button', { name: 'Listar ordens' }))
    expect(await screen.findByText('Erro simulado')).toBeInTheDocument()
  })

  it('disponibiliza a origem mock configurada mesmo sem ferramentas de desenvolvimento', async () => {
    const selection = new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: false })
    render(<DataSourceProvider selection={selection}><WorkOrderServiceProvider><ServiceConsumer /></WorkOrderServiceProvider></DataSourceProvider>)

    expect(screen.getByLabelText('Estado')).toHaveTextContent('ready')
    fireEvent.click(screen.getByRole('button', { name: 'Listar ordens' }))
    expect(await screen.findByText(/OS-EXEMPLO-001/)).toBeInTheDocument()
  })
})
