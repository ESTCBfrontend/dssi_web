import type { WorkOrderService } from '../../../features/work-orders/application/workOrderService'
import type { MockWorkOrderControls } from '../../../features/work-orders/infrastructure/mock/services/MockWorkOrderControls'
import type { MockWorkOrderService } from '../../../features/work-orders/infrastructure/mock/services/MockWorkOrderService'
import { createWorkOrderMockScenario } from '../../../features/work-orders/infrastructure/mock/scenarios/workOrderScenarios'
import type { WorkOrderMockScenario } from '../../../features/work-orders/infrastructure/mock/scenarios/workOrderScenarios'
import { logger } from '../../../shared/logging/logger'
import type { LogEvent } from '../../../shared/logging/logger'
import { MockInterventionService } from '../../../features/interventions/infrastructure/mock/services/MockInterventionService'
import type { InterventionService } from '../../../features/interventions/application/interventionService'

let operationSequence = 0

/** Só carrega os dados fictícios quando uma operação mock é efetivamente pedida. */
export function createLazyMockWorkOrderService(scenario: WorkOrderMockScenario): {
  service: WorkOrderService
  controls: MockWorkOrderControls
  interventions: MockInterventionService
  interventionService: InterventionService
  subscribeToInterventions: (listener: () => void) => () => void
  subscribe: (listener: () => void) => () => void
} {
  let instance: MockWorkOrderService | undefined
  const getInstance = () => instance ??= createWorkOrderMockScenario(scenario)
  const interventions = new MockInterventionService(id => getInstance().hasOrder(id))

  function record(operation: LogEvent['operation'], result: LogEvent['result'] = 'sucesso'): void {
    logger.log(result === 'erro' ? 'error' : 'info', { area: 'ordens-servico', operation, result, source: 'mock' })
  }
  function run<T>(operation: LogEvent['operation'], action: () => T): T {
    try {
      const result = action()
      if ((operation === 'limpar' || operation === 'repor') && typeof result === 'number') {
        logger.log('info', { area: 'ordens-servico', operation, result: 'sucesso', source: 'mock', count: result })
      } else record(operation, result === null ? 'existente' : 'sucesso')
      return result
    } catch (error) {
      record(operation, 'erro')
      throw error
    }
  }
  async function runAsync<T>(operation: LogEvent['operation'], action: () => Promise<T>): Promise<T> {
    const correlation = scenario === 'slow' ? ++operationSequence : undefined
    const started = correlation === undefined ? undefined : performance.now()
    if (correlation !== undefined) logger.log('info', { area: 'ordens-servico', operation, result: 'iniciada', source: 'mock', correlation })
    try {
      const result = await action()
      if (correlation === undefined) record(operation, (operation === 'consultar' || operation === 'editar' || operation === 'atribuir') && result === null ? 'inexistente' : 'sucesso')
      else logger.log('info', { area: 'ordens-servico', operation, result: (operation === 'consultar' || operation === 'editar' || operation === 'atribuir') && result === null ? 'inexistente' : 'sucesso', source: 'mock', correlation, durationMs: Math.round(performance.now() - started!) })
      return result
    } catch (error) {
      if (correlation === undefined) record(operation, 'erro')
      else logger.log('error', { area: 'ordens-servico', operation, result: 'erro', source: 'mock', correlation, durationMs: Math.round(performance.now() - started!) })
      throw error
    }
  }

  return {
    interventions,
    interventionService: { listByWorkOrder: id => interventions.listByWorkOrder(id) },
    subscribeToInterventions: listener => interventions.subscribe(listener),
    subscribe(listener) { return getInstance().subscribe(listener) },
    service: {
      async list() { return runAsync('listar', () => getInstance().list()) },
      async getById(id) { return runAsync('consultar', () => getInstance().getById(id)) },
      async create(input) { return runAsync('criar', () => getInstance().create(input)) },
      async update(id, input) { return runAsync('editar', () => getInstance().update(id, input)) },
      async listTechnicians() { return runAsync('listar-tecnicos', () => getInstance().listTechnicians()) },
      async assignTechnician(id, technicianId) { return runAsync('atribuir', () => getInstance().assignTechnician(id, technicianId)) },
    },
    controls: {
      listExamples() { return run('listar-exemplos', () => getInstance().listExamples()) },
      addExample(exampleId) { return run('adicionar-exemplo', () => getInstance().addExample(exampleId)) },
      addAllExamples() {
        try {
          const counts = getInstance().addAllExamples()
          logger.log(counts.failed ? 'warn' : 'info', { area: 'ordens-servico', operation: 'adicionar-todos', result: counts.failed ? 'parcial' : 'sucesso', source: 'mock', counts })
          return counts
        } catch (error) {
          record('adicionar-todos', 'erro')
          throw error
        }
      },
      clear() { return run('limpar', () => { const count = getInstance().clear(); interventions.clear(); return count }) },
      reset() { return run('repor', () => { const count = getInstance().reset(); interventions.clear(); return count }) },
    },
  }
}
