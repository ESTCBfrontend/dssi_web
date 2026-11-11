// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler from '../../api/debug-test-accounts.js'

const previewUrl = 'https://preview.example.test/api/debug-test-accounts'
const accounts = [{ label: 'Conta A', email: 'a@example.test', password: 'password-example' }]

function request(method = 'GET', body = undefined, origin = 'https://preview.example.test') {
  return new Request(previewUrl, { method, headers: method === 'POST' ? { 'Content-Type': 'application/json', Origin: origin } : {}, body: body === undefined ? undefined : JSON.stringify(body) })
}

beforeEach(() => {
  vi.stubEnv('VERCEL_ENV', 'preview')
  vi.stubEnv('VERCEL_GIT_COMMIT_REF', 'develop')
  vi.stubEnv('VERCEL_GIT_REPO_OWNER', 'ESTCBfrontend')
  vi.stubEnv('VERCEL_GIT_REPO_SLUG', 'dssi_web')
  vi.stubEnv('DEBUG_TEST_ACCOUNTS', JSON.stringify(accounts))
})
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('login de teste na preview', () => {
  it.each([
    ['VERCEL_ENV', 'production'],
    ['VERCEL_GIT_COMMIT_REF', 'feature/exemplo'],
    ['VERCEL_GIT_REPO_OWNER', 'outra'],
    ['VERCEL_GIT_REPO_SLUG', 'outro'],
  ])('recusa acesso quando %s é %s', async (key, value) => {
    vi.stubEnv(key, value)
    expect((await handler.fetch(request())).status).toBe(404)
  })

  it('apresenta apenas identificador e etiqueta sem permitir cache', async () => {
    const result = await handler.fetch(request())
    expect(result.headers.get('cache-control')).toBe('no-store')
    expect(await result.json()).toEqual({ accounts: [{ id: '0', label: 'Conta A' }] })
  })

  it('autentica a conta selecionada apenas no backend de testes', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ accessToken: 'token-example', ignored: 'ignored' }))
    vi.stubGlobal('fetch', fetcher)
    const result = await handler.fetch(request('POST', { id: '0' }))
    expect(await result.json()).toEqual({ accessToken: 'token-example' })
    expect(fetcher.mock.calls[0][0]).toBe('https://alarmeon-backend-962ded164ecf.herokuapp.com/api/v1/auth/login')
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toEqual({ email: accounts[0].email, password: accounts[0].password })
  })

  it('rejeita outra origem ou uma conta que não existe', async () => {
    const fetcher = vi.fn()
    vi.stubGlobal('fetch', fetcher)
    expect((await handler.fetch(request('POST', { id: '0' }, 'https://outra.example.test'))).status).toBe(403)
    expect((await handler.fetch(request('POST', { id: '1' }))).status).toBe(400)
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('não expõe detalhes de erros nem aceita configuração inválida', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('detalhe interno')))
    const result = await handler.fetch(request('POST', { id: '0' }))
    expect(result.status).toBe(502)
    expect(await result.text()).not.toContain('detalhe interno')
    vi.stubEnv('DEBUG_TEST_ACCOUNTS', '{')
    expect((await handler.fetch(request())).status).toBe(503)
  })
})
