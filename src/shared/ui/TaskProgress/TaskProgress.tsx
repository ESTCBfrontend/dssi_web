import { useId } from 'react'
import type { ComponentPropsWithRef } from 'react'
import { ProgressBar } from '../ProgressBar'
import { StatusBadge } from '../StatusBadge'
import styles from './TaskProgress.module.css'

export interface TaskProgressLabels { inProgress: string; complete: string; empty: string; progress: string; count: (completed: number, total: number) => string; summary: (completed: number, total: number, percent: number) => string }
export interface TaskProgressProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> { completed: number; total: number; title?: string; description?: string; labels?: Partial<TaskProgressLabels>; headingLevel?: 2 | 3 | 4 | 5 | 6; statusDotSrc?: string }
const defaults: TaskProgressLabels = { inProgress: 'Em curso', complete: 'Concluída', empty: 'Sem verificações', progress: 'Verificações concluídas', count: (completed, total) => `${completed} de ${total}`, summary: (completed, total, percent) => total === 0 ? 'Sem verificações para apresentar' : completed === total ? 'Tudo verificado' : `Verificações realizadas · ${percent}% do total` }
export function TaskProgress({ completed, total, title = 'Progresso das verificações', description, labels, headingLevel = 3, statusDotSrc, className, ...props }: TaskProgressProps) {
  const headingId = useId()
  if (!Number.isSafeInteger(completed) || !Number.isSafeInteger(total) || completed < 0 || total < 0 || completed > total) throw new Error('TaskProgress requer contagens inteiras válidas.')
  if (!title.trim()) throw new Error('TaskProgress requer um título não vazio.')
  const text = { ...defaults, ...labels }
  const complete = total > 0 && completed === total
  const percent = total === 0 ? 0 : complete ? 100 : Math.min(99, Math.round(completed / total * 100))
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <section {...props} aria-labelledby={props['aria-label'] ? undefined : headingId} className={[styles.root, className].filter(Boolean).join(' ')}><div className={styles.heading}><div><Heading id={headingId} className={styles.title}>{title}</Heading>{description && <p className={styles.description}>{description}</p>}</div><StatusBadge size="small" showDot dotSrc={statusDotSrc} tone={total === 0 ? 'neutral' : complete ? 'success' : 'info'} label={total === 0 ? text.empty : complete ? text.complete : text.inProgress} /></div>
    <div className={styles.indicator}><ProgressBar className={styles.progress} label={text.progress} size="regular" value={percent} status={complete ? 'complete' : 'active'} statusText={text.complete} showStatusText={false} /><div className={styles.summary}><strong className={complete ? styles.complete : undefined}>{text.count(completed, total)}</strong><span>{text.summary(completed, total, percent)}</span></div></div>
  </section>
}
