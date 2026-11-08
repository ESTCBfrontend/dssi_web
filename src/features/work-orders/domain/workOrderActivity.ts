/** Eventos locais provisórios, sem autor ou valor de auditoria. */
export type WorkOrderActivity = {
  id: number
  workOrderId: string
  interventionId?: string
  action: 'criada' | 'editada' | 'atribuida' | 'intervencao-validada' | 'correcao-solicitada'
  timestamp: number
}
