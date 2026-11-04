import type { WorkOrderService } from '../../../application/workOrderService'
import type { CreateWorkOrder, WorkOrder } from '../../../domain/workOrder'
import { loadMockWorkOrders } from '../loaders/loadMockWorkOrders'
import type { MockWorkOrderControls } from './MockWorkOrderControls'
import { logger } from '../../../../../shared/logging/logger'

type MockBehavior = { delayMs?: number; failure?: boolean }

function copyOrder(order: WorkOrder): WorkOrder {
  return {
    ...order,
    client: { ...order.client },
    site: { ...order.site },
    assignedTechnician: order.assignedTechnician ? { ...order.assignedTechnician } : null,
  }
}

function validateInput(input: CreateWorkOrder): void {
  const required = [input.code, input.client.id, input.client.name, input.site.id, input.site.name, input.serviceType, input.description]
  if (required.some(value => !value.trim()) || (input.priority !== undefined && !input.priority.trim())) {
    throw new Error('Preenche os dados obrigatórios da ordem de serviço.')
  }
}

/** Serviço local em memória; cada instância mantém os seus próprios dados. */
export class MockWorkOrderService implements WorkOrderService, MockWorkOrderControls {
  private readonly orders: Map<string, WorkOrder>
  private readonly initialOrders: WorkOrder[]
  private readonly behavior: MockBehavior
  private nextId = 1
  private revision = 0

  constructor(initialOrders: readonly WorkOrder[] = loadMockWorkOrders(), behavior: MockBehavior = {}) {
    if (behavior.delayMs !== undefined && (!Number.isFinite(behavior.delayMs) || behavior.delayMs < 0)) {
      throw new Error('A latência fictícia deve ser um número não negativo.')
    }
    this.behavior = { ...behavior }
    this.initialOrders = initialOrders.map(copyOrder)
    this.orders = new Map(initialOrders.map(order => [order.id, copyOrder(order)]))
    if (this.orders.size !== initialOrders.length) {
      throw new Error('As ordens fictícias devem ter identificadores únicos.')
    }
  }

  private createId(): string {
    let id: string
    const reserved = new Set(this.listExamples().map(order => order.id))
    do {
      id = `mock-os-${this.nextId++}`
    } while (this.orders.has(id) || reserved.has(id))
    return id
  }

  listExamples(): WorkOrder[] {
    return loadMockWorkOrders().map(copyOrder)
  }

  hasOrder(id: string): boolean { return this.orders.has(id) }

  addExample(exampleId: string): WorkOrder | null {
    const example = this.listExamples().find(order => order.id === exampleId)
    if (!example) throw new Error('Exemplo de ordem fictícia não encontrado.')

    if (this.orders.has(example.id)) return null
    const order = copyOrder(example)
    this.orders.set(order.id, order)
    logger.mockExample('OS', order)
    return copyOrder(order)
  }

  addAllExamples(): { added: number; skipped: number; failed: number; total: number } {
    const examples = this.listExamples()
    let added = 0
    let skipped = 0
    let failed = 0
    for (const example of examples) {
      try {
        if (this.addExample(example.id)) added++
        else skipped++
      } catch {
        failed++
      }
    }
    return { added, skipped, failed, total: examples.length }
  }

  clear(): number {
    const count = this.orders.size
    this.revision++
    this.orders.clear()
    return count
  }

  reset(): number {
    this.clear()
    for (const order of this.initialOrders) this.orders.set(order.id, copyOrder(order))
    return this.orders.size
  }

  private async simulateResponse(): Promise<void> {
    if (this.behavior.delayMs) await new Promise<void>(resolve => setTimeout(resolve, this.behavior.delayMs))
    if (this.behavior.failure) throw new Error('Erro simulado no serviço de ordens de serviço.')
  }

  async list(): Promise<WorkOrder[]> {
    await this.simulateResponse()
    return Array.from(this.orders.values(), copyOrder)
  }

  async getById(id: string): Promise<WorkOrder | null> {
    await this.simulateResponse()
    const order = this.orders.get(id)
    return order ? copyOrder(order) : null
  }

  async create(input: CreateWorkOrder): Promise<WorkOrder> {
    const revision = this.revision
    await this.simulateResponse()
    if (revision !== this.revision) {
      throw new Error('A criação foi cancelada porque os dados fictícios foram alterados.')
    }
    validateInput(input)
    const id = this.createId()

    const order: WorkOrder = {
      id,
      code: input.code.trim(),
      client: { ...input.client },
      site: { ...input.site },
      serviceType: input.serviceType.trim(),
      description: input.description.trim(),
      status: 'NOVA',
      priority: input.priority?.trim() ?? 'NORMAL',
      scheduledDate: input.scheduledDate ?? null,
      assignedTechnician: null,
      instructions: input.instructions ?? null,
    }
    this.orders.set(id, order)
    return copyOrder(order)
  }
}
