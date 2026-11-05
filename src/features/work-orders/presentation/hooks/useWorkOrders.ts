import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useDataSource } from '../../../../app/data-source/dataSourceContext'
import { useWorkOrderServices } from '../../../../app/work-orders/providers/workOrderServiceContext'

export function useWorkOrders() {
  const { source } = useDataSource()
  const { service, mockScenario, mockVersion, subscribeToWorkOrders } = useWorkOrderServices()
  const client = useQueryClient()
  const queryKey = useMemo(() => ['work-orders', 'list', source, ...(source === 'mock' ? [mockScenario, mockVersion] : [])], [source, mockScenario, mockVersion])
  const query = useQuery({
    queryKey,
    queryFn: () => service!.list(),
    enabled: service !== null,
    retry: false,
    networkMode: source === 'mock' ? 'always' : 'online',
  })

  useEffect(() => {
    let active = true
    let scheduled = false
    const unsubscribe = subscribeToWorkOrders?.(() => {
      if (scheduled) return
      scheduled = true
      queueMicrotask(() => {
        scheduled = false
        if (active) void client.invalidateQueries({ queryKey, exact: true })
      })
    })
    return () => { active = false; unsubscribe?.() }
  }, [client, queryKey, subscribeToWorkOrders])

  const available = service !== null
  return {
    orders: available && !query.isError && !query.isFetching ? query.data ?? [] : [],
    loading: available && query.isFetching,
    error: !available ? 'A ligação à API de ordens de serviço ainda não está disponível.' : query.isError && !query.isFetching ? 'Não foi possível carregar as ordens de serviço.' : null,
    reload: () => { void query.refetch() },
    available,
  }
}
