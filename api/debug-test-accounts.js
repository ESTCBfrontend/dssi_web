// Esta função depende da proteção de acesso da Vercel à preview. Os guardas
// abaixo impedem a sua utilização em produção e noutras branches/repositórios.
const backendLogin = 'https://alarmeon-backend-962ded164ecf.herokuapp.com/api/v1/auth/login'
const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }

function response(status, body) {
  return Response.json(body, { status, headers })
}

function loadAccounts() {
  try {
    const raw = process.env.DEBUG_TEST_ACCOUNTS
    if (!raw || raw.length > 16384) return null
    const accounts = JSON.parse(raw)
    if (!Array.isArray(accounts) || accounts.length === 0 || accounts.length > 20) return null
    if (!accounts.every(account => account && typeof account.label === 'string' && account.label.trim().length > 0 && account.label.length <= 100 && typeof account.email === 'string' && account.email.length > 0 && account.email.length <= 254 && typeof account.password === 'string' && account.password.length > 0 && account.password.length <= 1024)) return null
    return accounts
  } catch {
    return null
  }
}

export default {
  async fetch(request) {
    if (process.env.VERCEL_ENV !== 'preview' || process.env.VERCEL_GIT_COMMIT_REF !== 'develop' || process.env.VERCEL_GIT_REPO_OWNER !== 'ESTCBfrontend' || process.env.VERCEL_GIT_REPO_SLUG !== 'dssi_web') {
      return response(404, { error: 'Indisponível.' })
    }

    const accounts = loadAccounts()
    if (!accounts) return response(503, { error: 'Contas de teste indisponíveis.' })

    if (request.method === 'GET') {
      return response(200, { accounts: accounts.map((account, index) => ({ id: String(index), label: account.label })) })
    }
    if (request.method !== 'POST') return response(405, { error: 'Método não permitido.' })
    if (request.headers.get('origin') !== new URL(request.url).origin || !/^application\/json(?:\s*;|$)/i.test(request.headers.get('content-type') ?? '')) {
      return response(403, { error: 'Pedido não autorizado.' })
    }

    let input
    try {
      const body = await request.text()
      if (body.length > 256) return response(400, { error: 'Pedido inválido.' })
      input = JSON.parse(body)
    } catch {
      return response(400, { error: 'Pedido inválido.' })
    }
    if (!input || typeof input.id !== 'string' || !/^(0|[1-9]\d*)$/.test(input.id) || !accounts[Number(input.id)]) {
      return response(400, { error: 'Conta inválida.' })
    }

    const account = accounts[Number(input.id)]
    try {
      const upstream = await fetch(backendLogin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email, password: account.password }),
        signal: AbortSignal.timeout(10000),
      })
      if (!upstream.ok) return response(502, { error: 'Não foi possível iniciar sessão.' })
      const data = await upstream.json()
      if (typeof data.accessToken !== 'string' || data.accessToken.length === 0 || data.accessToken.length > 16384) {
        return response(502, { error: 'Não foi possível iniciar sessão.' })
      }
      return response(200, { accessToken: data.accessToken })
    } catch {
      return response(502, { error: 'Não foi possível iniciar sessão.' })
    }
  },
}
