import { writeHttpLog } from '../logging/logger'

let sequence = 0
const maximumBodySize = 16_384
// A preview privada pode usar NODE_ENV=development para o menu, mas não deve
// apresentar tokens nem corpos HTTP na consola do browser.
const detailedLogging = import.meta.env.DEV && import.meta.env.MODE !== 'production' && import.meta.env.VITE_VERCEL_ENV !== 'preview'
/** As palavras-passe não são necessárias para diagnosticar os contratos HTTP. */
function formatBody(value: unknown): string {
  return JSON.stringify(value, (key, item: unknown) => /^(password|palavra.?passe)$/i.test(key) ? '[omitido]' : item, 2) ?? '[omitido]'
}

function requestBody(body: BodyInit | null | undefined): string {
  if (typeof body !== 'string' || body.length > maximumBodySize) return '[omitido]'
  try { return formatBody(JSON.parse(body)) } catch { return '[omitido: corpo não JSON]' }
}

async function logResponseBody(response: Response, label: string): Promise<void> {
  try {
    const reader = response.clone().body?.getReader()
    if (!reader) return
    const decoder = new TextDecoder()
    let content = ''
    let size = 0
    while (true) {
      const part = await reader.read()
      if (part.done) break
      size += part.value.byteLength
      if (size > maximumBodySize) { void reader.cancel().catch(() => {}); return }
      content += decoder.decode(part.value, { stream: true })
    }
    content += decoder.decode()
    writeHttpLog('info', `${label} | corpo recebido:\n${formatBody(JSON.parse(content))}`)
  } catch (error) {
    writeHttpLog('warn', `${label} | ${error instanceof SyntaxError ? 'resposta JSON inválida' : 'não foi possível inspecionar a resposta'}`)
  }
}

/** route é um modelo estático, sem IDs, parâmetros ou dados de utilizadores. */
export async function loggedFetch(route: string, input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (!/^\/(?:[a-z-]+|\{[a-z-]+\})(?:\/(?:[a-z-]+|\{[a-z-]+\}))*\/?$/.test(route)) {
    throw new Error('O modelo de rota para logging é inválido.')
  }
  const method = (init?.method ?? (typeof Request !== 'undefined' && input instanceof Request ? input.method : 'GET')).toUpperCase()
  const safeMethod = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].includes(method) ? method : 'OUTRO'
  const label = `pedido ${++sequence} | ${safeMethod} ${route}`
  const start = performance.now()
  writeHttpLog('info', `${label} | iniciado`)
  if (detailedLogging) {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    writeHttpLog('info', `${label} | endereço: ${url}`)
    const headers = new Headers(init?.headers ?? (typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined))
    const authorization = headers.get('authorization')
    if (authorization) writeHttpLog('info', `${label} | autorização: ${authorization}`)
  }
  if (detailedLogging && init?.body != null) writeHttpLog('info', `${label} | corpo enviado:\n${requestBody(init.body)}`)
  let response: Response
  try {
    response = await fetch(input, init)
  } catch (error) {
    const name = typeof error === 'object' && error !== null && 'name' in error ? error.name : ''
    const cancelled = name === 'AbortError' || init?.signal?.aborted === true || (typeof Request !== 'undefined' && input instanceof Request && input.signal.aborted)
    const cause = name === 'TimeoutError' ? 'tempo limite excedido' : cancelled ? 'pedido cancelado' : 'falha de rede ou pedido'
    writeHttpLog(cancelled ? 'warn' : 'error', `${label} | ${cause} | ${Math.round(performance.now() - start)} ms`)
    throw error
  }
  const category = response.ok ? '' : response.status >= 500 ? ' | erro do servidor' : response.status >= 400 ? ' | erro do pedido' : ' | resposta não concluída'
  writeHttpLog(response.ok ? 'info' : 'error', `${label} | HTTP ${response.status}${category} | ${Math.round(performance.now() - start)} ms`)
  const contentType = response.headers.get('content-type') ?? ''
  if (detailedLogging && /\bapplication\/(?:[\w.-]+\+)?json\b/i.test(contentType)) {
    void logResponseBody(response, label)
  }
  return response
}
