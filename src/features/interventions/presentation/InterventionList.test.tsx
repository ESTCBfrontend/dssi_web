import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import type { InterventionService } from '../application/interventionService'
import { MockInterventionService } from '../infrastructure/mock/services/MockInterventionService'
import { InterventionList } from './InterventionList'

afterEach(cleanup)

it('apresenta falha da análise sem comunicar sucesso e permite tentar novamente', async () => {
  const item = new MockInterventionService(() => true).listExamples().find(example => example.id === 'mock-intervencao-1')!
  const review = vi.fn().mockRejectedValueOnce(new Error('falha')).mockResolvedValueOnce({ ...item, review: { status: 'VALIDADA', reason: null } })
  const service: InterventionService = { listByWorkOrder: vi.fn(), review }
  render(<InterventionList items={[item]} loading={false} error={null} onRetry={() => {}} service={service} />)
  fireEvent.click(screen.getByRole('button', { name: /Analisar intervenção/ }))
  fireEvent.click(screen.getByRole('button', { name: 'Validar' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível registar a análise')
  expect(screen.queryByRole('status')).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Validar' }))
  expect(await screen.findByRole('status')).toHaveTextContent('Intervenção validada na sessão de testes.')
  expect(review).toHaveBeenCalledTimes(2)
})
