import { useId } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Button } from '../Button'
import { StatusBadge } from '../StatusBadge'
import type { StatusBadgeProps } from '../StatusBadge'
import { TeamSelector } from '../TeamSelector'
import type { TeamOption } from '../TeamSelector'
import { UserSelector } from '../UserSelector'
import type { UserOption } from '../UserSelector'
import styles from './AssignmentPanel.module.css'

export interface AssignmentValue { teamId: string | null; userId: string | null }
export interface AssignmentPanelLabels { draft: string; assigned: string; confirm: string; change: string; team: string; user: string; note: string; loading: string }
export interface AssignmentPanelProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children' | 'onChange' | 'onSubmit'> {
  title: string; subtitle?: string; value: AssignmentValue; onChange: (value: AssignmentValue) => void
  teams: readonly TeamOption[]; users: readonly UserOption[]; onSubmit: (value: AssignmentValue) => void; canSubmit: boolean
  state?: 'draft' | 'assigned'; statusLabel?: string; statusTone?: StatusBadgeProps['tone']; submitLabel?: string
  pending?: boolean; disabled?: boolean; error?: string; teamError?: string; userError?: string
  teamsLoading?: boolean; usersLoading?: boolean; teamsError?: string; usersError?: string; onRetryTeams?: () => void; onRetryUsers?: () => void
  filterUsersByTeam?: boolean; note?: ReactNode; noteLabel?: string; labels?: Partial<AssignmentPanelLabels>; headingLevel?: 2 | 3 | 4 | 5 | 6
}
const defaults: AssignmentPanelLabels = { draft: 'Por atribuir', assigned: 'Atribuída', confirm: 'Confirmar atribuição', change: 'Alterar atribuição', team: 'Equipa', user: 'Técnico', note: 'Nota para a equipa', loading: 'A guardar...' }
export function AssignmentPanel({ title, subtitle, value, onChange, teams, users, onSubmit, canSubmit, state = 'draft', statusLabel, statusTone, submitLabel, pending = false, disabled = false, error, teamError, userError, teamsLoading, usersLoading, teamsError, usersError, onRetryTeams, onRetryUsers, filterUsersByTeam = false, note, noteLabel, labels, headingLevel = 2, className, ...props }: AssignmentPanelProps) {
  const titleId = useId()
  const text = { ...defaults, ...labels }
  if (!title.trim() || !value || !['draft', 'assigned'].includes(state) || (subtitle !== undefined && !subtitle.trim()) || (error !== undefined && !error.trim()) || (statusLabel !== undefined && !statusLabel.trim()) || (submitLabel !== undefined && !submitLabel.trim()) || (note != null && !(noteLabel ?? text.note).trim())) throw new Error('AssignmentPanel requer dados e textos válidos.')
  const locked = disabled || pending
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <section {...props} aria-labelledby={props['aria-label'] ? undefined : titleId} aria-busy={pending || undefined} className={[styles.root, className].filter(Boolean).join(' ')}>
    <header className={styles.header}><div><Heading id={titleId} className={styles.title}>{title}</Heading>{subtitle && <p className={styles.subtitle}>{subtitle}</p>}</div><StatusBadge size="small" label={statusLabel ?? text[state]} tone={statusTone ?? (state === 'assigned' ? 'success' : 'warning')} /></header>
    <div className={styles.fields}><TeamSelector label={text.team} teams={teams} value={value.teamId} onChange={teamId => onChange({ ...value, teamId })} disabled={locked} error={teamError} loading={teamsLoading} loadError={teamsError} onRetry={onRetryTeams} clearable />
      <UserSelector label={text.user} users={users} value={value.userId} onChange={userId => onChange({ ...value, userId })} teamId={filterUsersByTeam ? value.teamId : null} disabled={locked} error={userError} loading={usersLoading} loadError={usersError} onRetry={onRetryUsers} clearable /></div>
    {note != null && <div className={styles.note}><strong>{noteLabel ?? text.note}</strong><div>{note}</div></div>}
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <div className={styles.footer}><Button variant={state === 'assigned' ? 'outline' : 'primary'} disabled={disabled || !canSubmit} loading={pending} loadingLabel={text.loading} onClick={() => { if (!locked && canSubmit) onSubmit(value) }}>{submitLabel ?? (state === 'assigned' ? text.change : text.confirm)}</Button></div>
  </section>
}
