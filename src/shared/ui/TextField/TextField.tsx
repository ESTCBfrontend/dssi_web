import type { ComponentPropsWithRef, ReactNode } from 'react'
import styles from '../fields/Control.module.css'

export interface TextFieldProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  size?: 'small' | 'medium' | 'large'
  iconStart?: ReactNode
}

export function TextField({ size = 'medium', iconStart, className, type = 'text', ...props }: TextFieldProps) {
  return <span className={styles.inputWrapper}>
    {iconStart && <span className={styles.leadingIcon} aria-hidden="true">{iconStart}</span>}
    <input {...props} type={type} className={[styles.control, styles[size], iconStart && styles.withIcon, className].filter(Boolean).join(' ')} />
  </span>
}
