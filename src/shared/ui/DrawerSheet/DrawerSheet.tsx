import { OverlaySurface } from '../Overlay'
import type { OverlaySurfaceProps } from '../Overlay'
export type DrawerSheetPlacement = 'right' | 'bottom' | 'fullscreen'
export interface DrawerSheetProps extends Omit<OverlaySurfaceProps, 'presentation' | 'size' | 'intent'> { placement?: DrawerSheetPlacement }
export function DrawerSheet({ placement = 'right', ...props }: DrawerSheetProps) { return <OverlaySurface {...props} presentation={placement} /> }
