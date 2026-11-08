import type { Intervention } from '../../../domain/intervention'
import { loadMockInterventions } from '../loaders/loadMockInterventions'
import { logger } from '../../../../../shared/logging/logger'

function copy(item: Intervention): Intervention {
  return { ...item, technician: { ...item.technician }, materials: [...item.materials], ...(item.review ? { review: { ...item.review } } : {}) }
}

/** Estado fictício local; a existência da OS é verificada pelo serviço associado. */
export class MockInterventionService {
  private readonly items = new Map<string, Intervention>()
  private readonly listeners = new Set<() => void>()
  private readonly hasWorkOrder: (id: string) => boolean
  private readonly onClear?: () => void
  constructor(hasWorkOrder: (id: string) => boolean, onClear?: () => void) { this.hasWorkOrder = hasWorkOrder; this.onClear = onClear }

  list(): Intervention[] {
    const items = Array.from(this.items.values(), copy)
    logger.log('info', { area: 'intervencoes', operation: 'listar', result: 'sucesso', source: 'mock', count: items.length })
    return items
  }

  async listByWorkOrder(workOrderId: string): Promise<Intervention[]> {
    return this.list().filter(item => item.workOrderId === workOrderId)
  }

  async review(workOrderId: string, interventionId: string, decision: 'validar' | 'solicitar-correcao', reason = ''): Promise<Intervention> {
    const item = this.items.get(interventionId)
    if (!item || item.workOrderId !== workOrderId || !this.hasWorkOrder(workOrderId)) throw new Error('Intervenção indisponível.')
    if (!['CONCLUIDA', 'PENDENTE'].includes(item.status) || item.review) throw new Error('Esta intervenção não pode ser analisada.')
    if (decision !== 'validar' && decision !== 'solicitar-correcao') throw new Error('Decisão inválida.')
    if (decision === 'solicitar-correcao' && !reason.trim()) throw new Error('Indique o motivo da correção.')
    const updated: Intervention = { ...item, review: { status: decision === 'validar' ? 'VALIDADA' : 'CORRECAO_SOLICITADA', reason: decision === 'validar' ? null : reason.trim() } }
    this.items.set(item.id, updated)
    this.notify()
    return copy(updated)
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private notify(): void { for (const listener of this.listeners) listener() }
  listExamples(): Intervention[] {
    try {
      const examples = loadMockInterventions().map(copy)
      logger.log('info', { area: 'intervencoes', operation: 'listar-exemplos', result: 'sucesso', source: 'mock' })
      return examples
    } catch (error) {
      logger.log('error', { area: 'intervencoes', operation: 'listar-exemplos', result: 'erro', source: 'mock' })
      throw error
    }
  }

  private insert(item: Intervention): 'added' | 'existing' | 'missing-order' {
    if (this.items.has(item.id)) return 'existing'
    if (!this.hasWorkOrder(item.workOrderId)) return 'missing-order'
    this.items.set(item.id, copy(item))
    logger.mockExample('Intervenções', item)
    this.notify()
    return 'added'
  }

  addExample(id: string): 'added' | 'existing' | 'missing-order' {
    try {
      const item = this.listExamples().find(example => example.id === id)
      if (!item) throw new Error('Exemplo de intervenção fictícia não encontrado.')
      const result = this.insert(item)
      logger.log(result === 'missing-order' ? 'warn' : 'info', { area: 'intervencoes', operation: 'adicionar-exemplo', result: result === 'added' ? 'sucesso' : result === 'existing' ? 'existente' : 'os-ausente', source: 'mock', ...(result === 'missing-order' ? { mockWorkOrderId: item.workOrderId } : {}) })
      return result
    } catch (error) {
      logger.log('error', { area: 'intervencoes', operation: 'adicionar-exemplo', result: 'erro', source: 'mock' })
      throw error
    }
  }

  addAllExamples(): { added: number; existing: number; missingOrder: number; failed: number; total: number } {
    let examples: Intervention[]
    try { examples = this.listExamples() }
    catch (error) {
      logger.log('error', { area: 'intervencoes', operation: 'adicionar-todos', result: 'erro', source: 'mock' })
      throw error
    }
    let added = 0, existing = 0, missingOrder = 0, failed = 0
    for (const item of examples) {
      try {
        const result = this.insert(item)
        if (result === 'added') added++
        else if (result === 'existing') existing++
        else missingOrder++
      } catch { failed++ }
    }
    const total = examples.length
    logger.log(failed || missingOrder ? 'warn' : 'info', { area: 'intervencoes', operation: 'adicionar-todos', result: failed || missingOrder ? 'parcial' : 'sucesso', source: 'mock', counts: { added, skipped: existing, missingOrder, failed, total } })
    return { added, existing, missingOrder, failed, total }
  }

  clear(): number {
    const count = this.items.size
    this.items.clear()
    this.onClear?.()
    if (count) this.notify()
    logger.log('info', { area: 'intervencoes', operation: 'limpar', result: 'sucesso', source: 'mock', count })
    return count
  }
}
