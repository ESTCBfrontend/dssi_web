import { useState } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import type { AttachmentState } from '../AttachmentItem'
import { Button } from '../Button'
import { StatusBadge } from '../StatusBadge'
import sun from './assets/sun.svg'
import landscapeLarge from './assets/landscape-large.svg'
import landscapeNear from './assets/landscape-near.svg'
import styles from './PhotoTile.module.css'

export interface PhotoTilePhoto { id: string; name: string; uri?: string; alt?: string }
export interface PhotoTileLabels { ready: string; uploading: string; error: string; retry: string; open: string; remove: string; progress: string; selected: string }
export interface PhotoTileProps extends Omit<ComponentPropsWithRef<'article'>, 'children'> {
  photo: PhotoTilePhoto; state: AttachmentState; progress?: number; selected?: boolean
  onOpen?: (photo: PhotoTilePhoto) => void; onRemove?: (photo: PhotoTilePhoto) => void; onRetry?: (photo: PhotoTilePhoto) => void
  labels?: Partial<PhotoTileLabels>; preview?: ReactNode; statusDotSrc?: string
  placeholderSources?: Partial<{ sun: string; landscapeLarge: string; landscapeNear: string }>
}
const defaults: PhotoTileLabels = { ready: 'Guardada', uploading: 'A enviar...', error: 'Erro de envio', retry: 'Repetir', open: 'Abrir', remove: 'Remover', progress: 'Progresso do envio', selected: 'Selecionada' }
export function PhotoTile({ photo, state, progress, selected, onOpen, onRemove, onRetry, labels, preview, statusDotSrc, placeholderSources, className, ...props }: PhotoTileProps) {
  const [failedUri, setFailedUri] = useState<string>()
  if (!photo || !photo.id.trim() || !photo.name.trim() || !['ready', 'uploading', 'error'].includes(state)) throw new Error('PhotoTile requer fotografia e estado válidos.')
  if (state === 'uploading' && (progress === undefined || !Number.isFinite(progress) || progress < 0 || progress > 100)) throw new Error('PhotoTile requer progresso entre 0 e 100 durante o envio.')
  const text = { ...defaults, ...labels }
  const description = photo.alt?.trim() || photo.name
  const custom = preview !== undefined && preview !== null
  const placeholder = <span className={styles.placeholder} aria-hidden="true"><img className={styles.sun} src={placeholderSources?.sun ?? sun} alt="" /><img className={styles.landscapeLarge} src={placeholderSources?.landscapeLarge ?? landscapeLarge} alt="" /><img className={styles.landscapeNear} src={placeholderSources?.landscapeNear ?? landscapeNear} alt="" /></span>
  const content = custom ? <span aria-hidden="true">{preview}</span> : photo.uri && photo.uri !== failedUri ? <img className={styles.photo} src={photo.uri} alt={onOpen ? '' : description} onError={() => setFailedUri(photo.uri)} /> : placeholder
  const previewContent = <span className={styles.preview} role={!onOpen && (custom || !photo.uri || photo.uri === failedUri) ? 'img' : undefined} aria-label={!onOpen && (custom || !photo.uri || photo.uri === failedUri) ? description : undefined}>{content}</span>
  return <article {...props} className={[styles.root, state === 'error' && styles.error, selected && styles.selected, className].filter(Boolean).join(' ')}>
    {onOpen ? <button type="button" className={styles.open} aria-label={`${text.open} ${description}`} aria-pressed={selected} onClick={() => onOpen(photo)}>{previewContent}</button> : previewContent}
    {selected && !onOpen && <span className={styles.srOnly}>{text.selected}</span>}<strong className={styles.name}>{photo.name}</strong>
    <div className={styles.status}><StatusBadge size="small" showDot dotSrc={statusDotSrc} tone={state === 'ready' ? 'success' : state === 'uploading' ? 'info' : 'danger'} label={text[state]} />
      {onRemove && state !== 'uploading' && <Button size="small" variant="outline" aria-label={`${text.remove} ${photo.name}`} onClick={() => onRemove(photo)}>{text.remove}</Button>}</div>
    {state === 'uploading' && <div className={styles.track} role="progressbar" aria-label={`${text.progress}: ${photo.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress!)} aria-valuetext={`${Math.round(progress!)}%`}><span style={{ width: `${Math.round(progress!)}%` }} /></div>}
    {state === 'error' && onRetry && <Button variant="outline" fullWidth aria-label={`${text.retry}: ${photo.name}`} onClick={() => onRetry(photo)}>{text.retry}</Button>}
  </article>
}
