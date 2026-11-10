import type { WorkOrderService } from '../../application/workOrderService'
import type { CreateWorkOrder, WorkOrder, WorkOrderClient, WorkOrderSite, WorkOrderTechnician } from '../../domain/workOrder'
import { loggedFetch } from '../../../../shared/http/loggedFetch'

const defaultUrl = 'https://alarmeon-backend-962ded164ecf.herokuapp.com/api/v1'
export const apiBaseUrl = (import.meta.env.VITE_API_URL || defaultUrl).replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number
  constructor(status: number) { super(`Pedido falhou (HTTP ${status}).`); this.status = status }
}

export async function apiLogin(email: string, password: string): Promise<string> {
  const response = await loggedFetch('/auth/login', `${apiBaseUrl}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
  })
  if (!response.ok) throw new ApiError(response.status)
  const result: { accessToken: string } = await response.json()
  if (!result.accessToken) throw new Error('Resposta de autenticação inválida.')
  return result.accessToken
}

export class ApiWorkOrderService implements WorkOrderService {
  private readonly token: string
  private readonly onUnauthorized: () => void
  constructor(token: string, onUnauthorized: () => void) { this.token = token; this.onUnauthorized = onUnauthorized }

  private async request<T>(route: string, path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers)
    headers.set('Authorization', `Bearer ${this.token}`)
    if (init.body) headers.set('Content-Type', 'application/json')
    const response = await loggedFetch(route, `${apiBaseUrl}${path}`, { ...init, headers })
    if (response.status === 401) this.onUnauthorized()
    if (!response.ok) throw new ApiError(response.status)
    return response.json() as Promise<T>
  }

  async list(): Promise<WorkOrder[]> {
    const orders: WorkOrder[] = []
    let page = 0
    let totalPages: number
    do {
      const result = await this.request<{ items: WorkOrder[]; totalPages: number }>('/work-orders', `/work-orders?page=${page}&size=100`)
      orders.push(...result.items)
      totalPages = result.totalPages
      page++
    } while (page < totalPages)
    return orders
  }

  async getById(id: string): Promise<WorkOrder | null> {
    try { return await this.request('/work-orders/{id}', `/work-orders/${encodeURIComponent(id)}`) }
    catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error }
  }

  create(input: CreateWorkOrder): Promise<WorkOrder> {
    return this.request('/work-orders', '/work-orders', { method: 'POST', body: JSON.stringify({
      clientId: input.client.id, siteId: input.site.id, serviceType: input.serviceType,
      description: input.description, priority: input.priority, scheduledDate: input.scheduledDate, instructions: input.instructions,
    }) })
  }

  async update(): Promise<never> { throw new Error('A edição ainda não está disponível na API.') }
  listTechnicians(): Promise<WorkOrderTechnician[]> { return this.request('/technicians', '/technicians') }
  listClients(): Promise<WorkOrderClient[]> { return this.request('/clients', '/clients') }
  listSites(clientId: string): Promise<WorkOrderSite[]> { return this.request('/clients/{id}/sites', `/clients/${encodeURIComponent(clientId)}/sites`) }
  async assignTechnician(id: string, technicianId: string): Promise<WorkOrder> {
    return this.request('/work-orders/{id}/assignments', `/work-orders/${encodeURIComponent(id)}/assignments`, { method: 'POST', body: JSON.stringify({ technicianId }) })
  }
}
