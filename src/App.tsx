import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './data/store'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Search } from './pages/Search'
import { Vacancies } from './pages/Vacancies'
import { VacancyDetail } from './pages/VacancyDetail'
import { Candidates } from './pages/Candidates'
import { CandidateDetail } from './pages/CandidateDetail'
import { Clients } from './pages/Clients'
import { Pipeline } from './pages/Pipeline'

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="/vacancies/:id" element={<VacancyDetail />} />
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}
