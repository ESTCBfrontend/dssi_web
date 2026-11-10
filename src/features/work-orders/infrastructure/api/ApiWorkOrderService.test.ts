import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiLogin, ApiWorkOrderService } from './ApiWorkOrderService'

const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } })
afterEach(() => vi.unstubAllGlobals())

describe('integração com a API de ordens', () => {
  it('autentica e lê todas as páginas com o token', async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(json({ accessToken: 'token-teste' }))
      .mockResolvedValueOnce(json({ items: [{ id: '1' }], totalPages: 2 }))
      .mockResolvedValueOnce(json({ items: [{ id: '2' }], totalPages: 2 }))
    vi.stubGlobal('fetch', fetcher)
    const token = await apiLogin('gestao@example.test', 'palavra-passe')
    const service = new ApiWorkOrderService(token, vi.fn())
    expect((await service.list()).map(order => order.id)).toEqual(['1', '2'])
    expect(String(fetcher.mock.calls[2][0])).toContain('page=1&size=100')
    expect((fetcher.mock.calls[1][1]!.headers as Headers).get('Authorization')).toBe('Bearer token-teste')
  })

  it('envia os campos aceites na criação e na atribuição', async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => json({ id: 'os' }, 201))
    vi.stubGlobal('fetch', fetcher)
    const service = new ApiWorkOrderService('token', vi.fn())
    await service.create({ code: 'ignorado', client: { id: 'cliente', name: 'Cliente' }, site: { id: 'local', name: 'Local' }, serviceType: 'MANUTENCAO', description: 'Revisão', priority: 'NORMAL' })
    expect(JSON.parse(String(fetcher.mock.calls[0][1]!.body))).toEqual({ clientId: 'cliente', siteId: 'local', serviceType: 'MANUTENCAO', description: 'Revisão', priority: 'NORMAL' })
    await service.assignTechnician('os', 'tecnico')
    expect(JSON.parse(String(fetcher.mock.calls[1][1]!.body))).toEqual({ technicianId: 'tecnico' })
    expect(String(fetcher.mock.calls[1][0])).toContain('/work-orders/os/assignments')
  })

  it('distingue ausência da ordem e rejeição da sessão', async () => {
    const unauthorized = vi.fn()
    const fetcher = vi.fn().mockResolvedValueOnce(json({}, 404)).mockResolvedValueOnce(json({}, 401))
    vi.stubGlobal('fetch', fetcher)
    const service = new ApiWorkOrderService('token', unauthorized)
    expect(await service.getById('inexistente')).toBeNull()
    await expect(service.list()).rejects.toBeInstanceOf(ApiError)
    expect(unauthorized).toHaveBeenCalledOnce()
  })
})
