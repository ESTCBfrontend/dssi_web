import type { WorkOrder } from '../../../domain/workOrder'

/** Operações de desenvolvimento sobre dados fictícios, separadas do contrato de negócio. */
export interface MockWorkOrderControls {
  listExamples(): WorkOrder[]
  addExample(exampleId: string): WorkOrder
  addAllExamples(): { added: number; total: number }
  clear(): number
  reset(): number
}
