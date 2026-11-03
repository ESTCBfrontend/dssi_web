import { Selection } from '../selection/Selection'
import type { SelectionProps } from '../selection/Selection'
export type RadioProps = SelectionProps
export function Radio(props: RadioProps) { return <Selection {...props} kind="radio" /> }
