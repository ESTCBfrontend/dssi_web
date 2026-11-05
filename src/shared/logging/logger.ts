export type LogLevel = 'info' | 'warn' | 'error'
export type LogEvent = {
  area: 'origem-dados' | 'ordens-servico' | 'intervencoes'
  operation: 'selecionar' | 'listar' | 'consultar' | 'criar' | 'editar' | 'listar-exemplos' | 'adicionar-exemplo' | 'adicionar-todos' | 'limpar' | 'repor'
  result: 'iniciada' | 'sucesso' | 'erro' | 'parcial' | 'existente' | 'inexistente' | 'os-ausente'
  source: 'api' | 'mock'
  counts?: { added: number; skipped: number; failed: number; total: number; missingOrder?: number }
  count?: number
  previousSource?: 'api' | 'mock'
  correlation?: number
  durationMs?: number
  mockWorkOrderId?: string
}

const operations: Record<LogEvent['operation'], string> = {
  selecionar: 'Alterar origem', listar: 'Listar', consultar: 'Consultar', criar: 'Criar', editar: 'Editar',
  'listar-exemplos': 'Listar exemplos', 'adicionar-exemplo': 'Adicionar exemplo',
  'adicionar-todos': 'Adicionar todas', limpar: 'Limpar', repor: 'Repor',
}

/** Os eventos não aceitam mensagens de erro ou dados de negócio como contexto. */
export function createLogger(development: boolean) {
  return {
    /** Reservado a exemplos fictícios carregados dos ficheiros JSON do projeto. */
    mockExample(feature: string, example: unknown): void {
      if (!development) return
      try {
        const json = JSON.stringify(example, null, 2)
        if (json !== undefined) console.info(`[DSSI] [Mock] ${feature} | Exemplo adicionado:\n${json}`)
      } catch {
        // O diagnóstico não deve interromper a operação mock.
      }
    },
    log(level: LogLevel, event: LogEvent): void {
      if (!development && level === 'info') return
      const { area, operation, result, source, counts, count, previousSource, correlation, durationMs, mockWorkOrderId } = event
      const summary = counts ? ` | adicionadas: ${counts.added} | existentes: ${counts.skipped}${counts.missingOrder === undefined ? '' : ` | sem OS: ${counts.missingOrder}`} | falhas: ${counts.failed} | total: ${counts.total}` : ''
      const quantity = count === undefined ? '' : ` | ${operation === 'limpar' ? 'removidas' : operation === 'repor' ? 'repostas' : 'total'}: ${count}`
      const change = previousSource ? ` | ${previousSource.toUpperCase()} → ${source.toUpperCase()}` : ''
      const trace = correlation === undefined ? '' : ` #${correlation}`
      const duration = durationMs === undefined ? '' : ` | ${durationMs} ms`
      const resultLabel = result === 'os-ausente' ? 'OS associada não está presente' : result
      const mockOrder = development && source === 'mock' && result === 'os-ausente' && mockWorkOrderId ? ` | OS fictícia: ${mockWorkOrderId}` : ''
      try {
        console[level](`[DSSI] [${source === 'mock' ? 'Mock' : 'API'}] ${area === 'ordens-servico' ? 'OS' : area === 'intervencoes' ? 'Intervenções' : 'Origem'}${trace} | ${operations[operation]} | ${resultLabel}${mockOrder}${change}${quantity}${summary}${duration}`)
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
