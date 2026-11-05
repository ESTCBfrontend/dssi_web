import type { WorkOrderStatus } from '../../domain/workOrder'

export const statusLabels: Record<WorkOrderStatus, string> = {
  NOVA: 'Nova', ATRIBUIDA: 'Atribuída', EM_EXECUCAO: 'Em execução',
  CONCLUIDA_TECNICAMENTE: 'Concluída tecnicamente', VALIDADA: 'Validada', PENDENTE: 'Pendente', CANCELADA: 'Cancelada',
}
export const statusTones: Record<WorkOrderStatus, 'neutral' | 'info' | 'success' | 'warning' | 'danger'> = {
  NOVA: 'neutral', ATRIBUIDA: 'info', EM_EXECUCAO: 'info', CONCLUIDA_TECNICAMENTE: 'success', VALIDADA: 'success', PENDENTE: 'warning', CANCELADA: 'danger',
}
export const priorityOptions = [
  { value: 'BAIXA', label: 'Baixa' },
  { value: 'NORMAL', label: 'Normal' },
  { value: 'ALTA', label: 'Alta' },
] as const

export function formatPriority(value: string): string {
  return priorityOptions.find(option => option.value === value)?.label ?? value
}

export function formatDate(value: string | null): string {
  if (!value) return 'Sem data'
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`)
  return Number.isNaN(date.getTime()) ? 'Data inválida' : new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium', timeZone: 'UTC' }).format(date)
}
