import type { WorkOrderActivityService } from '../../../application/workOrderActivityService'
import type { WorkOrderActivity } from '../../../domain/workOrderActivity'

export class MockWorkOrderActivityService implements WorkOrderActivityService {
  private events: WorkOrderActivity[] = []
  private sequence = 0
  private readonly listeners = new Set<() => void>()

  async listByWorkOrder(workOrderId: string): Promise<WorkOrderActivity[]> {
    return this.events.filter(event => event.workOrderId === workOrderId).sort((a, b) => b.timestamp - a.timestamp || b.id - a.id).map(event => ({ ...event }))
  }

  record(workOrderId: string, action: WorkOrderActivity['action'], interventionId?: string): void {
    this.events.push({ id: ++this.sequence, workOrderId, action, timestamp: Date.now(), ...(interventionId ? { interventionId } : {}) })
    this.notify()
  }

  clear(): void {
    if (!this.events.length) return
    this.events = []
    this.notify()
  }

  clearInterventions(): void {
    const remaining = this.events.filter(event => !event.interventionId)
    if (remaining.length === this.events.length) return
    this.events = remaining
    this.notify()
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  private notify(): void { for (const listener of this.listeners) listener() }
}
