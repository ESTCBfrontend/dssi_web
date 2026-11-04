import { useRef, useState } from 'react'
import { Button } from '../../../shared/ui/Button'
import { Select } from '../../../shared/ui/Select'
import { useToast } from '../../../shared/ui/ToastSnackbar'
import type { MockWorkOrderControls } from '../../../features/work-orders/infrastructure/mock/services/MockWorkOrderControls'
import styles from '../DebugLayer.module.css'

type ExampleOption = { value: string; label: string }

export function AddWorkOrderMockForm({ controls, options }: { controls: MockWorkOrderControls; options: ExampleOption[] }) {
  const [exampleId, setExampleId] = useState<string | null>(null)
  const { show } = useToast()
  const nextToast = useRef(0)

  const add = () => {
    if (!exampleId) return
    try {
      controls.addExample(exampleId)
      show({ id: `add-order-${++nextToast.current}`, message: 'OS adicionada.', tone: 'success' })
    } catch {
      show({ id: `add-order-${++nextToast.current}`, message: 'Não foi possível adicionar a OS selecionada.', tone: 'danger' })
    }
  }

  return <div className={styles.submenu}>
    <Select aria-label="Exemplo de ordem de serviço" options={options} value={exampleId} onChange={setExampleId} placeholder="Selecionar estado" />
    <Button disabled={!exampleId} onClick={add}>Adicionar</Button>
  </div>
}
