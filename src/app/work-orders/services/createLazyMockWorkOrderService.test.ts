import { afterEach, describe, expect, it, vi } from 'vitest'
import { logger } from '../../../shared/logging/logger'
import { createLazyMockWorkOrderService } from './createLazyMockWorkOrderService'

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers() })

describe('diagnóstico do serviço mock', () => {
  it('regista falhas sem expor o erro ou alterar a rejeição', async () => {
    const log = vi.spyOn(logger, 'log').mockImplementation(() => {})
    const { service } = createLazyMockWorkOrderService('error')
    await expect(service.list()).rejects.toThrow('Erro simulado')
    expect(log).toHaveBeenCalledWith('error', { area: 'ordens-servico', operation: 'listar', result: 'erro', source: 'mock' })
  })

  it('regista contagens ao adicionar exemplos sem incluir os seus dados', () => {
    const log = vi.spyOn(logger, 'log').mockImplementation(() => {})
    const { controls } = createLazyMockWorkOrderService('empty')
    const counts = controls.addAllExamples()
    expect(log).toHaveBeenCalledWith('info', { area: 'ordens-servico', operation: 'adicionar-todos', result: 'sucesso', source: 'mock', counts })
  })

  it('correlaciona o início e o fim de uma operação lenta', async () => {
    vi.useFakeTimers()
    const log = vi.spyOn(logger, 'log').mockImplementation(() => {})
    const { service } = createLazyMockWorkOrderService('slow')
    const pending = service.list()
    expect(log).toHaveBeenCalledWith('info', expect.objectContaining({ operation: 'listar', result: 'iniciada', correlation: expect.any(Number) }))
    await vi.advanceTimersByTimeAsync(1200)
    await pending
    const started = log.mock.calls.find(([, event]) => event.result === 'iniciada')?.[1]
    expect(log).toHaveBeenCalledWith('info', expect.objectContaining({ operation: 'listar', result: 'sucesso', correlation: started?.correlation, durationMs: 1200 }))
  })
})
