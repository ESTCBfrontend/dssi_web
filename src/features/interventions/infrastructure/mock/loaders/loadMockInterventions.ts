import { parseMockInterventions } from '../parsers/parseMockInterventions'
import type { Intervention } from '../../../domain/intervention'

const files = import.meta.glob<string>('/src/mocks/interventions/*.json', { eager: true, query: '?raw', import: 'default' })

export function loadMockInterventions(): Intervention[] {
  const items = Object.keys(files).sort().flatMap(path => {
    try { return parseMockInterventions(files[path]) }
    catch (error) { throw new Error(`Erro nos dados fictícios ${path}: ${error instanceof Error ? error.message : 'Erro desconhecido.'}`) }
  })
  if (new Set(items.map(item => item.id)).size !== items.length) throw new Error('As intervenções devem ter IDs únicos entre ficheiros.')
  return items
}
