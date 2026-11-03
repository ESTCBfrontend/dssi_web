import { useId, useRef, useState } from 'react'
import type { ComponentPropsWithRef, KeyboardEvent, ReactNode } from 'react'
import { Tab } from '../Tab'
import { TabPanel } from '../TabPanel'
import styles from './Tabs.module.css'

export interface TabsItem {
  id: string
  label: string
  content: ReactNode
  disabled?: boolean
  count?: number
  accessibilityLabel?: string
  panelTitle?: string
  panelDescription?: string
  panelActions?: ReactNode
  panelSurface?: 'surface' | 'muted'
}

export interface TabsProps extends Omit<ComponentPropsWithRef<'div'>, 'children' | 'onChange'> {
  items: readonly TabsItem[]
  value: string
  onChange: (id: string) => void
  keepMounted?: boolean
  size?: 'compact' | 'comfortable'
  accessibilityLabel?: string
  activation?: 'automatic' | 'manual'
}

export function Tabs({ items, value, onChange, keepMounted = false, size = 'compact', accessibilityLabel = 'Separadores', activation = 'automatic', className, ...props }: TabsProps) {
  const instance = useId()
  const refs = useRef(new Map<string, HTMLButtonElement>())
  const [focused, setFocused] = useState(value)
  const [inside, setInside] = useState(false)
  const ids = items.map(item => item.id)
  if (!accessibilityLabel.trim()) throw new Error('Tabs requer um nome acessível não vazio.')
  if (!items.length || ids.some(id => !id.trim()) || new Set(ids).size !== ids.length) throw new Error('Tabs requer identificadores não vazios e únicos.')
  if (!items.some(item => item.id === value && !item.disabled)) throw new Error('Tabs requer um value correspondente a um separador ativo.')
  const enabled = items.filter(item => !item.disabled)
  const focusId = inside && enabled.some(item => item.id === focused) ? focused : value
  const tabId = (id: string) => `${instance}-tab-${encodeURIComponent(id)}`
  const panelId = (id: string) => `${instance}-panel-${encodeURIComponent(id)}`
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    const current = enabled.findIndex(item => refs.current.get(item.id) === document.activeElement)
    if (current < 0) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length
    const id = enabled[next].id
    setFocused(id)
    refs.current.get(id)?.focus()
    if (activation === 'automatic' && id !== value) onChange(id)
  }
  return <div {...props} className={[styles.root, className].filter(Boolean).join(' ')}>
    <div className={styles.list} role="tablist" aria-label={accessibilityLabel} onKeyDown={onKeyDown} onFocus={() => setInside(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInside(false) }}>
      {items.map(item => <Tab key={item.id} id={tabId(item.id)} ref={node => { if (node) refs.current.set(item.id, node); else refs.current.delete(item.id) }} label={item.label} aria-label={item.accessibilityLabel} aria-controls={panelId(item.id)} selected={item.id === value} disabled={item.disabled} count={item.count} size={size} tabIndex={item.id === focusId ? 0 : -1} onFocus={() => setFocused(item.id)} onSelect={() => { if (item.id !== value) onChange(item.id) }} />)}
    </div>
    {items.map(item => <TabPanel key={item.id} id={panelId(item.id)} labelledBy={tabId(item.id)} active={item.id === value} keepMounted={keepMounted} title={item.panelTitle} description={item.panelDescription} actions={item.panelActions} surface={item.panelSurface}>{item.content}</TabPanel>)}
  </div>
}
