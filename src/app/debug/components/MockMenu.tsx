import { useRef, useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { Dialog } from '../../../shared/ui/Dialog'
import { ToastProvider } from '../../../shared/ui/ToastSnackbar'
import type { MockWorkOrderControls } from '../../../features/work-orders/infrastructure/mock/services/MockWorkOrderControls'
import type { MockInterventionService } from '../../../features/interventions/infrastructure/mock/services/MockInterventionService'
import { WorkOrderMockMenu } from './WorkOrderMockMenu'
import { InterventionMockMenu } from './InterventionMockMenu'
import styles from '../DebugLayer.module.css'

export function MockMenu({ orders, interventions }: { orders: MockWorkOrderControls; interventions: MockInterventionService }) {
  const [view, setView] = useState<'orders' | 'interventions' | null>(null)
  const ordersRef = useRef<HTMLButtonElement>(null)
  const interventionsRef = useRef<HTMLButtonElement>(null)

  return <div className={styles.submenu}>
    <ul className={styles.menu}>
      <li><Button ref={ordersRef} className={styles.menuOption} variant="secondary" fullWidth aria-haspopup="dialog" onClick={() => setView('orders')}>Ordens de serviço</Button></li>
      <li><Button ref={interventionsRef} className={styles.menuOption} variant="secondary" fullWidth aria-haspopup="dialog" onClick={() => setView('interventions')}>Intervenções</Button></li>
    </ul>
    <Dialog open={view === 'orders'} title="Ordens de serviço" dismissOnBackdrop closeLabel="Fechar ordens de serviço" returnFocusRef={ordersRef} onCloseRequest={() => setView(null)}>
      {view === 'orders' && <ToastProvider><WorkOrderMockMenu controls={orders} /></ToastProvider>}
    </Dialog>
    <Dialog open={view === 'interventions'} title="Intervenções" dismissOnBackdrop closeLabel="Fechar intervenções" returnFocusRef={interventionsRef} onCloseRequest={() => setView(null)}>
      {view === 'interventions' && <ToastProvider><InterventionMockMenu controls={interventions} /></ToastProvider>}
    </Dialog>
  </div>
}
