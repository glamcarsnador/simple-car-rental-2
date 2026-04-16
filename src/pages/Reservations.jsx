import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Calendar, Loader2, AlertCircle } from 'lucide-react'

function Reservations() {
  const [reservations, setReservations] = useState([])
  const [cars, setCars] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    car_id: '',
    client_id: '',
    start_date: '',
    end_date: '',
    status: 'pending'
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      setLoading(true)
      const [resRes, carsRes, clientsRes] = await Promise.all([
        supabase.from('reservations').select('*, cars(brand, model, plate_number), clients(full_name)').order('created_at', { ascending: false }),
        supabase.from('cars').select('id, brand, model, plate_number, status').eq('status', 'available'),
        supabase.from('clients').select('id, full_name')
      ])

      if (resRes.error) throw resRes.error
      if (carsRes.error) throw carsRes.error
      if (clientsRes.error) throw clientsRes.error

      setReservations(resRes.data)
      setCars(carsRes.data)
      setClients(clientsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.car_id || !formData.client_id || !formData.start_date || !formData.end_date) {
      alert('Please fill in all fields')
      return
    }

    try {
      setIsSaving(true)
      const { error } = await supabase.from('reservations').insert([formData])
      if (error) throw error
      
      // Reset form and refresh list
      setFormData({ car_id: '', client_id: '', start_date: '', end_date: '', status: 'pending' })
      await fetchData()
    } catch (error) {
      alert('Error saving reservation: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100 italic tracking-wide">Reservations</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and schedule car rental bookings.</p>
        </div>
      </header>

      {/* New Reservation Form */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
          <Plus size={16} className="text-blue-400" />
          New Reservation
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-medium ml-1">Car</label>
            {cars.length === 0 ? (
              <div className="flex items-center gap-2 text-[10px] text-amber-500/80 bg-amber-500/5 px-2 py-2 rounded border border-amber-500/20">
                <AlertCircle size={12} />
                Please add a car first
              </div>
            ) : (
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                value={formData.car_id}
                onChange={(e) => setFormData({ ...formData, car_id: e.target.value })}
              >
                <option value="">Select a car</option>
                {cars.map(car => (
                  <option key={car.id} value={car.id}>{car.brand} {car.model} ({car.plate_number})</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-medium ml-1">Client</label>
            {clients.length === 0 ? (
              <div className="flex items-center gap-2 text-[10px] text-amber-500/80 bg-amber-500/5 px-2 py-2 rounded border border-amber-500/20">
                <AlertCircle size={12} />
                Please add a client first
              </div>
            ) : (
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.full_name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-medium ml-1">Start Date</label>
            <input
              type="date"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-medium ml-1">End Date</label>
            <input
              type="date"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving || cars.length === 0 || clients.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Reservation'}
          </button>
        </form>
      </section>

      {/* Reservations Table */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Car</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic text-sm">
                    No reservations found. Add your first booking above.
                  </td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-200">{res.clients?.full_name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-200">
                        {res.cars?.brand} {res.cars?.model}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">
                        {res.cars?.plate_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(res.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(res.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                        res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        res.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-slate-700/50 text-slate-400 border-slate-600'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Reservations
