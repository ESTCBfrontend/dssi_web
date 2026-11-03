import { useId } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { ActivityItem, validateActivityEvent } from '../ActivityItem'
import type { ActivityEvent, ActivityItemProps } from '../ActivityItem'
import { Button } from '../Button'
import { LoadingIndicator } from '../LoadingIndicator'
import styles from './Timeline.module.css'

export interface TimelineLabels {
  count: (count: number, hasMore: boolean) => string
  emptyTitle: string
  emptyDescription: string
  unloadedTitle: string
  loading: string
  loadMore: string
}

export interface TimelineProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> {
  events: readonly ActivityEvent[]
  title: string
  subtitle?: string
  total?: number
  hasMore?: boolean
  isLoading?: boolean
  onLoadMore?: () => void
  onOpenRelated?: (event: ActivityEvent) => void
  labels?: Partial<TimelineLabels>
  headingLevel?: 2 | 3 | 4 | 5 | 6
  renderLeading?: (event: ActivityEvent) => ActivityItemProps['leading']
  renderTrailing?: (event: ActivityEvent) => ActivityItemProps['trailing']
}

const defaultLabels: TimelineLabels = {
  count: (count, hasMore) => `${count} ${count === 1 ? 'evento' : 'eventos'}${hasMore ? (count === 1 ? ' carregado' : ' carregados') : ''}`,
  emptyTitle: 'Ainda sem atividade registada',
  emptyDescription: 'Os movimentos serão apresentados aqui.',
  unloadedTitle: 'Ainda não existem atividades carregadas',
  loading: 'A carregar atividades...',
  loadMore: 'Ver mais atividades',
}

export function Timeline({ events, title, subtitle, total, hasMore = false, isLoading = false, onLoadMore, onOpenRelated, labels, headingLevel = 2, renderLeading, renderTrailing, className, ...props }: TimelineProps) {
  const headingId = useId()
  if (!title.trim() || (subtitle !== undefined && !subtitle.trim())) throw new Error('Timeline requer título e subtítulo não vazios.')
  if (total !== undefined && (!Number.isSafeInteger(total) || total < events.length)) throw new Error('Timeline requer um total inteiro não inferior aos eventos carregados.')
  const ids = new Set<string>()
  events.forEach(event => { validateActivityEvent(event); if (ids.has(event.id)) throw new Error('Timeline requer identificadores únicos.'); ids.add(event.id) })
  const copy = [...events].sort((a, b) => b.timestamp - a.timestamp)
  const text = { ...defaultLabels, ...labels }
  if (![text.emptyTitle, text.emptyDescription, text.unloadedTitle, text.loading, text.loadMore].every(value => typeof value === 'string' && value.trim())) throw new Error('Timeline requer etiquetas não vazias.')
  const count = text.count(total ?? events.length, total === undefined && hasMore)
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <section {...props} aria-labelledby={props['aria-label'] ? undefined : headingId} className={[styles.root, className].filter(Boolean).join(' ')}>
    <div className={styles.header}><div><Heading id={headingId} className={styles.title}>{title}</Heading>{subtitle && <p className={styles.subtitle}>{subtitle}</p>}</div><span className={styles.count}>{count}</span></div>
    {copy.length > 0 ? <ol className={styles.events} aria-busy={isLoading || undefined}>{copy.map(event => <li key={event.id}><ActivityItem event={event} onOpenRelated={onOpenRelated} leading={renderLeading?.(event)} trailing={renderTrailing?.(event)} /></li>)}</ol> : !isLoading && <div className={styles.empty}><span className={styles.emptyIcon} aria-hidden="true">◷</span><strong>{hasMore ? text.unloadedTitle : text.emptyTitle}</strong>{!hasMore && <span>{text.emptyDescription}</span>}</div>}
    {isLoading && <LoadingIndicator type="inline" size="compact" label={text.loading} />}
    {hasMore && onLoadMore && <div className={styles.footer}><Button variant="outline" onClick={onLoadMore} loading={isLoading} loadingLabel={text.loading}>{text.loadMore}</Button></div>}
  </section>
}
