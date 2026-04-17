import { HashRouter, Routes, Route } from 'react-router-dom' // 1. Changed import
import MainLayout from './layouts/MainLayout'
import Reservations from './pages/Reservations'
import Cars from './pages/Cars'
import Clients from './pages/Clients'

function App() {
  return (
    // 2. Swapped BrowserRouter for HashRouter
    // 3. Removed basename="/simple-car-rental-2" (Not needed for HashRouter)
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Reservations />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/clients" element={<Clients />} />
        </Routes>
      </MainLayout>
    </HashRouter>
  )
}

export default App