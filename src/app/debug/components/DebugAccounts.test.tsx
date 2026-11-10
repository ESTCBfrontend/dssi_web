import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DataSourceProvider } from '../../data-source/DataSourceProvider'
import { DataSourceSelection } from '../../data-source/dataSource'
import { WorkOrderServiceProvider } from '../../work-orders/providers/WorkOrderServiceProvider'
import { apiBaseUrl } from '../../../features/work-orders/infrastructure/api/ApiWorkOrderService'
import { DebugAccounts } from './DebugAccounts'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

function showAccounts(apiUrl = apiBaseUrl) {
  const onSuccess = vi.fn()
  const client = new QueryClient()
  render(<QueryClientProvider client={client}><DataSourceProvider selection={new DataSourceSelection({ configuredSource: 'api', allowRuntimeSelection: true })}><WorkOrderServiceProvider>
    <DebugAccounts onSuccess={onSuccess} accountFiles={[{ apiUrl, accounts: [{ label: 'Teste', email: 'test@example.test', password: 'example' }] }]} />
  </WorkOrderServiceProvider></DataSourceProvider></QueryClientProvider>)
  return { onSuccess, client }
}

describe('contas locais de teste', () => {
  it('autentica a conta selecionada e limpa dados da sessão anterior', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ accessToken: 'example-token' }), { status: 200 }))
    vi.stubGlobal('fetch', fetcher)
    const { onSuccess, client } = showAccounts()
    client.setQueryData(['work-orders', 'old'], ['old'])
    fireEvent.click(screen.getByRole('button', { name: 'Entrar como Teste' }))
    expect(await screen.findByRole('status')).toHaveTextContent('A iniciar sessão')
    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalledOnce())
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ email: 'test@example.test', password: 'example' })
    expect(client.getQueryData(['work-orders', 'old'])).toBeUndefined()
  })

  it('apresenta um erro quando a autenticação falha', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 401 })))
    const { onSuccess } = showAccounts()
    fireEvent.click(screen.getByRole('button', { name: 'Entrar como Teste' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível iniciar sessão')
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('não disponibiliza contas para outra API', () => {
    showAccounts('https://outra.example.test/api/v1')
    expect(screen.queryByRole('button', { name: 'Entrar como Teste' })).not.toBeInTheDocument()
    expect(screen.getByText(/Não existem contas locais/)).toBeInTheDocument()
  })
})
