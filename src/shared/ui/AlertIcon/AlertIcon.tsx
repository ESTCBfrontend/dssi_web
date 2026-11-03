import type { ComponentPropsWithRef } from 'react'
import styles from './AlertIcon.module.css'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'
type IconName = { decorative?: true; accessibilityLabel?: never } | { decorative: false; accessibilityLabel: string }
export type AlertIconProps = Omit<ComponentPropsWithRef<'span'>, 'children' | 'color'> & IconName & {
  tone?: AlertTone
  size?: number
  colorOverride?: string
}

const symbols: Record<AlertTone, string> = { info: 'i', success: '✓', warning: '!', danger: '×' }

export function AlertIcon({ tone = 'info', size = 30, colorOverride, decorative = true, accessibilityLabel, className, style, ...props }: AlertIconProps) {
  if (!Number.isFinite(size) || size <= 0) throw new Error('AlertIcon requer um tamanho finito maior que zero.')
  if (!decorative && !accessibilityLabel?.trim()) throw new Error('AlertIcon não decorativo requer uma etiqueta acessível não vazia.')
  return <span {...props} className={[styles.icon, styles[tone], className].filter(Boolean).join(' ')} style={{ ...style, width: size, height: size, fontSize: size * 16 / 30, ...(colorOverride ? { backgroundColor: colorOverride } : {}) }} role={decorative ? undefined : 'img'} aria-hidden={decorative ? true : undefined} aria-label={decorative ? undefined : accessibilityLabel?.trim()}><span aria-hidden="true">{symbols[tone]}</span></span>
}
