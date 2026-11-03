import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ChangeEvent, ComponentPropsWithRef } from 'react'
import styles from '../fields/Control.module.css'

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  height?: 'compact' | 'comfortable'
  showCounter?: boolean
  autoGrow?: boolean
}

export function Textarea({ height = 'compact', showCounter = false, autoGrow = false, className, value, defaultValue, onChange, ref, maxLength, ...props }: TextareaProps) {
  const localRef = useRef<HTMLTextAreaElement | null>(null)
  const [count, setCount] = useState(() => String(defaultValue ?? '').length)
  const resizeToContent = useCallback(() => {
    const node = localRef.current
    if (!autoGrow || !node) return
    node.style.height = 'auto'
    const style = getComputedStyle(node)
    const borders = (parseFloat(style.borderTopWidth) || 0) + (parseFloat(style.borderBottomWidth) || 0)
    node.style.height = `${node.scrollHeight + borders}px`
  }, [autoGrow])
  useLayoutEffect(resizeToContent)
  useEffect(() => {
    const form = localRef.current?.form
    if (!form) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const reset = () => { clearTimeout(timer); timer = setTimeout(() => { setCount(localRef.current?.value.length ?? 0); resizeToContent() }, 0) }
    form.addEventListener('reset', reset)
    return () => { form.removeEventListener('reset', reset); clearTimeout(timer) }
  }, [resizeToContent])
  useEffect(() => {
    if (!autoGrow || !localRef.current || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(resizeToContent)
    observer.observe(localRef.current)
    return () => observer.disconnect()
  }, [autoGrow, resizeToContent])
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCount(event.currentTarget.value.length)
    resizeToContent()
    onChange?.(event)
  }
  const shownCount = value == null ? count : String(value).length
  return <div>
    <textarea {...props} ref={(node) => { localRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) ref.current = node }} value={value} defaultValue={defaultValue} maxLength={maxLength} onChange={handleChange} className={[styles.control, styles.textarea, styles[height], className].filter(Boolean).join(' ')} />
    {showCounter && <div className={styles.counter} aria-hidden="true">{shownCount}{maxLength != null ? ` / ${maxLength}` : ''}</div>}
  </div>
}
