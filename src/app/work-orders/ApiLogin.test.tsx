import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { DataSourceProvider } from '../data-source/DataSourceProvider'
import { DataSourceSelection } from '../data-source/dataSource'
import { AppRoutes } from '../routing/AppRoutes'
import { WorkOrderServiceProvider } from './providers/WorkOrderServiceProvider'
import DebugLayer from '../debug/DebugLayer'

const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'showModal')
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, 'close')
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value(this: HTMLDialogElement) { this.open = true } })
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value(this: HTMLDialogElement) { this.open = false } })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })
afterAll(() => {
  if (originalShowModal) Object.defineProperty(HTMLDialogElement.prototype, 'showModal', originalShowModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  if (originalClose) Object.defineProperty(HTMLDialogElement.prototype, 'close', originalClose)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
})

describe('sessão API', () => {
  it('inicia sessão, apresenta dados da API e termina a sessão', async () => {
    const fetcher = vi.fn(async (url: string) => new Response(JSON.stringify(url.endsWith('/auth/login') ? { accessToken: 'token' } : {
      items: [{ id: 'id', code: 'OS-API-1', client: { id: 'c', name: 'Cliente API' }, site: { id: 's', name: 'Local' }, serviceType: 'MANUTENCAO', status: 'NOVA', priority: 'NORMAL', scheduledDate: null, assignedTechnician: null }], totalPages: 1,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    vi.stubGlobal('fetch', fetcher)
    render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><DataSourceProvider selection={new DataSourceSelection({ configuredSource: 'api', allowRuntimeSelection: true })}><WorkOrderServiceProvider><DebugLayer /><MemoryRouter><AppRoutes /></MemoryRouter></WorkOrderServiceProvider></DataSourceProvider></QueryClientProvider>)
    fireEvent.change(screen.getByRole('textbox', { name: 'Email' }), { target: { value: 'gestao@example.test' } })
    fireEvent.change(screen.getByLabelText(/Palavra-passe/), { target: { value: 'teste' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))
    expect(await screen.findByText('OS-API-1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Abrir ferramentas de desenvolvimento' }))
    fireEvent.click(screen.getByRole('button', { name: 'Terminar sessão' }))
    expect(screen.getByRole('heading', { name: 'Iniciar sessão' })).toBeInTheDocument()
    expect(screen.queryByText('OS-API-1')).not.toBeInTheDocument()
  })
})
