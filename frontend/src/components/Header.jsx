import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, BarChart3, Home, Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Diagnostic Tool', href: '/tool', icon: Activity },
  { name: 'Model Evaluation', href: '/evaluate', icon: BarChart3 },
]

export default function Header() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hoveredLink, setHoveredLink] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-slate-950/85 backdrop-blur-2xl border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-10 h-10"
            >
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-md group-hover:bg-cyan-500/40 transition-all duration-300" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/50">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M12 3c0 0-1.5 1.5-3 3.5S6 11 6 13c0 3 2 5 4 5.5.5.2 1-.2 1-1V9a1 1 0 012 0v8.5c0 .8.5 1.2 1 1C16 18 18 16 18 13c0-2-1.5-4.5-3-6.5S12 3 12 3z"
                  />
                </svg>
              </div>
            </motion.div>

            <div>
              <h1 className="text-white font-black text-lg leading-none tracking-tight">
                TB<span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Detect</span>
              </h1>
              <p className="text-slate-500 text-[10px] leading-none mt-0.5 font-medium tracking-wider uppercase">
                ResNet50 · AI Diagnostics
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 group"
                >
                  {/* Background */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/25 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {!isActive && hoveredLink === link.href && (
                    <motion.div
                      layoutId="nav-hover"
                      className="absolute inset-0 bg-white/5 rounded-xl"
                      transition={{ duration: 0.15 }}
                    />
                  )}

                  <span className={`relative flex items-center gap-1.5 ${
                    isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                    {link.name}
                  </span>
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass text-xs font-medium text-slate-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Zap className="w-3 h-3 text-emerald-400" />
              System Online
            </motion.div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl glass-card border-white/10 text-slate-300 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden sticky top-16 z-40 overflow-hidden"
          >
            <div className="liquid-glass border-b border-white/8 px-4 py-4 space-y-1">
              {navLinks.map((link, i) => {
                const isActive = location.pathname === link.href
                const Icon = link.icon
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Link
                      to={link.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.name}
                      {isActive && (
                        <motion.div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" layoutId="mobile-dot" />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
