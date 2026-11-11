import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { apiBaseUrl } from '../../../features/work-orders/infrastructure/api/ApiWorkOrderService'
import { Button } from '../../../shared/ui/Button'
import { useWorkOrderServices } from '../../work-orders/providers/workOrderServiceContext'
import styles from '../DebugLayer.module.css'

export type DebugAccount = { label: string; email: string; password: string }
type AccountFile = { apiUrl: string; accounts: DebugAccount[] }
type PreviewAccount = { id: string; label: string }
const testApiUrl = 'https://alarmeon-backend-962ded164ecf.herokuapp.com/api/v1'

// Ficheiros locais ignorados pelo Git; este módulo só é carregado pelo Debug Menu em desenvolvimento.
const files = import.meta.glob<{ default: AccountFile }>('../accounts/*.local.json', { eager: true })

export function DebugAccounts({ onSuccess, accountFiles = Object.values(files).map(file => file.default), preview = import.meta.env.VITE_VERCEL_ENV === 'preview' }: {
  onSuccess: () => void
  accountFiles?: AccountFile[]
  preview?: boolean
}) {
  const { login, loginWithPreviewAccount } = useWorkOrderServices()
  const client = useQueryClient()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()
  const [previewAccounts, setPreviewAccounts] = useState<PreviewAccount[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(() => preview && apiBaseUrl === testApiUrl)
  const accounts = accountFiles
    .filter(file => file.apiUrl?.replace(/\/$/, '') === apiBaseUrl && Array.isArray(file.accounts))
    .flatMap(file => file.accounts)
    .filter(account => typeof account.label === 'string' && account.label.trim() && typeof account.email === 'string' && account.email.trim() && typeof account.password === 'string' && account.password)

  useEffect(() => {
    if (!preview || apiBaseUrl !== testApiUrl) return
    const controller = new AbortController()
    fetch('/api/debug-test-accounts', { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('Contas indisponíveis.')
        const data: { accounts?: unknown } = await response.json()
        if (!Array.isArray(data.accounts)) throw new Error('Resposta inválida.')
        setPreviewAccounts(data.accounts.filter((account): account is PreviewAccount => account && typeof account.id === 'string' && typeof account.label === 'string'))
      })
      .catch(() => { if (!controller.signal.aborted) setError('Não foi possível carregar as contas da preview.') })
      .finally(() => { if (!controller.signal.aborted) setLoadingAccounts(false) })
    return () => controller.abort()
  }, [preview])

  async function signIn(account: DebugAccount) {
    setPending(true)
    setError(undefined)
    try {
      client.removeQueries({ queryKey: ['work-orders'] })
      client.removeQueries({ queryKey: ['interventions'] })
      await login(account.email, account.password)
      onSuccess()
    } catch {
      setError('Não foi possível iniciar sessão com esta conta. Verifica a conta e a ligação à API.')
    } finally { setPending(false) }
  }

  async function signInPreview(account: PreviewAccount) {
    setPending(true)
    setError(undefined)
    try {
      client.removeQueries({ queryKey: ['work-orders'] })
      client.removeQueries({ queryKey: ['interventions'] })
      await loginWithPreviewAccount(account.id)
      onSuccess()
    } catch {
      setError('Não foi possível iniciar sessão com esta conta. Verifica a conta e a ligação à API.')
    } finally { setPending(false) }
  }

  return <div className={styles.submenu}>
    {!loadingAccounts && accounts.length === 0 && previewAccounts.length === 0 && !error && <p>Não existem contas de teste configuradas para esta API. Consulta o README.</p>}
    {accounts.map((account, index) => <Button key={`${account.email}-${index}`} variant="secondary" fullWidth disabled={pending}
      onClick={() => { void signIn(account) }}>Entrar como {account.label}</Button>)}
    {previewAccounts.map(account => <Button key={`preview-${account.id}`} variant="secondary" fullWidth disabled={pending}
      onClick={() => { void signInPreview(account) }}>Entrar como {account.label}</Button>)}
    {loadingAccounts && <p role="status">A carregar contas...</p>}
    {pending && <p role="status">A iniciar sessão...</p>}
    {error && <p role="alert">{error}</p>}
  </div>
}
