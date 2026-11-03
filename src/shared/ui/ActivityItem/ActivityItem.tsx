import type { CSSProperties, ReactNode } from 'react'
import { StatusBadge } from '../StatusBadge'
import type { StatusBadgeProps } from '../StatusBadge'
import { symbols, validateActivityEvent } from './validation'
import styles from './ActivityItem.module.css'

export interface ActivityEvent {
  id: string
  type: 'status' | 'assignment' | 'comment' | 'completion'
  title: string
  description?: string
  author: string
  timestamp: number
  when: string
  reference: string
  status?: Pick<StatusBadgeProps, 'label' | 'tone' | 'variant' | 'showDot' | 'icon' | 'dotSrc'>
}

export interface ActivityItemProps {
  event: ActivityEvent
  onOpenRelated?: (event: ActivityEvent) => void
  leading?: ReactNode
  trailing?: ReactNode
  className?: string
  style?: CSSProperties
}

export function ActivityItem({ event, onOpenRelated, leading, trailing, className, style }: ActivityItemProps) {
  validateActivityEvent(event)
  const date = new Date(event.timestamp)
  const dateTime = Number.isFinite(date.getTime()) ? date.toISOString() : undefined
  const content = <>
    <span className={[styles.symbol, event.type === 'completion' && styles.completion].filter(Boolean).join(' ')} aria-hidden="true">{leading ?? symbols[event.type]}</span>
    <span className={styles.content}>
      <span className={styles.heading}><span className={styles.title}>{event.title}</span>{event.status && <StatusBadge {...event.status} size="small" />}{trailing}</span>
      {event.description && <span className={styles.description}>{event.description}</span>}
      <span className={styles.meta}><span>{event.author}</span><time dateTime={dateTime}>{event.when}</time><span>{event.reference}</span></span>
    </span>
  </>
  const classes = [styles.root, onOpenRelated && styles.action, className].filter(Boolean).join(' ')
  return onOpenRelated ? <button type="button" className={classes} style={style} onClick={() => onOpenRelated(event)}>{content}</button> : <article className={classes} style={style}>{content}</article>
}
