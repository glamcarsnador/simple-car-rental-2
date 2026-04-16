import { NavLink } from 'react-router-dom'
import { Car, Users, CalendarDays } from 'lucide-react'

function Navbar() {
  const navItems = [
    { name: 'Reservations', path: '/', icon: CalendarDays },
    { name: 'Cars', path: '/cars', icon: Car },
    { name: 'Clients', path: '/clients', icon: Users },
  ]

  return (
    <nav className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-slate-200 text-lg font-medium tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-900/30 border border-blue-500/20 rounded flex items-center justify-center text-blue-400">
            CR
          </span>
          Car Rental
        </h2>
      </div>

      <div className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-slate-800 text-blue-400 shadow-sm border-l-2 border-blue-500 -ml-px'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-400">
            JD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-300">John Doe</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Administrator</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
