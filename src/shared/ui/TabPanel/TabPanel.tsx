import type { ComponentPropsWithRef, ReactNode } from 'react'
import { ContentPanel } from '../ContentPanel'
import styles from './TabPanel.module.css'

export interface TabPanelProps extends Omit<ComponentPropsWithRef<'div'>, 'title' | 'id'> {
  id: string
  labelledBy: string
  title?: string
  description?: string
  actions?: ReactNode
  active?: boolean
  keepMounted?: boolean
  surface?: 'surface' | 'muted'
}

export function TabPanel({ id, labelledBy, title, description, actions, children, active = true, keepMounted = false, surface = 'surface', style, ...props }: TabPanelProps) {
  if (!id.trim() || !labelledBy.trim()) throw new Error('TabPanel requer id e labelledBy não vazios.')
  if (title !== undefined && !title.trim()) throw new Error('TabPanel requer um título não vazio quando fornecido.')
  if (description !== undefined && !description.trim()) throw new Error('TabPanel requer uma descrição não vazia quando fornecida.')
  return <div {...props} id={id} role="tabpanel" aria-labelledby={labelledBy} hidden={!active} style={active ? style : { ...style, display: 'none' }} tabIndex={active ? 0 : undefined}>
    {(active || keepMounted) && <ContentPanel className={[styles.panel, styles[surface]].join(' ')} layout="wide" title={title} description={description} actions={actions} surface={surface}>{children}</ContentPanel>}
  </div>
}
