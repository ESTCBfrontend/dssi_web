import type { CreateWorkOrder, UpdateWorkOrder, WorkOrder, WorkOrderTechnician } from '../domain/workOrder'

/** Contrato local provisório: não define o formato dos pedidos ou respostas HTTP. */
export interface WorkOrderService {
  list(): Promise<WorkOrder[]>
  getById(id: string): Promise<WorkOrder | null>
  create(input: CreateWorkOrder): Promise<WorkOrder>
  update(id: string, input: UpdateWorkOrder): Promise<WorkOrder | null>
  listTechnicians(): Promise<WorkOrderTechnician[]>
  assignTechnician(id: string, technicianId: string): Promise<WorkOrder | null>
}
