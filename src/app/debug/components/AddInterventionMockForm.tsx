import { useRef, useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { Select } from '../../../shared/ui/Select'
import { useToast } from '../../../shared/ui/ToastSnackbar'
import type { MockInterventionService } from '../../../features/interventions/infrastructure/mock/services/MockInterventionService'
import styles from '../DebugLayer.module.css'

export function AddInterventionMockForm({ controls, options }: { controls: MockInterventionService; options: { value: string; label: string; workOrderId: string }[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const { show, clear } = useToast()
  const nextToast = useRef(0)
  function add() {
    if (!selected) return
    let message: string
    let tone: 'success' | 'danger' | 'info'
    try {
      const result = controls.addExample(selected)
      const orderId = options.find(option => option.value === selected)?.workOrderId
      message = result === 'missing-order' ? (orderId ? `Adiciona primeiro a OS associada: ${orderId}.` : 'Adiciona primeiro a OS associada.') : result === 'existing' ? 'Esta intervenção já foi adicionada.' : 'Intervenção adicionada.'
      tone = result === 'missing-order' ? 'danger' : result === 'existing' ? 'info' : 'success'
    } catch { message = 'Não foi possível adicionar a intervenção.'; tone = 'danger' }
    clear()
    show({ id: `add-intervention-${++nextToast.current}`, message, tone, durationMs: 5000 })
  }
  return <div className={styles.submenu}><Select aria-label="Exemplo de intervenção" options={options} value={selected} onChange={setSelected} placeholder="Selecionar intervenção" /><Button disabled={!selected} onClick={add}>Adicionar</Button></div>
}
