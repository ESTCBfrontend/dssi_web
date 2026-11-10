import { Link, Route, Routes } from 'react-router'
import { CreateWorkOrderPage } from '../../features/work-orders/presentation/pages/create/CreateWorkOrderPage'
import { WorkOrdersPage } from '../../features/work-orders/presentation/pages/list/WorkOrdersPage'
import { WorkOrderDetailPage } from '../../features/work-orders/presentation/pages/detail/WorkOrderDetailPage'
import { EditWorkOrderPage } from '../../features/work-orders/presentation/pages/edit/EditWorkOrderPage'
import { useDataSource } from '../data-source/dataSourceContext'
import { useWorkOrderServices } from '../work-orders/providers/workOrderServiceContext'
import { ApiLogin } from '../work-orders/ApiLogin'

export function AppRoutes() {
  const { source } = useDataSource()
  const { apiService } = useWorkOrderServices()
  if (source === 'api' && !apiService) return <ApiLogin />
  return <Routes>
    <Route path="/" element={<WorkOrdersPage />} />
    <Route path="/ordens-servico" element={<WorkOrdersPage />} />
    <Route path="/ordens-servico/nova" element={<CreateWorkOrderPage />} />
    <Route path="/ordens-servico/:id/editar" element={<EditWorkOrderPage />} />
    <Route path="/ordens-servico/:id" element={<WorkOrderDetailPage />} />
    <Route path="*" element={<main><h1>Página não encontrada</h1><p>O endereço indicado não corresponde a uma página disponível.</p><Link to="/">Voltar ao início</Link></main>} />
  </Routes>
}
