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

  it('explica a OS ausente e só identifica a OS fictícia em desenvolvimento', () => {
    const output = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const event = { area: 'intervencoes', operation: 'adicionar-exemplo', result: 'os-ausente', source: 'mock', mockWorkOrderId: 'mock-os-4' } as const
    createLogger(true).log('warn', event)
    expect(output.mock.calls[0][0]).toContain('OS associada não está presente | OS fictícia: mock-os-4')
    createLogger(false).log('warn', event)
    expect(output.mock.calls[1][0]).toContain('OS associada não está presente')
    expect(output.mock.calls[1][0]).not.toContain('mock-os-4')
  })

  it('não interrompe a aplicação quando a consola falha', () => {
    vi.spyOn(console, 'error').mockImplementation(() => { throw new Error('consola indisponível') })
    expect(() => createLogger(true).log('error', { area: 'ordens-servico', operation: 'listar', result: 'erro', source: 'mock' })).not.toThrow()
  })

  it('apresenta JSON fictício formatado em desenvolvimento e omite-o em produção', () => {
    const output = vi.spyOn(console, 'info').mockImplementation(() => {})
    const fixture = { id: 'exemplo', dados: { estado: 'NOVA' } }
    createLogger(true).mockExample('OS', fixture)
    expect(output).toHaveBeenCalledWith('[DSSI] [Mock] OS | Exemplo adicionado:\n{\n  "id": "exemplo",\n  "dados": {\n    "estado": "NOVA"\n  }\n}')
    output.mockClear()
    createLogger(false).mockExample('OS', fixture)
    expect(output).not.toHaveBeenCalled()
  })

  it('não interrompe a operação se não for possível formatar o JSON fictício', () => {
    const cyclic: { self?: unknown } = {}
    cyclic.self = cyclic
    expect(() => createLogger(true).mockExample('OS', cyclic)).not.toThrow()
  })
})
