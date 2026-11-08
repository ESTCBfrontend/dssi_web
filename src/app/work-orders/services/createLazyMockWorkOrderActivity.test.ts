import { describe, expect, it, vi } from 'vitest'
import { createLazyMockWorkOrderService } from './createLazyMockWorkOrderService'

const input = {
  code: 'OS-TESTE',
  client: { id: 'cliente', name: 'Cliente fictício' },
  site: { id: 'local', name: 'Local fictício' },
  serviceType: 'Manutenção',
  description: 'Verificar equipamento.',
}

describe('histórico fictício das ordens', () => {
  it('regista operações efetuadas, ordena e isola por ordem e instância', async () => {
    const { service, activityService, subscribeToActivity } = createLazyMockWorkOrderService('normal')
    const changes = vi.fn()
    const unsubscribe = subscribeToActivity(changes)
    const order = await service.create(input)
    await service.update(order.id, { serviceType: 'Reparação', description: 'Atualizada', priority: 'NORMAL', scheduledDate: null, instructions: null })
    const [technician] = await service.listTechnicians()
    await service.assignTechnician(order.id, technician.id)
    const events = await activityService.listByWorkOrder(order.id)
    expect(events.map(event => event.action)).toEqual(['atribuida', 'editada', 'criada'])
    expect(events.every(event => event.workOrderId === order.id && Number.isFinite(event.timestamp))).toBe(true)
    expect(await activityService.listByWorkOrder('mock-os-1')).toEqual([])
    expect(await createLazyMockWorkOrderService('normal').activityService.listByWorkOrder(order.id)).toEqual([])
    events[0].action = 'criada'
    expect((await activityService.listByWorkOrder(order.id))[0].action).toBe('atribuida')
    expect(changes).toHaveBeenCalledTimes(3)
    unsubscribe()
  })

  it('regista análises reais da sessão, não falhas, e limpa os dados associados', async () => {
    const { service, controls, interventions, interventionService, activityService } = createLazyMockWorkOrderService('normal')
    interventions.addAllExamples()
    await expect(interventionService.review('mock-os-4', 'mock-intervencao-1', 'solicitar-correcao', ' ')).rejects.toThrow()
    await expect(service.assignTechnician('mock-os-1', 'inexistente')).rejects.toThrow()
    expect(await activityService.listByWorkOrder('mock-os-4')).toEqual([])
    expect(await activityService.listByWorkOrder('mock-os-1')).toEqual([])
    await interventionService.review('mock-os-4', 'mock-intervencao-1', 'solicitar-correcao', 'Completar')
    await interventionService.review('mock-os-3', 'mock-intervencao-3', 'validar')
    expect((await activityService.listByWorkOrder('mock-os-4')).map(event => event.action)).toEqual(['correcao-solicitada'])
    expect((await activityService.listByWorkOrder('mock-os-3')).map(event => event.action)).toEqual(['intervencao-validada'])
    const [technician] = await service.listTechnicians()
    await service.assignTechnician('mock-os-1', technician.id)
    interventions.clear()
    expect(await activityService.listByWorkOrder('mock-os-4')).toEqual([])
    expect((await activityService.listByWorkOrder('mock-os-1')).map(event => event.action)).toEqual(['atribuida'])
    controls.reset()
    expect(await activityService.listByWorkOrder('mock-os-1')).toEqual([])
    await service.assignTechnician('mock-os-1', technician.id)
    controls.clear()
    controls.addExample('mock-os-1')
    expect(await activityService.listByWorkOrder('mock-os-1')).toEqual([])
  })

  it('não regista sucesso de operações pendentes quando os dados são repostos', async () => {
    vi.useFakeTimers()
    try {
      const { service, controls, activityService } = createLazyMockWorkOrderService('slow')
      const pending = service.create(input).then(() => null, error => error)
      controls.reset()
      await vi.advanceTimersByTimeAsync(1200)
      expect(await pending).toBeInstanceOf(Error)
      expect(await activityService.listByWorkOrder('mock-os-1')).toEqual([])
    } finally { vi.useRealTimers() }
  })
})
