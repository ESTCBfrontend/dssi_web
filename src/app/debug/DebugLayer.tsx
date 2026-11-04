import { useId, useRef, useState } from 'react'
import { Button } from '../../shared/ui/Button'
import { DrawerSheet } from '../../shared/ui/DrawerSheet'
import { Dialog } from '../../shared/ui/Dialog'
import { Select } from '../../shared/ui/Select'
import { ToastProvider } from '../../shared/ui/ToastSnackbar'
import { useDataSource } from '../data-source/dataSourceContext'
import { useWorkOrderServices } from '../work-orders/providers/workOrderServiceContext'
import { WorkOrderMockMenu } from './components/WorkOrderMockMenu'
import styles from './DebugLayer.module.css'

const sourceOptions = [
  { value: 'api', label: 'API' },
  { value: 'mock', label: 'Mock' },
] as const

export default function DebugLayer() {
  const { source, canSelect, select } = useDataSource()
  const { mockControls } = useWorkOrderServices()
  const [open, setOpen] = useState(false)
  const [sourceOpen, setSourceOpen] = useState(false)
  const [mocksOpen, setMocksOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const sourceTriggerRef = useRef<HTMLButtonElement>(null)
  const mocksTriggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const sourcePanelId = useId()
  const mocksPanelId = useId()

  if (!canSelect) return null

  return (
    <div className={styles.bar}>
      <Button
        ref={triggerRef}
        variant="secondary"
        aria-label="Abrir ferramentas de desenvolvimento"
        aria-expanded={open}
        aria-controls={panelId}
        title="Ferramentas de desenvolvimento"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">🐞</span>
      </Button>
      <DrawerSheet
        id={panelId}
        open={open}
        title="Ferramentas de desenvolvimento"
        dismissOnBackdrop
        returnFocusRef={triggerRef}
        onCloseRequest={() => { setOpen(false); setSourceOpen(false); setMocksOpen(false) }}
      >
        <ul className={styles.menu}>
          <li>
            <Button
              ref={sourceTriggerRef}
              className={styles.menuOption}
              variant="secondary"
              fullWidth
              aria-label={`Origem de dados: ${source === 'api' ? 'API' : 'Mock'}`}
              aria-haspopup="dialog"
              aria-expanded={sourceOpen}
              aria-controls={sourcePanelId}
              title="Escolher a origem de dados para desenvolvimento"
              onClick={() => setSourceOpen(true)}
            >
              <span className={styles.optionContent}>
                <span>Origem de dados</span>
                <span>{source === 'api' ? 'API' : 'Mock'}</span>
              </span>
            </Button>
            <Dialog
              id={sourcePanelId}
              open={sourceOpen}
              title="Origem de dados"
              dismissOnBackdrop
              closeLabel="Fechar origem de dados"
              returnFocusRef={sourceTriggerRef}
              onCloseRequest={() => setSourceOpen(false)}
            >
              <Select
                aria-label="Origem de dados"
                options={sourceOptions}
                value={source}
                onChange={value => {
                  if (value === 'api' || value === 'mock') {
                    select(value)
                    setMocksOpen(false)
                  }
                }}
              />
            </Dialog>
          </li>
          {source === 'mock' && mockControls && (
            <li>
              <Button
                ref={mocksTriggerRef}
                className={styles.menuOption}
                variant="secondary"
                fullWidth
                aria-haspopup="dialog"
                aria-expanded={mocksOpen}
                aria-controls={mocksPanelId}
                title="Gerir cenários e dados fictícios"
                onClick={() => setMocksOpen(true)}
              >
                Mocks
              </Button>
              <Dialog
                id={mocksPanelId}
                open={mocksOpen}
                title="Mocks"
                dismissOnBackdrop
                closeLabel="Fechar mocks"
                returnFocusRef={mocksTriggerRef}
                onCloseRequest={() => setMocksOpen(false)}
              >
                {mocksOpen && <ToastProvider><WorkOrderMockMenu controls={mockControls} /></ToastProvider>}
              </Dialog>
            </li>
          )}
        </ul>
      </DrawerSheet>
    </div>
  )
}
