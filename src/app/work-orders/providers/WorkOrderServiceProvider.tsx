import { useCallback, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { WorkOrderMockScenario } from '../../../features/work-orders/infrastructure/mock/scenarios/workOrderScenarios'
import { useDataSource } from '../../data-source/dataSourceContext'
import { WorkOrderServiceContext } from './workOrderServiceContext'
import type { WorkOrderServices } from './workOrderServiceContext'
import { createLazyMockWorkOrderService } from '../services/createLazyMockWorkOrderService'
import { apiLogin, ApiWorkOrderService } from '../../../features/work-orders/infrastructure/api/ApiWorkOrderService'

export function WorkOrderServiceProvider({ children }: { children: ReactNode }) {
  const { source, canSelect } = useDataSource()
  const [token, setToken] = useState<string | null>(null)
  const logout = useCallback(() => setToken(null), [])
  const login = useCallback(async (email: string, password: string) => { setToken(await apiLogin(email, password)) }, [])
  const loginWithPreviewAccount = useCallback(async (id: string) => {
    if (source !== 'api' || !canSelect) throw new Error('Contas de teste indisponíveis.')
    const response = await fetch('/api/debug-test-accounts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }), cache: 'no-store',
    })
    if (!response.ok) throw new Error('Não foi possível iniciar sessão.')
    const result: { accessToken?: unknown } = await response.json()
    if (typeof result.accessToken !== 'string' || result.accessToken.length === 0) throw new Error('Resposta de autenticação inválida.')
    setToken(result.accessToken)
  }, [source, canSelect])
  const apiService = useMemo(() => token ? new ApiWorkOrderService(token, () => setToken(current => current === token ? null : current)) : null, [token])
  const [mock, setMock] = useState<{ scenario: WorkOrderMockScenario; version: number; instance: ReturnType<typeof createLazyMockWorkOrderService> }>(() => ({
    scenario: 'normal',
    version: 0,
    instance: createLazyMockWorkOrderService('normal'),
  }))

  const service = source === 'mock' ? mock.instance.service : apiService
  const mockExamples = source === 'mock' ? mock.instance.controls.listExamples : null
  const mockControls = source === 'mock' && canSelect ? mock.instance.controls : null
  const interventionControls = source === 'mock' && canSelect ? mock.instance.interventions : null
  const interventionService = source === 'mock' ? mock.instance.interventionService : null
  const subscribeToInterventions = source === 'mock' ? mock.instance.subscribeToInterventions : null
  const subscribeToWorkOrders = source === 'mock' ? mock.instance.subscribe : null
  const activityService = source === 'mock' ? mock.instance.activityService : null
  const subscribeToActivity = source === 'mock' ? mock.instance.subscribeToActivity : null
  const status: WorkOrderServices['status'] = service ? 'ready' : 'unavailable'

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
    () => ({ service, apiService: source === 'api' ? apiService : null, login, loginWithPreviewAccount, logout, mockExamples, status, mockScenario: mock.scenario, mockVersion: mock.version, mockControls, interventionControls, interventionService, subscribeToInterventions, subscribeToWorkOrders, activityService, subscribeToActivity, selectMockScenario }),
    [source, apiService, login, loginWithPreviewAccount, logout, service, mockExamples, status, mock.scenario, mock.version, mockControls, interventionControls, interventionService, subscribeToInterventions, subscribeToWorkOrders, activityService, subscribeToActivity, selectMockScenario],
  )

  return <WorkOrderServiceContext.Provider value={value}>{children}</WorkOrderServiceContext.Provider>
}
