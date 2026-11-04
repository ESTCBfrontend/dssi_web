export type LogLevel = 'info' | 'warn' | 'error'
export type LogEvent = {
  area: 'origem-dados' | 'ordens-servico'
  operation: 'selecionar' | 'listar' | 'consultar' | 'criar' | 'listar-exemplos' | 'adicionar-exemplo' | 'adicionar-todos' | 'limpar' | 'repor'
  result: 'iniciada' | 'sucesso' | 'erro' | 'parcial' | 'existente' | 'inexistente'
  source: 'api' | 'mock'
  counts?: { added: number; skipped: number; failed: number; total: number }
  count?: number
  previousSource?: 'api' | 'mock'
  correlation?: number
  durationMs?: number
}

const operations: Record<LogEvent['operation'], string> = {
  selecionar: 'Alterar origem', listar: 'Listar', consultar: 'Consultar', criar: 'Criar',
  'listar-exemplos': 'Listar exemplos', 'adicionar-exemplo': 'Adicionar exemplo',
  'adicionar-todos': 'Adicionar todas', limpar: 'Limpar', repor: 'Repor',
}

/** Não aceita mensagens de erro ou dados de negócio como contexto. */
export function createLogger(development: boolean) {
  return {
    log(level: LogLevel, event: LogEvent): void {
      if (!development && level === 'info') return
      const { area, operation, result, source, counts, count, previousSource, correlation, durationMs } = event
      const summary = counts ? ` | adicionadas: ${counts.added} | existentes: ${counts.skipped} | falhas: ${counts.failed} | total: ${counts.total}` : ''
      const quantity = count === undefined ? '' : ` | ${operation === 'limpar' ? 'removidas' : 'repostas'}: ${count}`
      const change = previousSource ? ` | ${previousSource.toUpperCase()} → ${source.toUpperCase()}` : ''
      const trace = correlation === undefined ? '' : ` #${correlation}`
      const duration = durationMs === undefined ? '' : ` | ${durationMs} ms`
      try {
        console[level](`[DSSI] [${source === 'mock' ? 'Mock' : 'API'}] ${area === 'ordens-servico' ? 'OS' : 'Origem'}${trace} | ${operations[operation]} | ${result}${change}${quantity}${summary}${duration}`)
      } catch {
        // Uma falha na consola não deve interromper a operação da aplicação.
      }
    },
  }
}

/** Saída HTTP só recebe textos preparados pela instrumentação de pedidos. */
export function writeHttpLog(level: LogLevel, message: string, development = import.meta.env.DEV): void {
  if (!development && level === 'info') return
  try { console[level](`[DSSI] [HTTP] ${message}`) } catch { /* O diagnóstico não altera o pedido. */ }
}

export const logger = createLogger(import.meta.env.DEV)
