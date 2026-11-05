import { Link, Route, Routes } from 'react-router'
import { CreateWorkOrderPage } from '../../features/work-orders/presentation/pages/create/CreateWorkOrderPage'
import { WorkOrdersPage } from '../../features/work-orders/presentation/pages/list/WorkOrdersPage'
import { WorkOrderDetailPage } from '../../features/work-orders/presentation/pages/detail/WorkOrderDetailPage'

export function AppRoutes() {
  return <Routes>
    <Route path="/" element={<WorkOrdersPage />} />
    <Route path="/ordens-servico" element={<WorkOrdersPage />} />
    <Route path="/ordens-servico/nova" element={<CreateWorkOrderPage />} />
    <Route path="/ordens-servico/:id" element={<WorkOrderDetailPage />} />
    <Route path="*" element={<main><h1>Página não encontrada</h1><p>O endereço indicado não corresponde a uma página disponível.</p><Link to="/">Voltar ao início</Link></main>} />
  </Routes>
}
