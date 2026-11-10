import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useWorkOrderServices } from './providers/workOrderServiceContext'
import { ApiError } from '../../features/work-orders/infrastructure/api/ApiWorkOrderService'
import { Form } from '../../shared/ui/Form'
import { FormField } from '../../shared/ui/FormField'
import { TextField } from '../../shared/ui/TextField'
import { PageLayout } from '../../shared/ui/PageLayout'

export function ApiLogin() {
  const { login } = useWorkOrderServices()
  const client = useQueryClient()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()
  async function submit(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget)
    setPending(true)
    setError(undefined)
    try {
      // Remove dados de uma eventual sessão anterior antes de apresentar a nova.
      client.removeQueries({ queryKey: ['work-orders'] })
      client.removeQueries({ queryKey: ['interventions'] })
      await login(String(data.get('email') ?? '').trim(), String(data.get('password') ?? ''))
    } catch (failure) {
      setError(failure instanceof ApiError && failure.status === 401 ? 'Email ou palavra-passe incorretos.' : 'Não foi possível iniciar sessão. Verifica a ligação e tenta novamente.')
    } finally { setPending(false) }
  }
  return <PageLayout title="Iniciar sessão" description="Entre para consultar as ordens de serviço.">
    <Form title="Acesso ao AlarmeON" submitLabel="Entrar" loadingLabel="A entrar..." pending={pending} error={error} onSubmit={submit}>
      <FormField label="Email" required>{props => <TextField {...props} name="email" type="email" autoComplete="username" disabled={pending} />}</FormField>
      <FormField label="Palavra-passe" required>{props => <TextField {...props} name="password" type="password" autoComplete="current-password" disabled={pending} />}</FormField>
    </Form>
  </PageLayout>
}
