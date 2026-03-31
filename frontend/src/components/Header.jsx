import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()
  const isEvaluation = location.pathname === '/evaluate'

  return (
    <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 3c0 0-1.5 1.5-3 3.5S6 11 6 13c0 3 2 5 4 5.5.5.2 1-.2 1-1V9a1 1 0 012 0v8.5c0 .8.5 1.2 1 1C16 18 18 16 18 13c0-2-1.5-4.5-3-6.5S12 3 12 3z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none tracking-tight">
                TB<span className="text-blue-400">Detect</span>
              </h1>
              <p className="text-slate-500 text-xs leading-none mt-0.5">ResNet50 AI Diagnostics</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            <Link
              to="/tool"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/tool'
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Diagnostic Tool
            </Link>
            <Link
              to="/evaluate"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/evaluate'
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Model Evaluation
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            For research & educational use only
          </span>
        </div>
      </div>
    </header>
  )
}
