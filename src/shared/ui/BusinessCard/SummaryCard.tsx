import type { ReactNode } from 'react'
import { Button } from '../Button'
import { Card } from '../Card'
import type { CardProps } from '../Card'
import { StatusBadge } from '../StatusBadge'
import type { StatusBadgeProps } from '../StatusBadge'
import styles from './SummaryCard.module.css'

export interface SummaryDetail { label: string; value?: string | null }
export type SummaryStatus = Pick<StatusBadgeProps, 'label' | 'tone' | 'variant' | 'dotSrc' | 'icon'>
export interface SummaryCardOptions extends Omit<CardProps, 'title' | 'subtitle' | 'status' | 'children' | 'actions' | 'footer'> { status?: SummaryStatus; extraFields?: readonly SummaryDetail[]; actions?: ReactNode }
interface SummaryCardProps extends Omit<SummaryCardOptions, 'extraFields'> { title: string; subtitle?: string; status: SummaryStatus; details: readonly SummaryDetail[]; actionLabel: string; onOpen?: () => void }

export function SummaryCard({ title, subtitle, status, details, actionLabel, onOpen, actions, density = 'comfortable', ...props }: SummaryCardProps) {
  const visible = details.filter(detail => detail.value != null && detail.value.trim() !== '')
  if (visible.some(detail => !detail.label.trim())) throw new Error('Os detalhes apresentados requerem uma etiqueta não vazia.')
  if (onOpen && !actionLabel.trim()) throw new Error('A ação do cartão requer uma etiqueta não vazia.')
  return <Card {...props} title={title} subtitle={subtitle?.trim() ? subtitle : undefined} density={density} status={<StatusBadge {...status} size="small" showDot />} actions={onOpen || actions ? <>{onOpen && <Button variant="outline" aria-label={`${actionLabel}: ${title}`} onClick={onOpen}>{actionLabel}</Button>}{actions}</> : undefined}>
    {visible.length > 0 ? <dl className={styles.details}>{visible.map((detail, index) => <div key={index} className={styles.row}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl> : null}
  </Card>
}
