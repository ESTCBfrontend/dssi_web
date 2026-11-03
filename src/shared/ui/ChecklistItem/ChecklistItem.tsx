import { useId, useRef, useState } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Button } from '../Button'
import { RadioGroup } from '../RadioGroup'
import { StatusBadge } from '../StatusBadge'
import { results, validateChecklistEntry } from './types'
import type { ChecklistEntry, ChecklistItemLabels, ChecklistResult } from './types'
import styles from './ChecklistItem.module.css'

export interface ChecklistItemProps extends Omit<ComponentPropsWithRef<'article'>, 'onChange' | 'children'> {
  item: ChecklistEntry
  step: string
  onChange?: (result: ChecklistResult) => void
  onAddEvidence?: () => void
  evidence?: ReactNode
  disabled?: boolean
  labels?: Partial<ChecklistItemLabels>
  statusDotSrc?: string
}
const defaults: ChecklistItemLabels = { pending: 'Por verificar', pass: 'Conforme', fail: 'Não conforme', notTested: 'Não testado', register: 'Registar', edit: 'Editar', result: 'Resultado', evidence: 'Observação e evidências', addEvidence: 'Adicionar evidência' }
const tones = { pending: 'neutral', pass: 'success', fail: 'danger', notTested: 'warning' } as const

export function ChecklistItem({ item, step, onChange, onAddEvidence, evidence, disabled = false, labels, statusDotSrc, className, ...props }: ChecklistItemProps) {
  const [editing, setEditing] = useState(false)
  const editRef = useRef<HTMLButtonElement>(null)
  const choicesId = useId()
  validateChecklistEntry(item)
  if (!step.trim()) throw new Error('ChecklistItem requer um passo não vazio.')
  const text = { ...defaults, ...labels }
  const close = () => { setEditing(false); editRef.current?.focus() }
  return <article {...props} className={[styles.root, item.result === 'fail' && styles.fail, className].filter(Boolean).join(' ')}>
    <div className={styles.heading}><span className={styles.index}>{step}</span><div className={styles.copy}><strong>{item.title}</strong>{item.description && <span>{item.description}</span>}</div>
      <div className={styles.controls}><StatusBadge size="small" showDot dotSrc={statusDotSrc} tone={tones[item.result]} label={text[item.result]} />
        {onChange && <Button ref={editRef} variant="outline" disabled={disabled} aria-label={`${item.result === 'pending' ? text.register : text.edit}: ${item.title}`} aria-expanded={editing} aria-controls={editing ? choicesId : undefined} onClick={() => setEditing(!editing)}>{item.result === 'pending' ? text.register : text.edit}</Button>}</div>
    </div>
    {editing && onChange && <div id={choicesId} onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); close() } }}><RadioGroup label={`${text.result}: ${item.title}`} options={results.map(value => ({ value, label: text[value] }))} value={item.result} disabled={disabled} onChange={value => { onChange(value as ChecklistResult); close() }} /></div>}
    {(item.result === 'fail' || item.result === 'notTested' || item.note || evidence || onAddEvidence) && <div className={styles.evidence}><strong>{text.evidence}</strong>{item.note && <span>{item.note}</span>}{evidence}{onAddEvidence && <div><Button variant="outline" disabled={disabled} onClick={onAddEvidence}>{text.addEvidence}</Button></div>}</div>}
  </article>
}
