import { useRef, useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { Dialog } from '../../../shared/ui/Dialog'
import { ToastProvider, useToast } from '../../../shared/ui/ToastSnackbar'
import type { MockInterventionService } from '../../../features/interventions/infrastructure/mock/services/MockInterventionService'
import styles from '../DebugLayer.module.css'
import { AddInterventionMockForm } from './AddInterventionMockForm'

export function InterventionMockMenu({ controls }: { controls: MockInterventionService }) {
  const { show, clear: clearToasts } = useToast()
  const nextToast = useRef(0)
  const [options, setOptions] = useState<{ value: string; label: string; workOrderId: string }[]>([])
  const [choosing, setChoosing] = useState(false)
  const addTrigger = useRef<HTMLButtonElement>(null)

  function notify(message: string, tone: 'success' | 'danger' | 'info') {
    clearToasts()
    show({ id: `intervention-${++nextToast.current}`, message, tone, durationMs: 5000 })
  }
  function openExamples() {
    try {
      setOptions(controls.listExamples().map(item => ({ value: item.id, label: `${item.status} — ${item.workOrderId} — ${item.id}`, workOrderId: item.workOrderId })))
      setChoosing(true)
    } catch { notify('Não foi possível carregar as intervenções.', 'danger') }
  }
  function addAll() {
    try {
      const result = controls.addAllExamples()
      if (result.failed) notify(`Falha ao adicionar ${result.failed} de ${result.total} intervenções. ${result.added} adicionadas.`, 'danger')
      else if (result.missingOrder) notify(`${result.added} adicionadas; ${result.missingOrder} sem a OS associada.`, 'danger')
      else if (!result.total) notify('Não há intervenções disponíveis.', 'info')
      else if (!result.added) notify('Todas as intervenções disponíveis já foram adicionadas.', 'info')
      else notify(`${result.added} ${result.added === 1 ? 'intervenção adicionada' : 'intervenções adicionadas'}.`, 'success')
    } catch { notify('Não foi possível adicionar as intervenções.', 'danger') }
  }
  function clear() {
    try {
      const count = controls.clear()
      notify(count ? `${count} ${count === 1 ? 'intervenção removida' : 'intervenções removidas'}.` : 'Não havia intervenções para remover.', count ? 'success' : 'info')
    } catch { notify('Não foi possível remover as intervenções.', 'danger') }
  }
  return <div className={styles.submenu}>
    <ul className={styles.menu}>
      <li><Button ref={addTrigger} className={styles.menuOption} variant="secondary" fullWidth aria-haspopup="dialog" onClick={openExamples}>Adicionar intervenção</Button></li>
      <li><Button className={styles.menuOption} variant="secondary" fullWidth onClick={addAll}>Adicionar todas as intervenções</Button></li>
      <li><Button className={styles.menuOption} variant="secondary" fullWidth onClick={clear}>Remover todas as intervenções</Button></li>
    </ul>
    <Dialog open={choosing} title="Adicionar intervenção" dismissOnBackdrop closeLabel="Fechar adicionar intervenção" returnFocusRef={addTrigger} onCloseRequest={() => setChoosing(false)}>{choosing && <ToastProvider><AddInterventionMockForm controls={controls} options={options} /></ToastProvider>}</Dialog>
  </div>
}
