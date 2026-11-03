import { useState } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Button } from '../Button'
import { ProgressBar } from '../ProgressBar'
import { StatusBadge } from '../StatusBadge'
import closeIcon from './assets/close.svg'
import photoIcon from './assets/photo.svg'
import styles from './AttachmentItem.module.css'

export type AttachmentState = 'ready' | 'uploading' | 'error'
export interface AttachmentFile { id: string; name: string; details: string; kind: 'document' | 'photo'; uri?: string }
export interface AttachmentLabels { ready: string; uploading: string; error: string; errorDetails: string; progress: string; retry: string; open: string; remove: string }
export interface AttachmentItemProps extends Omit<ComponentPropsWithRef<'article'>, 'children'> {
  file: AttachmentFile; state: AttachmentState; progress?: number
  onOpen?: (file: AttachmentFile) => void; onRemove?: (file: AttachmentFile) => void; onRetry?: (file: AttachmentFile) => void
  labels?: Partial<AttachmentLabels>; uploadingDetails?: (progress: number) => string
  preview?: ReactNode; photoFallbackSrc?: string; closeIconSrc?: string; statusDotSrc?: string
}
const defaults: AttachmentLabels = { ready: 'Pronto para anexar', uploading: 'A enviar ficheiro...', error: 'Não foi possível enviar', errorDetails: 'O envio falhou. Pode voltar a tentar.', progress: 'Progresso do envio', retry: 'Repetir', open: 'Abrir', remove: 'Remover' }

export function AttachmentItem({ file, state, progress, onOpen, onRemove, onRetry, labels, uploadingDetails, preview, photoFallbackSrc, closeIconSrc, statusDotSrc, className, ...props }: AttachmentItemProps) {
  const [failedUri, setFailedUri] = useState<string>()
  if (!file || !file.id.trim() || !file.name.trim() || !file.details.trim() || !['document', 'photo'].includes(file.kind) || !['ready', 'uploading', 'error'].includes(state)) throw new Error('AttachmentItem requer ficheiro e estado válidos.')
  if (state === 'uploading' && (progress === undefined || !Number.isFinite(progress) || progress < 0 || progress > 100)) throw new Error('AttachmentItem requer progresso entre 0 e 100 durante o envio.')
  const text = { ...defaults, ...labels }
  const visual = preview ?? (file.kind === 'photo' ? <img className={styles.photo} src={file.uri && file.uri !== failedUri ? file.uri : photoFallbackSrc ?? photoIcon} alt="" onError={() => { if (file.uri && file.uri !== failedUri) setFailedUri(file.uri) }} /> : <span className={styles.document}><span className={styles.paper} /><span className={styles.mark} /></span>)
  const main = <><span className={styles.preview} aria-hidden="true">{visual}</span><span className={styles.copy}><strong>{file.name}</strong><span>{file.details}</span></span></>
  return <article {...props} className={[styles.root, state === 'error' && styles.error, className].filter(Boolean).join(' ')}>
    <div className={styles.row}>{onOpen ? <button type="button" className={[styles.main, styles.open].join(' ')} aria-label={`${text.open} ${file.name}`} onClick={() => onOpen(file)}>{main}</button> : <div className={styles.main}>{main}</div>}
      <div className={styles.status}><StatusBadge size="small" showDot dotSrc={statusDotSrc} tone={state === 'ready' ? 'success' : state === 'uploading' ? 'info' : 'danger'} label={text[state]} />
        {onRemove && state !== 'uploading' && <button type="button" className={styles.remove} aria-label={`${text.remove} ${file.name}`} onClick={() => onRemove(file)}><img src={closeIconSrc ?? closeIcon} alt="" /></button>}</div>
    </div>
    {state === 'uploading' && <><span className={styles.details}>{uploadingDetails?.(progress!) ?? `A enviar... ${Math.round(progress!)}%`}</span><ProgressBar size="compact" label={text.progress} value={progress!} /></>}
    {state === 'error' && <div className={styles.errorRow}><span>{text.errorDetails}</span>{onRetry && <Button variant="outline" onClick={() => onRetry(file)} aria-label={`${text.retry}: ${file.name}`}>{text.retry}</Button>}</div>}
  </article>
}
