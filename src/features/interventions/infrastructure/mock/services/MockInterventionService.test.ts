import { afterEach, describe, expect, it, vi } from 'vitest'
import { createLazyMockWorkOrderService } from '../../../../../app/work-orders/services/createLazyMockWorkOrderService'
import { logger } from '../../../../../shared/logging/logger'
import * as loader from '../loaders/loadMockInterventions'
import { parseMockInterventions } from '../parsers/parseMockInterventions'

afterEach(() => vi.restoreAllMocks())

describe('mocks de intervenções', () => {
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
})
