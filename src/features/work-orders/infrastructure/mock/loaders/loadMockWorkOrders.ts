import type { WorkOrder } from '../../../domain/workOrder'
import { parseMockWorkOrders } from '../parsers/parseMockWorkOrders'

// Vite inclui os exemplos JSON da funcionalidade como texto, sem executar o conteúdo.
const jsonFiles = import.meta.glob<string>('/src/mocks/work-orders/*.json', { eager: true, query: '?raw', import: 'default' })

export function loadMockWorkOrders(): WorkOrder[] {
  const orders = Object.keys(jsonFiles).sort().flatMap(path => {
    try {
      return parseMockWorkOrders(jsonFiles[path])
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Erro desconhecido.'
      throw new Error(`Erro nos dados fictícios ${path}: ${reason}`)
    }
  })
  if (new Set(orders.map(order => order.id)).size !== orders.length) {
    throw new Error('As ordens fictícias devem ter identificadores únicos entre ficheiros.')
  }
  return orders
}
