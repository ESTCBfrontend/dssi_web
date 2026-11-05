import { createContext, useContext } from 'react'
import type { WorkOrderService } from '../../../features/work-orders/application/workOrderService'
import type { WorkOrderMockScenario } from '../../../features/work-orders/infrastructure/mock/scenarios/workOrderScenarios'
import type { MockWorkOrderControls } from '../../../features/work-orders/infrastructure/mock/services/MockWorkOrderControls'
import type { MockInterventionService } from '../../../features/interventions/infrastructure/mock/services/MockInterventionService'

export type WorkOrderServices = {
  service: WorkOrderService | null
  status: 'ready' | 'unavailable'
  mockScenario: WorkOrderMockScenario
  mockVersion: number
  mockControls: MockWorkOrderControls | null
  interventionControls: MockInterventionService | null
  subscribeToWorkOrders: ((listener: () => void) => () => void) | null
  selectMockScenario: (scenario: WorkOrderMockScenario) => void
}

export const WorkOrderServiceContext = createContext<WorkOrderServices | null>(null)

export function useWorkOrderServices(): WorkOrderServices {
  const services = useContext(WorkOrderServiceContext)
  if (!services) throw new Error('Os serviços de ordens de serviço não foram configurados.')
  return services
}
