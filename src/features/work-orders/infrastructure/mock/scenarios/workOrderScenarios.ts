import { MockWorkOrderService } from '../services/MockWorkOrderService'
import { loadMockWorkOrders } from '../loaders/loadMockWorkOrders'

export type WorkOrderMockScenario = 'normal' | 'empty' | 'error' | 'slow'

/** Cria uma instância independente para o cenário escolhido. */
export function createWorkOrderMockScenario(scenario: WorkOrderMockScenario): MockWorkOrderService {
  switch (scenario) {
    case 'normal':
      return new MockWorkOrderService()
    case 'empty':
      return new MockWorkOrderService([])
    case 'error':
      return new MockWorkOrderService([], { failure: true })
    case 'slow':
      return new MockWorkOrderService(loadMockWorkOrders(), { delayMs: 1200 })
    default:
      throw new Error(`Cenário fictício desconhecido: ${String(scenario)}`)
  }
}
