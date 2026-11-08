import type { WorkOrderActivity } from '../domain/workOrderActivity'

/** Contrato de consulta local; não representa o contrato de auditoria do Backend. */
export interface WorkOrderActivityService {
  listByWorkOrder(workOrderId: string): Promise<WorkOrderActivity[]>
}
