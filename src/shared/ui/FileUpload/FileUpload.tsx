import { useId, useRef, useState } from 'react'
import type { ComponentPropsWithRef, DragEvent } from 'react'
import { AttachmentItem } from '../AttachmentItem'
import type { AttachmentFile, AttachmentLabels, AttachmentState } from '../AttachmentItem'
import { Button } from '../Button'
import plusIcon from './assets/plus.svg'
import styles from './FileUpload.module.css'

export interface UploadEntry { file: AttachmentFile; state: AttachmentState; progress?: number }
export interface FileUploadLabels { selectTitle: string; selectDescription: string; browse: string; count: (count: number, entries: readonly UploadEntry[]) => string; tooMany: string; tooLarge: string; invalidFormat: string }
export interface FileUploadProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children' | 'onError'> {
  title: string; description?: string; files: readonly UploadEntry[]; onAdd: (files: File[]) => void
  onRemove?: (file: AttachmentFile) => void; onOpen?: (file: AttachmentFile) => void; onRetry?: (file: AttachmentFile) => void
  accept?: readonly string[]; allowedExtensions?: readonly string[]; maxFiles?: number; maxSizeBytes?: number; multiple?: boolean
  formatsHint?: string; disabled?: boolean; error?: string; labels?: Partial<FileUploadLabels>; attachmentLabels?: Partial<AttachmentLabels>
  headingLevel?: 2 | 3 | 4 | 5 | 6; plusIconSrc?: string; closeIconSrc?: string; photoFallbackSrc?: string; statusDotSrc?: (entry: UploadEntry) => string | undefined; uploadingDetails?: (progress: number) => string
}
const defaults: FileUploadLabels = { selectTitle: 'Arraste um ficheiro para esta área', selectDescription: 'Ou utilize o botão para procurar no computador.', browse: 'Escolher ficheiro', count: count => `${count} ${count === 1 ? 'ficheiro selecionado' : 'ficheiros selecionados'}`, tooMany: 'O número de ficheiros excede o limite permitido.', tooLarge: 'Um ficheiro excede o limite de tamanho.', invalidFormat: 'Um ficheiro não corresponde aos formatos permitidos.' }
function matchesMime(mime: string, accept: readonly string[]) {
  const actual = mime.toLowerCase()
  return !!actual && accept.some(type => { const pattern = type.toLowerCase(); return pattern === '*/*' || pattern === actual || (pattern.endsWith('/*') && actual.startsWith(pattern.slice(0, -1))) })
}
export function FileUpload({ title, description, files, onAdd, onRemove, onOpen, onRetry, accept, allowedExtensions, maxFiles, maxSizeBytes, multiple = true, formatsHint, disabled = false, error, labels, attachmentLabels, headingLevel = 2, plusIconSrc, closeIconSrc, photoFallbackSrc, statusDotSrc, uploadingDetails, className, ...props }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const headingId = useId()
  const errorId = useId()
  const [localError, setLocalError] = useState<string>()
  if (!title.trim() || (description !== undefined && !description.trim()) || (maxFiles !== undefined && (!Number.isSafeInteger(maxFiles) || maxFiles < 1)) || (maxSizeBytes !== undefined && (!Number.isSafeInteger(maxSizeBytes) || maxSizeBytes < 1))) throw new Error('FileUpload requer título e limites válidos.')
  const ids = files.map(entry => entry.file.id)
  if (new Set(ids).size !== ids.length) throw new Error('FileUpload requer identificadores únicos.')
  const text = { ...defaults, ...labels }
  const locked = disabled || (maxFiles !== undefined && files.length >= maxFiles)
  const issue = error || localError
  const select = (selected: File[]) => {
    if (locked || selected.length === 0) return
    setLocalError(undefined)
    if ((!multiple && selected.length > 1) || (maxFiles !== undefined && files.length + selected.length > maxFiles)) { setLocalError(text.tooMany); return }
    if (selected.some(file => maxSizeBytes !== undefined && file.size > maxSizeBytes)) { setLocalError(text.tooLarge); return }
    if (selected.some(file => (accept?.length && !matchesMime(file.type, accept)) || (allowedExtensions?.length && !allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`))))) { setLocalError(text.invalidFormat); return }
    onAdd(selected)
  }
  const drop = (event: DragEvent<HTMLDivElement>) => { event.preventDefault(); if (!locked) select(Array.from(event.dataTransfer.files)) }
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  const acceptAttribute = [...(accept ?? []), ...(allowedExtensions ?? []).map(ext => ext.startsWith('.') ? ext : `.${ext}`)].join(',') || undefined
  return <section {...props} aria-labelledby={props['aria-label'] ? undefined : headingId} className={[styles.root, issue && styles.error, className].filter(Boolean).join(' ')}><header><Heading id={headingId} className={styles.title}>{title}</Heading>{description && <p className={styles.description}>{description}</p>}</header>
    <div className={styles.zone} onDragOver={event => event.preventDefault()} onDrop={drop}><span className={styles.symbol} aria-hidden="true"><img src={plusIconSrc ?? plusIcon} alt="" /></span><div className={styles.copy}><strong>{text.selectTitle}</strong><span>{text.selectDescription}</span></div>
      <input ref={inputRef} className={styles.input} type="file" tabIndex={-1} aria-hidden="true" disabled={locked} multiple={multiple} accept={acceptAttribute} onChange={event => { const selected = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ''; select(selected) }} />
      <Button disabled={locked} aria-describedby={issue ? errorId : undefined} onClick={() => inputRef.current?.click()}>{text.browse}</Button>
    </div>
    {formatsHint && <span className={styles.hint}>{formatsHint}</span>}{issue && <span id={errorId} role="alert" className={styles.issue}>{issue}</span>}
    {files.length > 0 && <div className={styles.list}><strong>{text.count(files.length, files)}</strong><ul>{files.map(entry => <li key={entry.file.id}><AttachmentItem file={entry.file} state={entry.state} progress={entry.progress} labels={attachmentLabels} uploadingDetails={uploadingDetails} onOpen={disabled ? undefined : onOpen} onRemove={disabled ? undefined : onRemove} onRetry={disabled ? undefined : onRetry} closeIconSrc={closeIconSrc} photoFallbackSrc={photoFallbackSrc} statusDotSrc={statusDotSrc?.(entry)} /></li>)}</ul></div>}
  </section>
}
