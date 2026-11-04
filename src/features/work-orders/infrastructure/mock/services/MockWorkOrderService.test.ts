import { describe, expect, it, vi } from 'vitest'
import type { CreateWorkOrder } from '../../../domain/workOrder'
import { MockWorkOrderService } from './MockWorkOrderService'
import { logger } from '../../../../../shared/logging/logger'

function exampleInput(): CreateWorkOrder {
  return {
    code: 'OS-EXEMPLO-002',
    client: { id: 'client-1', name: 'Cliente fictício' },
    site: { id: 'site-1', name: 'Local fictício' },
    serviceType: 'Manutenção',
    description: 'Verificar equipamento.',
  }
}

describe('serviço mock de ordens de serviço', () => {
  it('cria uma ordem não atribuída com prioridade normal e permite listá-la e consultá-la', async () => {
    const service = new MockWorkOrderService()
    const original = await service.list()
    const created = await service.create(exampleInput())

    expect(created).toMatchObject({ status: 'NOVA', priority: 'NORMAL', scheduledDate: null, assignedTechnician: null })
    expect(original.some(order => order.id === created.id)).toBe(false)
    expect(await service.getById(created.id)).toEqual(created)
    expect(await service.list()).toContainEqual(created)
  })

  it('devolve uma lista vazia e null para uma ordem inexistente', async () => {
    const service = new MockWorkOrderService([])
    expect(await service.list()).toEqual([])
    expect(await service.getById('inexistente')).toBeNull()
  })

  it('não reutiliza os IDs dos exemplos ao criar uma OS num cenário vazio', async () => {
    const service = new MockWorkOrderService([])
    const exampleIds = new Set(service.listExamples().map(order => order.id))
    const created = await service.create(exampleInput())
    expect(exampleIds.has(created.id)).toBe(false)
  })

  it('rejeita campos obrigatórios em branco sem criar uma ordem', async () => {
    const service = new MockWorkOrderService([])
    await expect(service.create({ ...exampleInput(), description: '  ' })).rejects.toThrow()
    expect(await service.list()).toEqual([])
  })

  it.each([
    ['número', (input: CreateWorkOrder) => { input.code = ' ' }],
    ['cliente', (input: CreateWorkOrder) => { input.client.id = ' ' }],
    ['local', (input: CreateWorkOrder) => { input.site.id = ' ' }],
    ['tipo de serviço', (input: CreateWorkOrder) => { input.serviceType = ' ' }],
  ])('rejeita %s em branco', async (_field, invalidate) => {
    const input = exampleInput()
    invalidate(input)
    const service = new MockWorkOrderService([])
    await expect(service.create(input)).rejects.toThrow()
    expect(await service.list()).toEqual([])
  })

  it('protege os dados locais de alterações externas e mantém instâncias isoladas', async () => {
    const service = new MockWorkOrderService([])
    const otherService = new MockWorkOrderService([])
    const input = exampleInput()
    const created = await service.create(input)
    input.client.name = 'Alterado no formulário'
    created.site.name = 'Alterado no resultado'
    const stored = await service.getById(created.id)

    expect(stored?.client.name).toBe('Cliente fictício')
    expect(stored?.site.name).toBe('Local fictício')
    expect(await otherService.list()).toEqual([])
  })

  it('não repete exemplos existentes e permite adicioná-los após limpar', async () => {
    const service = new MockWorkOrderService()
    const initialCount = (await service.list()).length
    expect(service.addExample('mock-os-1')).toBeNull()
    expect(service.clear()).toBe(initialCount)
    const nova = service.addExample('mock-os-1')
    const atribuida = service.addExample('mock-os-2')
    expect([nova?.status, atribuida?.status]).toEqual(['NOVA', 'ATRIBUIDA'])
    expect(service.addExample('mock-os-1')).toBeNull()
    expect((await service.list())).toHaveLength(2)
    expect(service.clear()).toBe(2)
    expect(await service.list()).toEqual([])
    expect(service.reset()).toBe(initialCount)
    expect(await service.list()).toHaveLength(initialCount)
  })

  it('regista apenas o JSON fictício dos exemplos efetivamente adicionados', async () => {
    const log = vi.spyOn(logger, 'mockExample').mockImplementation(() => {})
    try {
      const service = new MockWorkOrderService([])
      const example = service.addExample('mock-os-1')
      expect(log).toHaveBeenCalledWith('OS', example)
      service.addExample('mock-os-1')
      expect(log).toHaveBeenCalledOnce()
      const remaining = service.addAllExamples().added
      expect(log).toHaveBeenCalledTimes(remaining + 1)
      await service.create(exampleInput())
      expect(log).toHaveBeenCalledTimes(remaining + 1)
    } finally { log.mockRestore() }
  })

  it('rejeita um exemplo inexistente sem alterar os dados', async () => {
    const service = new MockWorkOrderService([])
    expect(() => service.addExample('inexistente')).toThrow('não encontrado')
    expect(await service.list()).toEqual([])
  })

  it('adiciona todas as ordens disponíveis sem repetir identificadores ou números', async () => {
    const service = new MockWorkOrderService([])
    const examples = service.listExamples()
    expect(service.addAllExamples()).toEqual({ added: examples.length, skipped: 0, failed: 0, total: examples.length })
    expect(service.addAllExamples()).toEqual({ added: 0, skipped: examples.length, failed: 0, total: examples.length })
    const newExample = { ...examples[0], id: 'exemplo-novo', code: 'OS-NOVA-EXEMPLO' }
    vi.spyOn(service, 'listExamples').mockReturnValue([...examples, newExample])
    expect(service.addAllExamples()).toEqual({ added: 1, skipped: examples.length, failed: 0, total: examples.length + 1 })
    const orders = await service.list()
    expect(orders).toHaveLength(examples.length + 1)
    expect(new Set(orders.map(order => order.id)).size).toBe(orders.length)
    expect(new Set(orders.map(order => order.code)).size).toBe(orders.length)
    expect(new Set(orders.map(order => order.status))).toEqual(new Set(examples.map(order => order.status)))
  })

  it('comunica falhas parciais ao adicionar todos os exemplos', async () => {
    const service = new MockWorkOrderService([])
    const total = service.listExamples().length
    const add = service.addExample.bind(service)
    vi.spyOn(service, 'addExample').mockImplementation(id => {
      if (id === 'mock-os-1') throw new Error('Falha simulada')
      return add(id)
    })
    expect(service.addAllExamples()).toEqual({ added: total - 1, skipped: 0, failed: 1, total })
    expect(await service.list()).toHaveLength(total - 1)
  })

  it('não volta a criar uma ordem cuja gravação estava pendente quando os dados foram limpos', async () => {
    vi.useFakeTimers()
    try {
      const service = new MockWorkOrderService([], { delayMs: 1000 })
      const pending = service.create(exampleInput()).then(() => null, error => error)
      service.clear()
      await vi.advanceTimersByTimeAsync(1000)
      expect(await pending).toBeInstanceOf(Error)
      expect(service.clear()).toBe(0)
    } finally {
      vi.useRealTimers()
    }
  })
})
