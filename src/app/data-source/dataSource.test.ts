import { describe, expect, it } from 'vitest'
import { DataSourceSelection } from './dataSource'

describe('seleção da origem de dados', () => {
  it('usa a API por defeito e aceita uma configuração explícita de mocks', () => {
    expect(new DataSourceSelection({ allowRuntimeSelection: false }).source).toBe('api')
    expect(new DataSourceSelection({ configuredSource: 'mock', allowRuntimeSelection: false }).source).toBe('mock')
  })

  it('rejeita configurações desconhecidas', () => {
    expect(() => new DataSourceSelection({ configuredSource: 'mocks', allowRuntimeSelection: false })).toThrow()
  })

  it('permite trocar a origem quando a seleção está ativa', () => {
    const selection = new DataSourceSelection({ allowRuntimeSelection: true })
    selection.select('mock')
    expect(selection.source).toBe('mock')
    selection.select('api')
    expect(selection.source).toBe('api')
  })

  it('não permite trocar a origem quando a seleção está desativada', () => {
    const selection = new DataSourceSelection({ configuredSource: 'api', allowRuntimeSelection: false })
    expect(() => selection.select('mock')).toThrow()
    expect(selection.source).toBe('api')
  })
})
