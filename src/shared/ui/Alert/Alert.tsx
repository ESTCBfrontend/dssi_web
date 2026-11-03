import type { HTMLAttributes, MouseEventHandler } from 'react'
import { AlertIcon } from '../AlertIcon'
import type { AlertTone } from '../AlertIcon'
import { Button } from '../Button'
import closeIcon from './assets/close.svg'
import styles from './Alert.module.css'

export interface AlertAction { label: string; onClick: MouseEventHandler<HTMLButtonElement> }
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  tone?: AlertTone
  layout?: 'compact' | 'detailed'
  title: string
  message?: string
  action?: AlertAction
  onDismiss?: MouseEventHandler<HTMLButtonElement>
  dismissLabel?: string
  toneLabel?: string
  announcement?: 'none' | 'polite' | 'assertive'
  closeIconSrc?: string
}

const toneLabels: Record<AlertTone, string> = { info: 'Informação', success: 'Sucesso', warning: 'Aviso', danger: 'Erro' }

export function Alert({ tone = 'info', layout = 'compact', title, message, action, onDismiss, dismissLabel = 'Fechar alerta', toneLabel, announcement = 'none', closeIconSrc, className, ...props }: AlertProps) {
  const severity = toneLabel ?? toneLabels[tone]
  if (!title.trim()) throw new Error('Alert requer um título não vazio.')
  if (!severity.trim()) throw new Error('Alert requer uma indicação de tipo não vazia.')
  if (layout === 'detailed' && !message?.trim()) throw new Error('Alert detalhado requer uma mensagem não vazia.')
  if (layout === 'compact' && message !== undefined) throw new Error('Alert compacto não apresenta mensagem; usa o layout detailed.')
  if (onDismiss && !dismissLabel.trim()) throw new Error('Alert requer uma etiqueta de fecho não vazia.')
  if (action && !action.label.trim()) throw new Error('Alert requer uma etiqueta de ação não vazia.')
  return <div {...props} className={[styles.root, styles[tone], className].filter(Boolean).join(' ')}>
    <AlertIcon tone={tone} />
    <div className={styles.content}>
      <div role={announcement === 'assertive' ? 'alert' : announcement === 'polite' ? 'status' : undefined} aria-live={announcement === 'none' ? 'off' : announcement}>
        <span className={styles.srOnly}>{severity}: </span><div className={styles.title}>{title}</div>
        {layout === 'detailed' && <div className={styles.message}>{message}</div>}
      </div>
      {action && <Button variant="outline" onClick={action.onClick}>{action.label}</Button>}
    </div>
    {onDismiss && <button type="button" aria-label={dismissLabel.trim()} className={styles.close} onClick={onDismiss}><img src={closeIconSrc ?? closeIcon} alt="" aria-hidden="true" /></button>}
  </div>
}
