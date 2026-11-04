import { afterEach, describe, expect, it, vi } from 'vitest'
import { createLogger } from './logger'

afterEach(() => vi.restoreAllMocks())

describe('logging técnico', () => {
  it('apresenta eventos estruturados sem propriedades adicionais', () => {
    const output = vi.spyOn(console, 'info').mockImplementation(() => {})
    const event = { area: 'ordens-servico', operation: 'listar', result: 'sucesso', source: 'mock', payload: 'dados privados' } as const
    createLogger(true).log('info', event)
    expect(output).toHaveBeenCalledWith('[DSSI] [Mock] OS | Listar | sucesso')
  })

  it('filtra eventos informativos em produção e mantém erros', () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const log = createLogger(false)
    log.log('info', { area: 'origem-dados', operation: 'selecionar', result: 'sucesso', source: 'api' })
    log.log('error', { area: 'ordens-servico', operation: 'listar', result: 'erro', source: 'mock' })
    expect(info).not.toHaveBeenCalled()
    expect(error).toHaveBeenCalledOnce()
  })

  it('mostra a transição de origem e as contagens da operação', () => {
    const output = vi.spyOn(console, 'info').mockImplementation(() => {})
    const log = createLogger(true)
    log.log('info', { area: 'origem-dados', operation: 'selecionar', result: 'sucesso', source: 'mock', previousSource: 'api' })
    log.log('info', { area: 'ordens-servico', operation: 'limpar', result: 'sucesso', source: 'mock', count: 7 })
    expect(output.mock.calls[0][0]).toContain('API → MOCK')
    expect(output.mock.calls[1][0]).toContain('removidas: 7')
  })

  it('não interrompe a aplicação quando a consola falha', () => {
    vi.spyOn(console, 'error').mockImplementation(() => { throw new Error('consola indisponível') })
    expect(() => createLogger(true).log('error', { area: 'ordens-servico', operation: 'listar', result: 'erro', source: 'mock' })).not.toThrow()
  })
})
