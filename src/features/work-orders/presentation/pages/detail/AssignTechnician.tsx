import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useDataSource } from '../../../../../app/data-source/dataSourceContext'
import { useWorkOrderServices } from '../../../../../app/work-orders/providers/workOrderServiceContext'
import { Alert } from '../../../../../shared/ui/Alert'
import { Button } from '../../../../../shared/ui/Button'
import { UserSelector } from '../../../../../shared/ui/UserSelector'
import type { WorkOrder } from '../../../domain/workOrder'
import styles from './WorkOrderDetailPage.module.css'

export function AssignTechnician({ order, onAssigned }: { order: WorkOrder; onAssigned: () => void }) {
  const { source } = useDataSource()
  const { service, mockScenario, mockVersion } = useWorkOrderServices()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const eligible = source === 'mock' && !!service && order.status === 'NOVA' && !order.assignedTechnician
  const technicians = useQuery({
    queryKey: ['work-orders', 'technicians', source, mockScenario, mockVersion],
    queryFn: () => service!.listTechnicians(),
    enabled: open && eligible,
    retry: false,
    networkMode: 'always',
  })
  const assignment = useMutation({
    mutationFn: async (technicianId: string) => {
      if (!service || source !== 'mock') throw new Error('Serviço indisponível.')
      const result = await service.assignTechnician(order.id, technicianId)
      if (!result) throw new Error('Ordem inexistente.')
      return result
    },
    onSuccess: () => { setOpen(false); onAssigned() },
  })

  return <div className={styles.assignment}>
    <Button size="small" disabled={!eligible || assignment.isPending} onClick={() => { setSelected(null); assignment.reset(); setOpen(true) }}>Gerir atribuição</Button>
    {open && eligible && <section className={styles.assignmentForm} aria-label="Atribuir técnico">
      <UserSelector users={technicians.data ?? []} value={selected} onChange={setSelected}
        searchable={false} loading={technicians.isFetching} disabled={assignment.isPending}
        loadError={technicians.isError ? 'Não foi possível carregar os técnicos.' : undefined}
        onRetry={() => { void technicians.refetch() }} emptyLabel="Não existem técnicos disponíveis." />
      {!technicians.isFetching && !technicians.isError && technicians.data?.length === 0 && <p role="status">Não existem técnicos disponíveis.</p>}
      {assignment.isError && <Alert tone="danger" layout="detailed" title="Não foi possível atribuir o técnico" message="Verifica os dados e tenta novamente." announcement="assertive" />}
      <div className={styles.actions}>
        <Button size="small" variant="outline" disabled={assignment.isPending} onClick={() => { setOpen(false); setSelected(null); assignment.reset() }}>Cancelar</Button>
        <Button size="small" loading={assignment.isPending} loadingLabel="A atribuir..." disabled={!selected || technicians.isFetching || technicians.isError} onClick={() => { if (selected) assignment.mutate(selected) }}>Confirmar atribuição</Button>
      </div>
    </section>}
  </div>
}
