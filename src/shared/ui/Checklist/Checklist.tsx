import { useId } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Button } from '../Button'
import { ChecklistItem, validateChecklistEntry } from '../ChecklistItem'
import type { ChecklistEntry, ChecklistItemLabels, ChecklistResult } from '../ChecklistItem'
import { TaskProgress } from '../TaskProgress'
import type { TaskProgressLabels } from '../TaskProgress'
import styles from './Checklist.module.css'

export interface ChecklistLabels { items: string; empty: string; save: string; submit: string; count: (total: number) => string }
export interface ChecklistProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children' | 'onSubmit'> {
  title: string; description?: string; items: readonly ChecklistEntry[]; isCompleted: (item: ChecklistEntry) => boolean
  onItemChange?: (id: string, result: ChecklistResult) => void; onAddEvidence?: (item: ChecklistEntry) => void
  renderEvidence?: (item: ChecklistEntry) => ReactNode; onSave?: () => void; onSubmit?: () => void
  actions?: ReactNode; actionsDescription?: string; progressDescription?: string; disabled?: boolean
  labels?: Partial<ChecklistLabels>; itemLabels?: Partial<ChecklistItemLabels>; progressLabels?: Partial<TaskProgressLabels>
  itemStatusDotSrc?: (item: ChecklistEntry) => string | undefined; progressStatusDotSrc?: string
  headingLevel?: 2 | 3 | 4 | 5
}
const defaults: ChecklistLabels = { items: 'Pontos de verificação', empty: 'Sem pontos de verificação.', save: 'Guardar rascunho', submit: 'Submeter checklist', count: total => `${total} ${total === 1 ? 'ponto' : 'pontos'}` }
export function Checklist({ title, description, items, isCompleted, onItemChange, onAddEvidence, renderEvidence, onSave, onSubmit, actions, actionsDescription, progressDescription, disabled = false, labels, itemLabels, progressLabels, itemStatusDotSrc, progressStatusDotSrc, headingLevel = 2, className, ...props }: ChecklistProps) {
  const headingId = useId()
  if (!title.trim()) throw new Error('Checklist requer um título não vazio.')
  const ids = new Set<string>()
  items.forEach(item => { validateChecklistEntry(item); if (ids.has(item.id)) throw new Error('Checklist requer identificadores únicos.'); ids.add(item.id) })
  const completed = items.reduce((count, item) => count + (isCompleted(item) ? 1 : 0), 0)
  const text = { ...defaults, ...labels }
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5'
  const Subheading = `h${headingLevel + 1}` as 'h3' | 'h4' | 'h5' | 'h6'
  return <section {...props} aria-labelledby={props['aria-label'] ? undefined : headingId} className={[styles.root, className].filter(Boolean).join(' ')}><header><Heading id={headingId} className={styles.title}>{title}</Heading>{description && <p className={styles.description}>{description}</p>}</header>
    <TaskProgress completed={completed} total={items.length} description={progressDescription} labels={progressLabels} headingLevel={(headingLevel + 1) as 3 | 4 | 5 | 6} statusDotSrc={progressStatusDotSrc} />
    <div><div className={styles.listHeading}><Subheading>{text.items}</Subheading><span>{text.count(items.length)}</span></div>
      {items.length ? <ol className={styles.items}>{items.map((item, index) => <li key={item.id}><ChecklistItem item={item} step={String(index + 1).padStart(2, '0')} disabled={disabled} labels={itemLabels} evidence={renderEvidence?.(item)} statusDotSrc={itemStatusDotSrc?.(item)} onChange={onItemChange ? result => onItemChange(item.id, result) : undefined} onAddEvidence={onAddEvidence ? () => onAddEvidence(item) : undefined} /></li>)}</ol> : <p className={styles.description}>{text.empty}</p>}
    </div>
    {(actions || onSave || onSubmit || actionsDescription) && <footer className={styles.footer}>{actionsDescription && <p className={styles.description}>{actionsDescription}</p>}<div className={styles.actions}>{actions}{onSave && <Button variant="outline" disabled={disabled} onClick={onSave}>{text.save}</Button>}{onSubmit && <Button disabled={disabled} onClick={onSubmit}>{text.submit}</Button>}</div></footer>}
  </section>
}
