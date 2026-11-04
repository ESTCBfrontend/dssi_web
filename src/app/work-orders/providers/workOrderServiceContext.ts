import { createContext, useContext } from 'react'
import type { WorkOrderService } from '../../../features/work-orders/application/workOrderService'
import type { WorkOrderMockScenario } from '../../../features/work-orders/infrastructure/mock/scenarios/workOrderScenarios'
import type { MockWorkOrderControls } from '../../../features/work-orders/infrastructure/mock/services/MockWorkOrderControls'

export type WorkOrderServices = {
  service: WorkOrderService | null
  status: 'ready' | 'unavailable'
  mockScenario: WorkOrderMockScenario
  mockControls: MockWorkOrderControls | null
  selectMockScenario: (scenario: WorkOrderMockScenario) => void
}

export const WorkOrderServiceContext = createContext<WorkOrderServices | null>(null)

export function useWorkOrderServices(): WorkOrderServices {
  const services = useContext(WorkOrderServiceContext)
  if (!services) throw new Error('Os serviços de ordens de serviço não foram configurados.')
  return services
}
