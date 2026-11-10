import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { apiBaseUrl } from '../../../features/work-orders/infrastructure/api/ApiWorkOrderService'
import { Button } from '../../../shared/ui/Button'
import { useWorkOrderServices } from '../../work-orders/providers/workOrderServiceContext'
import styles from '../DebugLayer.module.css'

export type DebugAccount = { label: string; email: string; password: string }
type AccountFile = { apiUrl: string; accounts: DebugAccount[] }

// Ficheiros locais ignorados pelo Git; este módulo só é carregado pelo Debug Menu em desenvolvimento.
const files = import.meta.glob<{ default: AccountFile }>('../accounts/*.local.json', { eager: true })

export function DebugAccounts({ onSuccess, accountFiles = Object.values(files).map(file => file.default) }: {
  onSuccess: () => void
  accountFiles?: AccountFile[]
}) {
  const { login } = useWorkOrderServices()
  const client = useQueryClient()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()
  const accounts = accountFiles
    .filter(file => file.apiUrl?.replace(/\/$/, '') === apiBaseUrl && Array.isArray(file.accounts))
    .flatMap(file => file.accounts)
    .filter(account => typeof account.label === 'string' && account.label.trim() && typeof account.email === 'string' && account.email.trim() && typeof account.password === 'string' && account.password)

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

  return <div className={styles.submenu}>
    {accounts.length === 0 && <p>Não existem contas locais configuradas para esta API. Consulta o README.</p>}
    {accounts.map((account, index) => <Button key={`${account.email}-${index}`} variant="secondary" fullWidth disabled={pending}
      onClick={() => { void signIn(account) }}>Entrar como {account.label}</Button>)}
    {pending && <p role="status">A iniciar sessão...</p>}
    {error && <p role="alert">{error}</p>}
  </div>
}
