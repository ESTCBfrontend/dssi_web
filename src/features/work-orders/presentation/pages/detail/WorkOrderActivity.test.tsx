import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { WorkOrderActivity } from './WorkOrderActivity'

afterEach(cleanup)

it('distingue falha de histórico vazio e permite tentar novamente', () => {
  const retry = vi.fn()
  render(<WorkOrderActivity events={[]} loading={false} error="Falha simulada." onRetry={retry} />)
  expect(screen.getByText('Não foi possível consultar o histórico')).toBeInTheDocument()
  expect(screen.queryByText('Ainda não existem atividades nesta sessão de testes.')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
  expect(retry).toHaveBeenCalledOnce()
})
