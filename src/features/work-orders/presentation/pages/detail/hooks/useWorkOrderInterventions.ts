import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataSource } from '../../../../../../app/data-source/dataSourceContext'
import { useWorkOrderServices } from '../../../../../../app/work-orders/providers/workOrderServiceContext'

export function useWorkOrderInterventions(workOrderId: string, enabled: boolean) {
  const { source } = useDataSource()
  const { interventionService, subscribeToInterventions, mockScenario, mockVersion } = useWorkOrderServices()
  const client = useQueryClient()
  const queryKey = useMemo(() => ['interventions', 'work-order', source, ...(source === 'mock' ? [mockScenario, mockVersion] : []), workOrderId], [source, mockScenario, mockVersion, workOrderId])
  const query = useQuery({
    queryKey,
    queryFn: () => interventionService!.listByWorkOrder(workOrderId),
    enabled: enabled && interventionService !== null && !!workOrderId,
    retry: false,
    networkMode: source === 'mock' ? 'always' : 'online',
  })

  useEffect(() => {
    if (!enabled) return
    let active = true
    let scheduled = false
    const unsubscribe = subscribeToInterventions?.(() => {
      if (scheduled) return
      scheduled = true
      queueMicrotask(() => {
        scheduled = false
        if (active) void client.invalidateQueries({ queryKey, exact: true })
      })
    })
    return () => { active = false; unsubscribe?.() }
  }, [client, queryKey, subscribeToInterventions, enabled])

  return {
    interventions: !query.isError && !query.isFetching ? query.data ?? [] : [],
    loading: query.isFetching,
    error: interventionService === null ? 'A consulta de intervenções ainda não está disponível.' : query.isError && !query.isFetching ? 'Não foi possível carregar as intervenções.' : null,
    reload: () => { void query.refetch() },
  }
}
