import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, ComponentPropsWithRef } from 'react'
import styles from '../fields/Control.module.css'

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  height?: 'compact' | 'comfortable'
  showCounter?: boolean
}

export function Textarea({ height = 'compact', showCounter = false, className, value, defaultValue, onChange, ref, maxLength, ...props }: TextareaProps) {
  const localRef = useRef<HTMLTextAreaElement | null>(null)
  const [count, setCount] = useState(() => String(defaultValue ?? '').length)
  useEffect(() => {
    const form = localRef.current?.form
    if (!form) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const reset = () => { clearTimeout(timer); timer = setTimeout(() => setCount(localRef.current?.value.length ?? 0), 0) }
    form.addEventListener('reset', reset)
    return () => { form.removeEventListener('reset', reset); clearTimeout(timer) }
  }, [])
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCount(event.currentTarget.value.length)
    onChange?.(event)
  }
  const shownCount = value == null ? count : String(value).length
  return <div>
    <textarea {...props} ref={(node) => { localRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) ref.current = node }} value={value} defaultValue={defaultValue} maxLength={maxLength} onChange={handleChange} className={[styles.control, styles.textarea, styles[height], className].filter(Boolean).join(' ')} />
    {showCounter && <div className={styles.counter} aria-hidden="true">{shownCount}{maxLength != null ? ` / ${maxLength}` : ''}</div>}
  </div>
}
