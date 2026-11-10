import { useId, useRef, useState } from 'react'
import { Button } from '../../shared/ui/Button'
import { DrawerSheet } from '../../shared/ui/DrawerSheet'
import { Dialog } from '../../shared/ui/Dialog'
import { Select } from '../../shared/ui/Select'
import { useDataSource } from '../data-source/dataSourceContext'
import { useWorkOrderServices } from '../work-orders/providers/workOrderServiceContext'
import { MockMenu } from './components/MockMenu'
import { DebugAccounts } from './components/DebugAccounts'
import styles from './DebugLayer.module.css'

const sourceOptions = [
  { value: 'api', label: 'API' },
  { value: 'mock', label: 'Mock' },
] as const

export default function DebugLayer() {
  const { source, canSelect, select } = useDataSource()
  const { mockControls, interventionControls, apiService, logout } = useWorkOrderServices()
  const [open, setOpen] = useState(false)
  const [sourceOpen, setSourceOpen] = useState(false)
  const [mocksOpen, setMocksOpen] = useState(false)
  const [accountsOpen, setAccountsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const sourceTriggerRef = useRef<HTMLButtonElement>(null)
  const mocksTriggerRef = useRef<HTMLButtonElement>(null)
  const accountsTriggerRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const sourcePanelId = useId()
  const mocksPanelId = useId()
  const accountsPanelId = useId()

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
        onCloseRequest={() => { setOpen(false); setSourceOpen(false); setMocksOpen(false); setAccountsOpen(false) }}
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
                    setAccountsOpen(false)
                  }
                }}
              />
            </Dialog>
          </li>
          {source === 'api' && (
            <li>
              <Button ref={accountsTriggerRef} className={styles.menuOption} variant="secondary" fullWidth
                aria-haspopup="dialog" aria-expanded={accountsOpen} aria-controls={accountsPanelId}
                onClick={() => setAccountsOpen(true)}>Contas de teste</Button>
              <Dialog id={accountsPanelId} open={accountsOpen} title="Contas de teste" dismissOnBackdrop
                closeLabel="Fechar contas de teste" returnFocusRef={accountsTriggerRef} onCloseRequest={() => setAccountsOpen(false)}>
                {accountsOpen && <DebugAccounts onSuccess={() => { setAccountsOpen(false); setOpen(false) }} />}
              </Dialog>
            </li>
          )}
          {source === 'api' && apiService && <li>
            <Button className={styles.menuOption} variant="secondary" fullWidth onClick={() => { logout(); setOpen(false) }}>
              Terminar sessão
            </Button>
          </li>}
          {source === 'mock' && mockControls && interventionControls && (
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
                {mocksOpen && <MockMenu orders={mockControls} interventions={interventionControls} />}
              </Dialog>
            </li>
          )}
        </ul>
      </DrawerSheet>
    </div>
  )
}
