import { writeHttpLog } from '../logging/logger'

let sequence = 0
const maximumBodySize = 16_384
const safeNumericFields = ['total', 'count', 'page', 'pageSize'] as const

/** Só campos numéricos conhecidos são incluídos; texto, dados aninhados e arrays são omitidos. */
function filteredBody(value: unknown): string {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return '[omitido]'
  const source = value as Record<string, unknown>
  const safe: Record<string, number> = {}
  for (const key of safeNumericFields) {
    if (typeof source[key] === 'number' && Number.isFinite(source[key])) safe[key] = source[key]
  }
  return Object.keys(safe).length ? JSON.stringify(safe) : '[omitido]'
}

function requestBody(body: BodyInit | null | undefined): string {
  if (typeof body !== 'string' || body.length > maximumBodySize) return '[omitido]'
  try { return filteredBody(JSON.parse(body)) } catch { return '[omitido]' }
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
    writeHttpLog('info', `${label} | corpo recebido: ${filteredBody(JSON.parse(content))}`)
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
  if (import.meta.env.DEV && init?.body != null) writeHttpLog('info', `${label} | corpo enviado: ${requestBody(init.body)}`)
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
  const sizeHeader = response.headers.get('content-length')
  const size = sizeHeader === null ? NaN : Number(sizeHeader)
  if (import.meta.env.DEV && response.headers.get('content-type')?.includes('application/json') && Number.isFinite(size) && size >= 0 && size <= maximumBodySize) {
    void logResponseBody(response, label)
  }
  return response
}
