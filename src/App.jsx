import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Reservations from './pages/Reservations'
import Cars from './pages/Cars'
import Clients from './pages/Clients'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Reservations />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/clients" element={<Clients />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
