import { OverlaySurface } from '../Overlay'
import type { OverlaySurfaceProps } from '../Overlay'
export type DialogProps = Omit<OverlaySurfaceProps, 'presentation' | 'showHandle'>
export function Dialog(props: DialogProps) { return <OverlaySurface {...props} presentation="dialog" /> }
