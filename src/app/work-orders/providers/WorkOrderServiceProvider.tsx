import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { WorkOrderMockScenario } from '../../../features/work-orders/infrastructure/mock/scenarios/workOrderScenarios'
import { useDataSource } from '../../data-source/dataSourceContext'
import { WorkOrderServiceContext } from './workOrderServiceContext'
import type { WorkOrderServices } from './workOrderServiceContext'
import { createLazyMockWorkOrderService } from '../services/createLazyMockWorkOrderService'

export function WorkOrderServiceProvider({ children }: { children: ReactNode }) {
  const { source, canSelect } = useDataSource()
  const [mock, setMock] = useState<{ scenario: WorkOrderMockScenario; version: number; instance: ReturnType<typeof createLazyMockWorkOrderService> }>(() => ({
    scenario: 'normal',
    version: 0,
    instance: createLazyMockWorkOrderService('normal'),
  }))

  // A API ainda não tem adaptador acordado; null indica explicitamente que está indisponível.
  const service = source === 'mock' ? mock.instance.service : null
  const mockExamples = source === 'mock' ? mock.instance.controls.listExamples : null
  const mockControls = source === 'mock' && canSelect ? mock.instance.controls : null
  const interventionControls = source === 'mock' && canSelect ? mock.instance.interventions : null
  const interventionService = source === 'mock' ? mock.instance.interventionService : null
  const subscribeToInterventions = source === 'mock' ? mock.instance.subscribeToInterventions : null
  const subscribeToWorkOrders = source === 'mock' ? mock.instance.subscribe : null
  const status: WorkOrderServices['status'] = source === 'api' ? 'unavailable' : 'ready'

  const selectMockScenario = useCallback((scenario: WorkOrderMockScenario) => {
    if (source !== 'mock' || !canSelect) {
      throw new Error('A seleção de cenários mock não está disponível.')
    }
    setMock(current => current.scenario === scenario ? current : {
      scenario,
      version: current.version + 1,
      instance: createLazyMockWorkOrderService(scenario),
    })
  }, [source, canSelect])

  const value = useMemo(
    () => ({ service, mockExamples, status, mockScenario: mock.scenario, mockVersion: mock.version, mockControls, interventionControls, interventionService, subscribeToInterventions, subscribeToWorkOrders, selectMockScenario }),
    [service, mockExamples, status, mock.scenario, mock.version, mockControls, interventionControls, interventionService, subscribeToInterventions, subscribeToWorkOrders, selectMockScenario],
  )

  return <WorkOrderServiceContext.Provider value={value}>{children}</WorkOrderServiceContext.Provider>
}
