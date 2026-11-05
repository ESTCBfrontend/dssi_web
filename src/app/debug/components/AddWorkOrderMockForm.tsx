import { useRef, useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { Select } from '../../../shared/ui/Select'
import { useToast } from '../../../shared/ui/ToastSnackbar'
import type { MockWorkOrderControls } from '../../../features/work-orders/infrastructure/mock/services/MockWorkOrderControls'
import styles from '../DebugLayer.module.css'

type ExampleOption = { value: string; label: string }

export function AddWorkOrderMockForm({ controls, options }: { controls: MockWorkOrderControls; options: ExampleOption[] }) {
  const [exampleId, setExampleId] = useState<string | null>(null)
  const { show, clear } = useToast()
  const nextToast = useRef(0)

  const add = () => {
    if (!exampleId) return
    clear()
    try {
      const added = controls.addExample(exampleId)
      show({ id: `add-order-${++nextToast.current}`, message: added ? 'OS adicionada.' : 'Esta OS já foi adicionada.', tone: added ? 'success' : 'info', durationMs: 5000 })
    } catch {
      show({ id: `add-order-${++nextToast.current}`, message: 'Não foi possível adicionar a OS selecionada.', tone: 'danger', durationMs: 5000 })
    }
  }

  return <div className={styles.submenu}>
    <Select aria-label="Exemplo de ordem de serviço" options={options} value={exampleId} onChange={setExampleId} placeholder="Selecionar estado" />
    <Button disabled={!exampleId} onClick={add}>Adicionar</Button>
  </div>
}
