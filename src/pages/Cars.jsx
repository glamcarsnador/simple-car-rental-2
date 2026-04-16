import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Loader2, Car as CarIcon } from 'lucide-react'

function Cars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    plate_number: ''
  })

  useEffect(() => {
    fetchCars()
  }, [])

  async function fetchCars() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCars(data)
    } catch (error) {
      console.error('Error fetching cars:', error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.brand || !formData.model || !formData.plate_number) return

    try {
      setIsSaving(true)
      const { error } = await supabase.from('cars').insert([formData])
      if (error) throw error
      setFormData({ brand: '', model: '', plate_number: '' })
      await fetchCars()
    } catch (error) {
      alert('Error saving car: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this car?')) return

    try {
      const { error } = await supabase
        .from('cars')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      await fetchCars()
    } catch (error) {
      alert('Error deleting car: ' + error.message)
    }
  }



  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100 italic tracking-wide">Cars</h1>
        <p className="text-slate-400 text-sm mt-1">Inventory and status tracking for the fleet.</p>
        {loading && (
          <div className="flex items-center gap-2 text-[10px] text-blue-400 font-medium animate-pulse mt-1">
            <Loader2 size={10} className="animate-spin" />
            Syncing with database...
          </div>
        )}
      </header>

      <div className={loading ? 'opacity-60 pointer-events-none transition-all duration-300' : 'transition-all duration-300'}>


      {/* Add Car Form */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
          <Plus size={16} className="text-blue-400" />
          Add New Vehicle
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-medium ml-1">Brand</label>
            <input
              type="text"
              placeholder="e.g. Toyota"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-medium ml-1">Model</label>
            <input
              type="text"
              placeholder="e.g. Camry"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-medium ml-1">Plate Number</label>
            <input
              type="text"
              placeholder="e.g. ABC-1234"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={formData.plate_number}
              onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Vehicle'}
          </button>
        </form>
      </section>

      {/* Cars Table */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plate Number</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {cars.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic text-sm">
                    No vehicles found. Register your first car above.
                  </td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400">
                          <CarIcon size={16} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-200">{car.brand}</div>
                          <div className="text-xs text-slate-500">{car.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400 uppercase tracking-wider">
                      {car.plate_number}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${
                        car.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-slate-700/50 text-slate-400 border-slate-600'
                      }`}>
                        {car.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      </div>
    </div>
  )
}

export default Cars
