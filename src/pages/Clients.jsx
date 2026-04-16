import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Trash2, Loader2, User as UserIcon } from 'lucide-react'

function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  })

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!formData.full_name || !formData.phone) return

    try {
      setIsSaving(true)
      const { error } = await supabase.from('clients').insert([formData])
      if (error) throw error
      setFormData({ full_name: '', phone: '' })
      await fetchClients()
      setToastMessage('Client saved successfully!')
      setTimeout(() => setToastMessage(''), 3000)
    } catch (error) {
      alert('Error saving client: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this client?')) return

    try {
      const { error } = await supabase
        .from('clients')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      await fetchClients()
    } catch (error) {
      alert('Error deleting client: ' + error.message)
    }
  }



  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-semibold text-slate-100 italic tracking-wide">Clients</h1>
        <p className="text-slate-400 text-sm mt-1">Customer directory and relationship management.</p>
        {loading && (
          <div className="flex items-center gap-2 text-[10px] text-blue-400 font-medium animate-pulse mt-1">
            <Loader2 size={10} className="animate-spin" />
            Syncing with database...
          </div>
        )}
      </header>

      <div className={loading ? 'opacity-60 pointer-events-none transition-all duration-300' : 'transition-all duration-300'}>


      {/* Add Client Form */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
          <Plus size={16} className="text-blue-400" />
          Register New Client
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-medium ml-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-medium ml-1">Phone Number</label>
            <input
              type="text"
              placeholder="e.g. +1 555-0123"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Save Client'}
          </button>
        </form>
      </section>

      {/* Clients Table */}
      <section className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clients.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500 italic text-sm">
                    No clients found. Register your first customer above.
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                          <UserIcon size={16} />
                        </div>
                        <div className="text-sm font-medium text-slate-200">{client.full_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {client.phone}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(client.id)}
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-900/90 border border-emerald-500/50 text-emerald-100 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-50">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

export default Clients
