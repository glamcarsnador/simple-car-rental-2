import Navbar from '../components/Navbar'

function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans antialiased text-slate-200">
      <Navbar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}

export default MainLayout
