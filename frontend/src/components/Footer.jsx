import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Activity, BarChart3 } from 'lucide-react'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative border-t border-white/5 mt-12 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M12 3c0 0-1.5 1.5-3 3.5S6 11 6 13c0 3 2 5 4 5.5.5.2 1-.2 1-1V9a1 1 0 012 0v8.5c0 .8.5 1.2 1 1C16 18 18 16 18 13c0-2-1.5-4.5-3-6.5S12 3 12 3z"
                />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">TB<span className="text-cyan-400">Detect</span></p>
              <p className="text-slate-600 text-[10px] mt-0.5">ResNet50 · AI Diagnostics</p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {[
              { to: '/tool', icon: Activity, label: 'Diagnostic Tool' },
              { to: '/evaluate', icon: BarChart3, label: 'Evaluation' },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-slate-300 text-xs font-medium transition-colors hover:bg-white/5"
              >
                <Icon className="w-3 h-3" />
                {label}
              </Link>
            ))}
          </div>

          {/* Stack info */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/40 font-mono">ResNet50</span>
            <span className="text-slate-700">·</span>
            <span className="px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/40 font-mono">TF 2.15</span>
            <span className="text-slate-700">·</span>
            <span className="px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700/40 font-mono">FastAPI</span>
          </div>
        </div>

        <div className="border-t border-white/5 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            For educational & research use only · Not for clinical diagnosis
          </p>
          <p className="text-slate-700 text-xs font-mono">
            © 2025 TB-Detect · ResNet50
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
