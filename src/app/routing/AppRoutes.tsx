import { Link, Route, Routes } from 'react-router'
import { WorkOrdersPage } from '../../features/work-orders/presentation/WorkOrdersPage'

export function AppRoutes() {
  return <Routes>
    <Route path="/" element={<WorkOrdersPage />} />
    <Route path="/ordens-servico" element={<WorkOrdersPage />} />
    <Route path="*" element={<main><h1>Página não encontrada</h1><p>O endereço indicado não corresponde a uma página disponível.</p><Link to="/">Voltar ao início</Link></main>} />
  </Routes>
}
