import type { Intervention } from '../domain/intervention'

/** Contrato local provisório; não define o formato HTTP do Backend. */
export interface InterventionService {
  listByWorkOrder(workOrderId: string): Promise<Intervention[]>
  review(workOrderId: string, interventionId: string, decision: 'validar' | 'solicitar-correcao', reason?: string): Promise<Intervention>
}
