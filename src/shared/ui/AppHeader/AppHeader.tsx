import type { ComponentPropsWithRef, ReactNode } from 'react'
import styles from './AppHeader.module.css'

export interface AppHeaderProps extends Omit<ComponentPropsWithRef<'header'>, 'title' | 'children'> {
  title: string; subtitle?: string; mark?: ReactNode; leading?: ReactNode; trailing?: ReactNode
  avatarText?: string; onProfilePress?: () => void; profileLabel?: string; profileText?: string
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
}
export function AppHeader({ title, subtitle, mark, leading, trailing, avatarText, onProfilePress, profileLabel = 'Perfil', profileText = 'Conta', headingLevel = 2, className, ...props }: AppHeaderProps) {
  if (!title.trim() || (subtitle !== undefined && !subtitle.trim()) || (avatarText !== undefined && !avatarText.trim()) || (onProfilePress && !profileLabel.trim())) throw new Error('AppHeader requer título e textos fornecidos não vazios.')
  const Heading = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  const avatar = avatarText && <span className={styles.avatar} aria-hidden="true">{avatarText}</span>
  return <header {...props} className={[styles.root, className].filter(Boolean).join(' ')}><div className={styles.brand}>{leading}{mark}<div className={styles.copy}><Heading className={styles.title}>{title}</Heading>{subtitle && <p className={styles.subtitle}>{subtitle}</p>}</div></div><div className={styles.actions}>{trailing}{avatar && (onProfilePress ? <button type="button" className={styles.profile} aria-label={profileLabel} onClick={onProfilePress}>{avatar}{profileText && <span>{profileText}</span>}</button> : <span className={styles.profileStatic} aria-hidden="true">{avatar}</span>)}</div></header>
}
