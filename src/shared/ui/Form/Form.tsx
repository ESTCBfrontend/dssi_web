import { useId } from 'react'
import type { ComponentPropsWithRef, FormEventHandler } from 'react'
import { Button } from '../Button'
import styles from './Form.module.css'

export interface FormProps extends Omit<ComponentPropsWithRef<'form'>, 'title' | 'onSubmit' | 'onReset'> {
  title: string; description?: string; onSubmit: FormEventHandler<HTMLFormElement>; submitLabel: string
  onReset?: FormEventHandler<HTMLFormElement>; resetLabel?: string; pending?: boolean; loadingLabel?: string
  error?: string; footerNote?: string; layout?: 'stacked' | 'wide'; headingLevel?: 2 | 3 | 4 | 5 | 6
}
export function Form({ title, description, children, onSubmit, submitLabel, onReset, resetLabel = 'Limpar', pending = false, loadingLabel, error, footerNote, layout = 'stacked', headingLevel = 2, className, ...props }: FormProps) {
  const headingId = useId()
  if (!title.trim() || !submitLabel.trim() || (onReset && !resetLabel.trim()) || (description !== undefined && !description.trim()) || (error !== undefined && !error.trim())) throw new Error('Form requer título, ações e mensagens fornecidas não vazias.')
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <form {...props} aria-labelledby={props['aria-label'] ? undefined : headingId} aria-busy={pending || undefined} className={[styles.root, styles[layout], className].filter(Boolean).join(' ')} onSubmit={event => { event.preventDefault(); if (!pending) onSubmit(event) }} onReset={event => { if (pending) event.preventDefault(); else onReset?.(event) }}>
    <header><Heading id={headingId} className={styles.title}>{title}</Heading>{description && <p className={styles.description}>{description}</p>}</header>
    <div className={styles.sections}>{children}</div>
    <footer className={styles.footer}>{error && <p role="alert" className={styles.error}>{error}</p>}{footerNote && <p className={styles.note}>{footerNote}</p>}
      <div className={styles.actions}>{onReset && <Button type="reset" variant="secondary" disabled={pending}>{resetLabel}</Button>}<Button type="submit" loading={pending} loadingLabel={loadingLabel}>{submitLabel}</Button></div>
    </footer>
  </form>
}
