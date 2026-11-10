import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataSource } from '../../../../../../app/data-source/dataSourceContext'
import { useWorkOrderServices } from '../../../../../../app/work-orders/providers/workOrderServiceContext'

export function useWorkOrderActivity(id: string, enabled: boolean) {
  const { source } = useDataSource()
  const { activityService, subscribeToActivity, mockScenario, mockVersion } = useWorkOrderServices()
  const client = useQueryClient()
  const queryKey = useMemo(() => ['work-orders', 'activity', source, ...(source === 'mock' ? [mockScenario, mockVersion] : []), id], [source, mockScenario, mockVersion, id])
  const query = useQuery({
    queryKey,
    queryFn: () => activityService!.listByWorkOrder(id),
    enabled: enabled && activityService !== null && !!id,
    retry: false,
    networkMode: source === 'mock' ? 'always' : 'online',
  })
  useEffect(() => {
    if (!enabled) return
    let active = true
    const unsubscribe = subscribeToActivity?.(() => {
      queueMicrotask(() => { if (active) void client.invalidateQueries({ queryKey, exact: true }) })
    })
    return () => { active = false; unsubscribe?.() }
  }, [client, queryKey, subscribeToActivity, enabled])
  return {
    events: query.isError ? [] : query.data ?? [],
    loading: query.isFetching,
    error: activityService === null ? 'O histórico ainda não está disponível nesta origem.' : query.isError ? 'Não foi possível carregar o histórico.' : null,
    reload: () => { void query.refetch() },
  }
}
