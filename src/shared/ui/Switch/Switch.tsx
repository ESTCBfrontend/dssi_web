import { Selection } from '../selection/Selection'
import type { SelectionProps } from '../selection/Selection'
export type SwitchProps = SelectionProps
export function Switch(props: SwitchProps) { return <Selection {...props} kind="switch" /> }
