import { afterEach, describe, expect, it, vi } from 'vitest'
import { createLazyMockWorkOrderService } from '../../../../../app/work-orders/services/createLazyMockWorkOrderService'
import { logger } from '../../../../../shared/logging/logger'
import * as loader from '../loaders/loadMockInterventions'
import { parseMockInterventions } from '../parsers/parseMockInterventions'

afterEach(() => vi.restoreAllMocks())

describe('mocks de intervenções', () => {
  it('analisa sem alterar os dados originais nem o estado da ordem e isola as cópias', async () => {
    const { interventions, interventionService, service } = createLazyMockWorkOrderService('normal')
    interventions.addAllExamples()
    const before = (await interventionService.listByWorkOrder('mock-os-4')).find(item => item.id === 'mock-intervencao-1')!
    const order = await service.getById('mock-os-4')
    const listener = vi.fn()
    interventions.subscribe(listener)
    const updated = await interventionService.review('mock-os-4', before.id, 'solicitar-correcao', '  Rever materiais  ')
    expect(updated).toEqual({ ...before, review: { status: 'CORRECAO_SOLICITADA', reason: 'Rever materiais' } })
    expect(await service.getById('mock-os-4')).toEqual(order)
    expect(listener).toHaveBeenCalledOnce()
    updated.review!.reason = 'Alterado'
    expect((await interventionService.listByWorkOrder('mock-os-4')).find(item => item.id === before.id)?.review?.reason).toBe('Rever materiais')
    await expect(interventionService.review('mock-os-4', before.id, 'validar')).rejects.toThrow()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('valida intervenções elegíveis e recusa motivo vazio, ordem errada e intervenção cancelada', async () => {
    const { interventions, interventionService } = createLazyMockWorkOrderService('normal')
    interventions.addAllExamples()
    await expect(interventionService.review('mock-os-4', 'mock-intervencao-1', 'solicitar-correcao', '  ')).rejects.toThrow('motivo')
    await expect(interventionService.review('mock-os-3', 'mock-intervencao-1', 'validar')).rejects.toThrow()
    await expect(interventionService.review('mock-os-4', 'mock-intervencao-2', 'validar')).rejects.toThrow()
    expect((await interventionService.review('mock-os-4', 'mock-intervencao-1', 'validar')).review).toEqual({ status: 'VALIDADA', reason: null })
    interventions.clear()
    interventions.addAllExamples()
    expect((await interventionService.listByWorkOrder('mock-os-4'))[0].review).toBeUndefined()
  })
  it('regista resultados e falhas sem expor dados dos exemplos', () => {
    const log = vi.spyOn(logger, 'log').mockImplementation(() => {})
    const { interventions } = createLazyMockWorkOrderService('empty')
    const example = interventions.listExamples()[0]
    expect(interventions.addExample(example.id)).toBe('missing-order')
    expect(log).toHaveBeenCalledWith('warn', expect.objectContaining({ area: 'intervencoes', operation: 'adicionar-exemplo', result: 'os-ausente', mockWorkOrderId: example.workOrderId }))
    const counts = interventions.addAllExamples()
    expect(log).toHaveBeenCalledWith('warn', expect.objectContaining({ area: 'intervencoes', operation: 'adicionar-todos', counts: expect.objectContaining({ missingOrder: counts.total }) }))
    vi.spyOn(loader, 'loadMockInterventions').mockImplementation(() => { throw new Error('dados privados') })
    expect(() => interventions.addAllExamples()).toThrow('dados privados')
    expect(log).toHaveBeenCalledWith('error', expect.objectContaining({ area: 'intervencoes', operation: 'adicionar-todos', result: 'erro' }))
    expect(JSON.stringify(log.mock.calls)).not.toContain('dados privados')
  })

  it('regista adição individual, duplicado e remoção', () => {
    const log = vi.spyOn(logger, 'log').mockImplementation(() => {})
    const body = vi.spyOn(logger, 'mockExample').mockImplementation(() => {})
    const { interventions } = createLazyMockWorkOrderService('normal')
    const example = interventions.listExamples()[0]
    expect(interventions.addExample(example.id)).toBe('added')
    expect(interventions.addExample(example.id)).toBe('existing')
    expect(interventions.clear()).toBe(1)
    expect(log).toHaveBeenCalledWith('info', expect.objectContaining({ area: 'intervencoes', operation: 'adicionar-exemplo', result: 'sucesso' }))
    expect(log).toHaveBeenCalledWith('info', expect.objectContaining({ area: 'intervencoes', operation: 'adicionar-exemplo', result: 'existente' }))
    expect(log).toHaveBeenCalledWith('info', expect.objectContaining({ area: 'intervencoes', operation: 'limpar', count: 1 }))
    expect(body).toHaveBeenCalledOnce()
    expect(body).toHaveBeenCalledWith('Intervenções', example)
  })
  it('rejeita JSON inválido, dados incompletos e identificadores repetidos', () => {
    expect(() => parseMockInterventions('{')).toThrow('JSON válido')
    expect(() => parseMockInterventions('{}')).toThrow('modelo provisório')
    const { interventions } = createLazyMockWorkOrderService('normal')
    const example = interventions.listExamples()[0]
    expect(() => parseMockInterventions(JSON.stringify([example, example]))).toThrow('IDs únicos')
  })

  it('adiciona apenas intervenções com OS existente e não repete exemplos', () => {
    const { controls, interventions } = createLazyMockWorkOrderService('empty')
    const examples = interventions.listExamples()
    expect(interventions.addAllExamples()).toEqual({ added: 0, existing: 0, missingOrder: examples.length, failed: 0, total: examples.length })
    controls.addExample('mock-os-4')
    const first = interventions.addAllExamples()
    expect(first.added).toBe(2)
    expect(first.missingOrder).toBe(1)
    const second = interventions.addAllExamples()
    expect(second.added).toBe(0)
    expect(second.existing).toBe(2)
    controls.addExample('mock-os-3')
    expect(interventions.addAllExamples().added).toBe(1)
    expect(interventions.list()).toHaveLength(3)
  })

  it('limpar ou repor OS elimina intervenções locais e não as recupera ao adicionar OS novamente', () => {
    const { controls, interventions } = createLazyMockWorkOrderService('normal')
    expect(interventions.addAllExamples().added).toBe(3)
    controls.clear()
    expect(interventions.list()).toEqual([])
    controls.addAllExamples()
    expect(interventions.list()).toEqual([])
    expect(interventions.addAllExamples().added).toBe(3)
    controls.reset()
    expect(interventions.list()).toEqual([])
  })

  it('devolve cópias independentes', () => {
    const { interventions } = createLazyMockWorkOrderService('normal')
    interventions.addAllExamples()
    const item = interventions.list()[0]
    const name = item.technician.name
    item.technician.name = 'Alterado'
    item.materials.push('Alterado')
    expect(interventions.list()[0].technician.name).toBe(name)
    expect(interventions.list()[0].materials).not.toContain('Alterado')
  })

  it('consulta apenas intervenções da OS e devolve cópias independentes', async () => {
    const { interventions, interventionService } = createLazyMockWorkOrderService('normal')
    interventions.addAllExamples()
    const items = await interventionService.listByWorkOrder('mock-os-4')
    expect(items).toHaveLength(2)
    expect(items.every(item => item.workOrderId === 'mock-os-4')).toBe(true)
    items[0].technician.name = 'Alterado'
    expect((await interventionService.listByWorkOrder('mock-os-4'))[0].technician.name).not.toBe('Alterado')
    expect(await interventionService.listByWorkOrder('não-existe')).toEqual([])
  })

  it('notifica apenas alterações efetivas e permite cancelar a subscrição', () => {
    const { interventions, subscribeToInterventions } = createLazyMockWorkOrderService('normal')
    const listener = vi.fn()
    const unsubscribe = subscribeToInterventions(listener)
    expect(interventions.addExample('mock-intervencao-1')).toBe('added')
    expect(interventions.addExample('mock-intervencao-1')).toBe('existing')
    expect(listener).toHaveBeenCalledTimes(1)
    interventions.clear()
    interventions.clear()
    expect(listener).toHaveBeenCalledTimes(2)
    unsubscribe()
    interventions.addExample('mock-intervencao-1')
    expect(listener).toHaveBeenCalledTimes(2)
  })
})
