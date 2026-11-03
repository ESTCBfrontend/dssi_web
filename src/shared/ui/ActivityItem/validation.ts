import type { ActivityEvent } from './ActivityItem'

export const symbols = { status: '↻', assignment: '+', comment: '…', completion: '✓' }

export function validateActivityEvent(event: ActivityEvent) {
  if (!event || !Object.hasOwn(symbols, event.type) || ![event.id, event.title, event.author, event.when, event.reference].every(value => typeof value === 'string' && value.trim()) || !Number.isFinite(event.timestamp) || (event.description !== undefined && (typeof event.description !== 'string' || !event.description.trim()))) {
    throw new Error('ActivityItem requer um evento válido, com identificação, tipo, textos e timestamp válidos.')
  }
}
