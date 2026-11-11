import { afterEach, describe, expect, it, vi } from 'vitest'
import { loggedFetch } from './loggedFetch'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs() })

describe('pedidos HTTP instrumentados', () => {
  it('omite credenciais e corpos na preview mesmo com o modo de desenvolvimento ativo', async () => {
    vi.stubEnv('VITE_VERCEL_ENV', 'preview')
    vi.resetModules()
    const { loggedFetch: previewFetch } = await import('./loggedFetch')
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"accessToken":"token-resposta"}', {
      headers: { 'content-type': 'application/json' },
    })))
    await previewFetch('/auth/login', '/auth/login?segredo=exemplo', {
      method: 'POST', headers: { Authorization: 'Bearer token-pedido' }, body: '{"email":"privado"}',
    })
    const output = JSON.stringify(info.mock.calls)
    expect(output).not.toContain('token-pedido')
    expect(output).not.toContain('token-resposta')
    expect(output).not.toContain('privado')
    expect(output).not.toContain('segredo=exemplo')
  })

  it('correlaciona pedidos, respostas e tokens em desenvolvimento, ocultando palavras-passe', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"total":2,"email":"privado"}', {
      status: 200, headers: { 'content-type': 'application/json' },
    })))
    const response = await loggedFetch('/ordens/{id}', '/ordens/123?pagina=1', { method: 'POST', headers: { Authorization: 'Bearer token-teste' }, body: JSON.stringify({ total: 2, password: 'segredo' }) })
    expect(await response.json()).toEqual({ total: 2, email: 'privado' })
    await vi.waitFor(() => expect(info.mock.calls.some(call => String(call[0]).includes('corpo recebido'))).toBe(true))
    const lines = info.mock.calls.map(call => String(call[0]))
    const id = lines[0].match(/pedido \d+/)?.[0]
    expect(id).toBeDefined()
    expect(lines.every(line => line.includes(id!))).toBe(true)
    expect(lines.join(' ')).toContain('"total": 2')
    expect(lines.join(' ')).toContain('/ordens/123?pagina=1')
    expect(lines.join(' ')).toContain('Bearer token-teste')
    expect(lines.join(' ')).toContain('"email": "privado"')
    expect(lines.join(' ')).not.toContain('segredo')
  })

  it('regista tokens em respostas JSON e protege palavras-passe aninhadas', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"accessToken":"token-exemplo","user":{"password":"segredo"}}', {
      headers: { 'content-type': 'application/problem+json' },
    })))
    const response = await loggedFetch('/auth/login', '/auth/login')
    expect((await response.json()).accessToken).toBe('token-exemplo')
    await vi.waitFor(() => expect(info.mock.calls.some(call => String(call[0]).includes('token-exemplo'))).toBe(true))
    expect(JSON.stringify(info.mock.calls)).not.toContain('segredo')
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
