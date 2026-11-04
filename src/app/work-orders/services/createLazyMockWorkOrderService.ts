import type { WorkOrderService } from '../../../features/work-orders/application/workOrderService'
import type { MockWorkOrderControls } from '../../../features/work-orders/infrastructure/mock/services/MockWorkOrderControls'
import type { MockWorkOrderService } from '../../../features/work-orders/infrastructure/mock/services/MockWorkOrderService'
import { createWorkOrderMockScenario } from '../../../features/work-orders/infrastructure/mock/scenarios/workOrderScenarios'
import type { WorkOrderMockScenario } from '../../../features/work-orders/infrastructure/mock/scenarios/workOrderScenarios'

/** Só carrega os dados fictícios quando uma operação mock é efetivamente pedida. */
export function createLazyMockWorkOrderService(scenario: WorkOrderMockScenario): {
  service: WorkOrderService
  controls: MockWorkOrderControls
} {
  let instance: MockWorkOrderService | undefined
  const getInstance = () => instance ??= createWorkOrderMockScenario(scenario)

  return {
    service: {
      async list() { return getInstance().list() },
      async getById(id) { return getInstance().getById(id) },
      async create(input) { return getInstance().create(input) },
    },
    controls: {
      listExamples() { return getInstance().listExamples() },
      addExample(exampleId) { return getInstance().addExample(exampleId) },
      addAllExamples() { return getInstance().addAllExamples() },
      clear() { return getInstance().clear() },
      reset() { return getInstance().reset() },
    },
  }
}
