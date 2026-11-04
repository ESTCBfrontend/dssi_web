import { describe, expect, it, vi } from 'vitest'
import { createWorkOrderMockScenario } from './workOrderScenarios'

describe('cenários fictícios de ordens de serviço', () => {
  it('oferece dados de exemplo ou uma lista vazia', async () => {
    expect((await createWorkOrderMockScenario('normal').list()).length).toBeGreaterThan(1)
    expect(await createWorkOrderMockScenario('empty').list()).toEqual([])
  })

  it('simula falhas em operações de leitura e criação', async () => {
    const service = createWorkOrderMockScenario('error')
    await expect(service.list()).rejects.toThrow('Erro simulado')
    await expect(service.getById('mock-os-1')).rejects.toThrow('Erro simulado')
    await expect(service.create({
      code: 'OS-TESTE', client: { id: '1', name: 'Cliente' }, site: { id: '1', name: 'Local' },
      serviceType: 'Manutenção', description: 'Inspeção',
    })).rejects.toThrow('Erro simulado')
  })

  it('aguarda a latência simulada antes de devolver os dados', async () => {
    vi.useFakeTimers()
    try {
      let completed = false
      const result = createWorkOrderMockScenario('slow').list().then(orders => { completed = true; return orders })
      await vi.advanceTimersByTimeAsync(1199)
      expect(completed).toBe(false)
      await vi.advanceTimersByTimeAsync(1)
      expect((await result).length).toBeGreaterThan(1)
    } finally {
      vi.useRealTimers()
    }
  })
})
