import { describe, expect, it } from 'vitest'
import { createConfiguredDataSource } from './configuredDataSource'

describe('configuração da origem de dados', () => {
  it('mantém a origem configurada sem ativar a seleção quando a flag está desativada', () => {
    const selection = createConfiguredDataSource({
      configuredSource: 'mock',
      development: true,
      debugLayerEnabled: false,
    })
    expect(selection.source).toBe('mock')
    expect(selection.canSelect).toBe(false)
    expect(() => selection.select('api')).toThrow()
  })

  it('só permite selecionar quando a flag está ativa em desenvolvimento', () => {
    const development = createConfiguredDataSource({ development: true, debugLayerEnabled: true })
    const production = createConfiguredDataSource({ development: false, debugLayerEnabled: true })

    development.select('mock')
    expect(development.source).toBe('mock')
    expect(production.source).toBe('api')
    expect(production.canSelect).toBe(false)
    expect(() => production.select('mock')).toThrow()
  })

  it('rejeita valores de configuração inválidos', () => {
    expect(() => createConfiguredDataSource({ development: true, debugLayerEnabled: false, configuredSource: 'local' })).toThrow()
  })
})
