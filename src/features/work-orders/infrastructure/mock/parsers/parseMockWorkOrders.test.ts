import { describe, expect, it } from 'vitest'
import orderJson from '../../../../../mocks/work-orders/json_mock_workorder_nova.json?raw'
import { loadMockWorkOrders } from '../loaders/loadMockWorkOrders'
import { parseMockWorkOrders } from './parseMockWorkOrders'

describe('dados JSON fictícios de ordens de serviço', () => {
  it('interpreta os exemplos e contém ordens em diferentes estados', () => {
    const orders = loadMockWorkOrders()
    expect(orders.map(order => order.status)).toEqual(expect.arrayContaining([
      'NOVA', 'ATRIBUIDA', 'EM_EXECUCAO', 'CONCLUIDA_TECNICAMENTE', 'VALIDADA', 'PENDENTE', 'CANCELADA',
    ]))
    expect(orders.find(order => order.status === 'ATRIBUIDA')?.assignedTechnician?.id).toBe('mock-tech-1')
  })

  it('rejeita texto JSON inválido e dados incompatíveis', () => {
    expect(() => parseMockWorkOrders('{')).toThrow('JSON válido')
    expect(() => parseMockWorkOrders('{}')).toThrow('modelo provisório')
    expect(() => parseMockWorkOrders('[{"id":"1"}]')).toThrow('modelo provisório')
  })

  it('rejeita identificadores repetidos', () => {
    const first = parseMockWorkOrders(orderJson)[0]
    expect(() => parseMockWorkOrders(JSON.stringify([first, first]))).toThrow('identificadores únicos')
  })
})
