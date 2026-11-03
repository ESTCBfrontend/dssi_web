import type { AlertTone } from '../AlertIcon'
export interface ToastMessage { id: string; message: string; title?: string; tone?: AlertTone; durationMs?: number | null; action?: { label: string; onPress: () => void }; dismissible?: boolean }
export function validateToast(toast: ToastMessage) {
  if (!toast?.id.trim() || !toast.message.trim() || (toast.title !== undefined && !toast.title.trim()) || (toast.action && !toast.action.label.trim()) || (toast.durationMs != null && (!Number.isFinite(toast.durationMs) || toast.durationMs <= 0)) || (toast.tone !== undefined && !['info', 'success', 'warning', 'danger'].includes(toast.tone))) throw new Error('ToastSnackbar requer identificador, textos e duração válidos.')
}
