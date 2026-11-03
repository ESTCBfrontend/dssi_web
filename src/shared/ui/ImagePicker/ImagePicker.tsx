import { useId, useRef, useState } from 'react'
import type { ComponentPropsWithRef, ReactNode } from 'react'
import type { AttachmentState } from '../AttachmentItem'
import { Button } from '../Button'
import { PhotoTile } from '../PhotoTile'
import type { PhotoTileLabels, PhotoTilePhoto, PhotoTileProps } from '../PhotoTile'
import plus from './assets/plus.svg'
import styles from './ImagePicker.module.css'

export interface ImageEntry { photo: PhotoTilePhoto; state: AttachmentState; progress?: number; selected?: boolean }
export interface ImagePickerLabels { browse: string; capture: string; emptyTitle: string; emptyDescription: string; tooMany: string; tooLarge: string; invalidFormat: string; count: (count: number, photos: readonly ImageEntry[]) => string }
export interface ImagePickerProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children' | 'onError'> {
  title: string; description?: string; photos: readonly ImageEntry[]; onAdd: (files: File[]) => void
  onOpen?: (photo: PhotoTilePhoto) => void; onRemove?: (photo: PhotoTilePhoto) => void; onRetry?: (photo: PhotoTilePhoto) => void; onCapture?: () => void
  maxFiles?: number; maxSizeBytes?: number; multiple?: boolean; disabled?: boolean; error?: string; formatsHint?: string
  labels?: Partial<ImagePickerLabels>; photoLabels?: Partial<PhotoTileLabels>; renderPreview?: (photo: PhotoTilePhoto) => ReactNode
  headingLevel?: 2 | 3 | 4 | 5 | 6; plusIconSrc?: string; statusDotSrc?: (entry: ImageEntry) => string | undefined; placeholderSources?: PhotoTileProps['placeholderSources']
}
const defaults: ImagePickerLabels = { browse: 'Escolher fotografias', capture: 'Tirar fotografia', emptyTitle: 'Ainda não existem fotografias', emptyDescription: 'Adicione fotografias para documentar o trabalho realizado.', tooMany: 'O número de fotografias excede o limite permitido.', tooLarge: 'Uma fotografia excede o limite de tamanho.', invalidFormat: 'Selecione apenas ficheiros de imagem.', count: count => `${count} ${count === 1 ? 'fotografia selecionada' : 'fotografias selecionadas'}` }
export function ImagePicker({ title, description, photos, onAdd, onOpen, onRemove, onRetry, onCapture, maxFiles, maxSizeBytes, multiple = true, disabled = false, error, formatsHint, labels, photoLabels, renderPreview, headingLevel = 2, plusIconSrc, statusDotSrc, placeholderSources, className, ...props }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const headingId = useId()
  const errorId = useId()
  const [localError, setLocalError] = useState<string>()
  if (!title.trim() || (description !== undefined && !description.trim()) || (maxFiles !== undefined && (!Number.isSafeInteger(maxFiles) || maxFiles < 1)) || (maxSizeBytes !== undefined && (!Number.isSafeInteger(maxSizeBytes) || maxSizeBytes < 1))) throw new Error('ImagePicker requer título e limites válidos.')
  if (new Set(photos.map(entry => entry.photo.id)).size !== photos.length) throw new Error('ImagePicker requer identificadores únicos.')
  const text = { ...defaults, ...labels }
  const locked = disabled || (maxFiles !== undefined && photos.length >= maxFiles)
  const issue = error || localError
  const select = (files: File[]) => {
    if (locked || files.length === 0) return
    setLocalError(undefined)
    if ((!multiple && files.length > 1) || (maxFiles !== undefined && photos.length + files.length > maxFiles)) { setLocalError(text.tooMany); return }
    if (files.some(file => maxSizeBytes !== undefined && file.size > maxSizeBytes)) { setLocalError(text.tooLarge); return }
    if (files.some(file => !file.type.toLowerCase().startsWith('image/'))) { setLocalError(text.invalidFormat); return }
    onAdd(files)
  }
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  return <section {...props} aria-labelledby={props['aria-label'] ? undefined : headingId} className={[styles.root, issue && styles.error, className].filter(Boolean).join(' ')}><header><Heading id={headingId} className={styles.title}>{title}</Heading>{description && <p className={styles.description}>{description}</p>}</header>
    <div className={styles.actions}><input ref={inputRef} className={styles.input} type="file" tabIndex={-1} aria-hidden="true" disabled={locked} accept="image/*" multiple={multiple} onChange={event => { const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ''; select(files) }} /><Button disabled={locked} aria-describedby={issue ? errorId : undefined} onClick={() => inputRef.current?.click()}>{text.browse}</Button>{onCapture && <Button variant="outline" disabled={locked} onClick={onCapture}>{text.capture}</Button>}</div>
    {issue && <span id={errorId} role="alert" className={styles.issue}>{issue}</span>}
    {photos.length ? <div className={styles.list}><strong>{text.count(photos.length, photos)}</strong><ul className={styles.grid}>{photos.map(entry => <li key={entry.photo.id}><PhotoTile photo={entry.photo} state={entry.state} progress={entry.progress} selected={entry.selected} labels={photoLabels} preview={renderPreview?.(entry.photo)} onOpen={disabled ? undefined : onOpen} onRemove={disabled ? undefined : onRemove} onRetry={disabled ? undefined : onRetry} statusDotSrc={statusDotSrc?.(entry)} placeholderSources={placeholderSources} /></li>)}</ul></div> : <div className={styles.empty}><span className={styles.symbol} aria-hidden="true"><img src={plusIconSrc ?? plus} alt="" /></span><strong>{text.emptyTitle}</strong><span>{text.emptyDescription}</span></div>}
    {formatsHint && <span className={styles.hint}>{formatsHint}</span>}
  </section>
}
