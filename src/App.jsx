import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Simple Car Rental
        </h1>
        <p className="text-zinc-400 text-lg">
          Welcome to your new multi-page dashboard. The foundation is ready.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 transition-colors">
            <h3 className="font-semibold text-blue-400 mb-2">Reservations</h3>
            <p className="text-sm text-zinc-500">Manage active and upcoming car rentals.</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-colors">
            <h3 className="font-semibold text-emerald-400 mb-2">Cars</h3>
            <p className="text-sm text-zinc-500">Inventory and status tracking for your fleet.</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-purple-400 mb-2">Clients</h3>
            <p className="text-sm text-zinc-500">Customer directory and relationship management.</p>
          </div>
        </div>

        <div className="pt-8">
          <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium border border-zinc-700">
            Basics Done • Waiting for Next Move
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
