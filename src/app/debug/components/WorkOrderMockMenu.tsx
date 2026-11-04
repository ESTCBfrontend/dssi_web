import { useRef, useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { Dialog } from '../../../shared/ui/Dialog'
import { Select } from '../../../shared/ui/Select'
import { ToastProvider, useToast } from '../../../shared/ui/ToastSnackbar'
import type { WorkOrderStatus } from '../../../features/work-orders/domain/workOrder'
import type { MockWorkOrderControls } from '../../../features/work-orders/infrastructure/mock/services/MockWorkOrderControls'
import { useWorkOrderServices } from '../../work-orders/providers/workOrderServiceContext'
import styles from '../DebugLayer.module.css'
import { AddWorkOrderMockForm } from './AddWorkOrderMockForm'

const scenarioOptions = [
  { value: 'normal', label: 'Normal' },
  { value: 'empty', label: 'Sem ordens' },
  { value: 'error', label: 'Erro' },
  { value: 'slow', label: 'Latência' },
] as const

const statusLabels: Record<WorkOrderStatus, string> = {
  NOVA: 'Nova', ATRIBUIDA: 'Atribuída', EM_EXECUCAO: 'Em execução',
  CONCLUIDA_TECNICAMENTE: 'Concluída tecnicamente', VALIDADA: 'Validada',
  PENDENTE: 'Pendente', CANCELADA: 'Cancelada',
}

export function WorkOrderMockMenu({ controls }: { controls: MockWorkOrderControls }) {
  const { mockScenario, selectMockScenario } = useWorkOrderServices()
  const { show, clear: clearToasts } = useToast()
  const [view, setView] = useState<'menu' | 'scenario' | 'add'>('menu')
  const [examples, setExamples] = useState<{ value: string; label: string }[]>([])
  const scenarioTriggerRef = useRef<HTMLButtonElement>(null)
  const addTriggerRef = useRef<HTMLButtonElement>(null)
  const nextToast = useRef(0)
  const scenarioLabel = scenarioOptions.find(option => option.value === mockScenario)?.label ?? mockScenario

  const notify = (message: string, tone: 'success' | 'danger' | 'info') => {
    clearToasts()
    show({ id: `mock-menu-${++nextToast.current}`, message, tone, durationMs: 5000 })
  }

  const openAdd = () => {
    try {
      setExamples(controls.listExamples().map(order => ({ value: order.id, label: `${statusLabels[order.status]} — ${order.code}` })))
      clearToasts()
      setView('add')
    } catch {
      notify('Não foi possível carregar os exemplos de OS.', 'danger')
    }
  }

  const addAll = () => {
    try {
      const { added, failed, total } = controls.addAllExamples()
      if (failed > 0) notify(`Não foi possível adicionar ${failed} de ${total} OS. ${added} ${added === 1 ? 'adicionada' : 'adicionadas'}.`, 'danger')
      else if (total === 0) notify('Não há exemplos de OS disponíveis.', 'info')
      else if (added === 0) notify('Todas as OS disponíveis já foram adicionadas.', 'info')
      else notify(`${added} OS ${added === 1 ? 'adicionada' : 'adicionadas'}.`, 'success')
    } catch {
      notify('Não foi possível adicionar os exemplos de OS.', 'danger')
    }
  }

  const clear = () => {
    try {
      const count = controls.clear()
      notify(count === 0 ? 'Não havia OS para remover.' : `${count} OS ${count === 1 ? 'removida' : 'removidas'}.`, count === 0 ? 'info' : 'success')
    } catch {
      notify('Não foi possível remover as OS.', 'danger')
    }
  }

  const reset = () => {
    try {
      const count = controls.reset()
      notify(`${count} OS ${count === 1 ? 'reposta' : 'repostas'}.`, 'success')
    }
    catch { notify('Não foi possível repor as OS.', 'danger') }
  }

  return (
    <div className={styles.submenu}>
      <ul className={styles.menu}>
        <li><Button ref={scenarioTriggerRef} className={styles.menuOption} variant="secondary" fullWidth aria-haspopup="dialog" aria-label={`Cenário OS: ${scenarioLabel}`} title="Alterar o cenário repõe os dados fictícios" onClick={() => setView('scenario')}><span className={styles.optionContent}><span>Cenário OS</span><span>{scenarioLabel}</span></span></Button></li>
        <li><Button ref={addTriggerRef} className={styles.menuOption} variant="secondary" fullWidth aria-haspopup="dialog" onClick={openAdd}>Adicionar OS</Button></li>
        <li><Button className={styles.menuOption} variant="secondary" fullWidth onClick={addAll}>Adicionar todas as OS</Button></li>
        <li><Button className={styles.menuOption} variant="secondary" fullWidth onClick={clear}>Remover todas as OS</Button></li>
        <li><Button className={styles.menuOption} variant="secondary" fullWidth title="Repor os dados iniciais do cenário atual" onClick={reset}>Repor cenário</Button></li>
      </ul>
      <Dialog open={view === 'scenario'} title="Cenário de ordens de serviço" dismissOnBackdrop closeLabel="Fechar cenário" returnFocusRef={scenarioTriggerRef} onCloseRequest={() => setView('menu')}>
        <Select
          aria-label="Cenário de ordens de serviço"
          options={scenarioOptions}
          value={mockScenario}
          onChange={value => {
            if (value === 'normal' || value === 'empty' || value === 'error' || value === 'slow') {
              try {
                selectMockScenario(value)
                setView('menu')
                notify('Cenário atualizado.', 'info')
              } catch {
                setView('menu')
                notify('Não foi possível alterar o cenário.', 'danger')
              }
            }
          }}
        />
      </Dialog>
      <Dialog open={view === 'add'} title="Adicionar OS" dismissOnBackdrop closeLabel="Fechar adicionar OS" returnFocusRef={addTriggerRef} onCloseRequest={() => setView('menu')}>
        {view === 'add' && <ToastProvider><AddWorkOrderMockForm controls={controls} options={examples} /></ToastProvider>}
      </Dialog>
    </div>
  )
}
