import { afterEach, describe, expect, it, vi } from 'vitest'
import { loggedFetch } from './loggedFetch'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs() })

describe('pedidos HTTP instrumentados', () => {
  it('correlaciona pedido e resposta sem registar dados sensíveis', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"total":2,"email":"privado"}', {
      status: 200, headers: { 'content-type': 'application/json', 'content-length': '30' },
    })))
    const response = await loggedFetch('/ordens/{id}', '/ordens/123?token=privado', { method: 'POST', body: JSON.stringify({ total: 2, password: 'segredo' }) })
    expect(await response.json()).toEqual({ total: 2, email: 'privado' })
    await vi.waitFor(() => expect(info.mock.calls.some(call => String(call[0]).includes('corpo recebido'))).toBe(true))
    const lines = info.mock.calls.map(call => String(call[0]))
    const id = lines[0].match(/pedido \d+/)?.[0]
    expect(id).toBeDefined()
    expect(lines.every(line => line.includes(id!))).toBe(true)
    expect(lines.join(' ')).toContain('"total": 2')
    expect(lines.join(' ')).not.toMatch(/privado|segredo|password|email|123/)
  })

  it('regista falhas HTTP sem consumir a resposta', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('erro', { status: 500 })))
    const response = await loggedFetch('/ordens', '/ordens')
    expect(response.status).toBe(500)
    expect(await response.text()).toBe('erro')
    expect(error.mock.calls[0][0]).toContain('HTTP 500')
    expect(error.mock.calls[0][0]).toContain('erro do servidor')
  })

  it('distingue um pedido cancelado de uma falha de rede', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const failure = new DOMException('informação interna', 'AbortError')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(failure))
    await expect(loggedFetch('/ordens', '/ordens')).rejects.toBe(failure)
    expect(warn.mock.calls[0][0]).toContain('pedido cancelado')
    expect(warn.mock.calls[0][0]).not.toContain('informação interna')
  })

  it('assinala uma resposta JSON inválida sem alterar o corpo disponível ao consumidor', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{inválido', { status: 200, headers: { 'content-type': 'application/json', 'content-length': '10' } })))
    const response = await loggedFetch('/ordens', '/ordens')
    expect(await response.text()).toBe('{inválido')
    await vi.waitFor(() => expect(warn.mock.calls[0]?.[0]).toContain('resposta JSON inválida'))
  })

  it('regista falhas de rede sem expor a exceção e preserva a rejeição', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'info').mockImplementation(() => {})
    const failure = new Error('token secreto')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(failure))
    await expect(loggedFetch('/ordens', '/ordens')).rejects.toBe(failure)
    expect(error.mock.calls[0][0]).not.toContain('secreto')
  })

  it('em produção omite corpos e conserva o estado HTTP de erro', async () => {
    vi.stubEnv('DEV', false)
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"total":2}', { status: 400, headers: { 'content-type': 'application/json', 'content-length': '11' } })))
    await loggedFetch('/ordens', '/ordens', { method: 'POST', body: '{"total":2}' })
    expect(info).not.toHaveBeenCalled()
    expect(error.mock.calls[0][0]).toContain('HTTP 400')
    expect(error.mock.calls[0][0]).not.toContain('total')
  })
})
