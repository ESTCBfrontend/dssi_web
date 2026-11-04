import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DataSourceProvider } from './DataSourceProvider'
import { DataSourceSelection } from './dataSource'
import { useDataSource } from './dataSourceContext'

afterEach(cleanup)

function SourceConsumer() {
  const { source, canSelect, select } = useDataSource()
  return (
    <div>
      <output aria-label="Origem">{source}</output>
      <button disabled={!canSelect} onClick={() => select('mock')}>Selecionar mock</button>
    </div>
  )
}

describe('origem de dados na composição React', () => {
  it('atualiza os consumidores quando a origem muda e mantém instâncias independentes', () => {
    const first = new DataSourceSelection({ allowRuntimeSelection: true })
    const second = new DataSourceSelection({ allowRuntimeSelection: true })

    render(
      <>
        <DataSourceProvider selection={first}><SourceConsumer /></DataSourceProvider>
        <DataSourceProvider selection={second}><SourceConsumer /></DataSourceProvider>
      </>,
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Selecionar mock' })[0])
    const sources = screen.getAllByLabelText('Origem')
    expect(sources[0]).toHaveTextContent('mock')
    expect(sources[1]).toHaveTextContent('api')
  })

  it('expõe que a seleção está desativada sem alterar a origem inicial', () => {
    const selection = new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: false })
    render(<DataSourceProvider selection={selection}><SourceConsumer /></DataSourceProvider>)

    expect(screen.getByLabelText('Origem')).toHaveTextContent('mock')
    expect(screen.getByRole('button', { name: 'Selecionar mock' })).toBeDisabled()
  })
})
