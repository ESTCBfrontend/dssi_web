import { Selection } from '../selection/Selection'
import type { CheckboxProps } from '../selection/Selection'
export type { CheckboxProps } from '../selection/Selection'
export function Checkbox(props: CheckboxProps) { return <Selection {...props} kind="checkbox" /> }
