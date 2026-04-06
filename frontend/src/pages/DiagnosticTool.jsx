import { useState, useCallback } from 'react'
import Header from '../components/Header'
import UploadSection from '../components/UploadSection'
import ResultPanel from '../components/ResultPanel'
import Footer from '../components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Cpu, Shield, Zap, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const API_BASE = '/api'

const infoCards = [
  { icon: Cpu, label: 'ResNet50', sub: 'Deep Neural Network', color: 'cyan' },
  { icon: Zap, label: '<2s', sub: 'Inference Time', color: 'emerald' },
  { icon: Shield, label: '98.2%', sub: 'Test Accuracy', color: 'violet' },
]

export default function DiagnosticTool() {
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState(null)

  const handleFile = useCallback(async (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)

    setFileName(file.name)
    setStatus('loading')
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch(`${API_BASE}/predict`, { method: 'POST', body: formData })
      if (!res.ok) {
        const text = await res.text()
        let detail = `Server error: ${res.status}`
        try { const d = JSON.parse(text); if (d.detail) detail = d.detail } catch {}
        throw new Error(detail)
      }
      const data = await res.json()
      setResult(data)
      setStatus('done')
    } catch (err) {
      const msg = err.message || ''
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch')) {
        setError('Cannot connect to the backend server. Make sure it is running:\n\ncd backend && uvicorn backend.main:app --reload\n\n(run from the project root)')
      } else {
        setError(msg)
      }
      setStatus('error')
    }
  }, [])

  const handleReset = useCallback(() => {
    setStatus('idle')
    setResult(null)
    setPreview(null)
    setError(null)
    setFileName(null)
  }, [])

  return (
    <div className="relative w-full min-h-screen flex flex-col font-sans text-slate-100 bg-slate-950 overflow-x-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-semibold tracking-wide uppercase"
          >
            <motion.div
              className="w-7 h-7 rounded-lg liquid-glass flex items-center justify-center"
              whileHover={{ x: -3 }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </motion.div>
            Back to Overview
          </Link>
        </motion.div>

        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-2">
              Clinical{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Inference Engine
              </span>
            </h1>
            <p className="text-slate-400 font-light">
              Upload a PA chest radiograph to initiate automated TB screening with Grad-CAM analysis
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3">
            {infoCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1, type: 'spring', bounce: 0.4 }}
                  className="liquid-glass rounded-xl px-4 py-3 hidden sm:flex items-center gap-2.5 cursor-default"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Icon className={`w-4 h-4 ${
                    card.color === 'cyan' ? 'text-cyan-400' :
                    card.color === 'emerald' ? 'text-emerald-400' : 'text-violet-400'
                  }`} />
                  <div>
                    <p className="text-white font-bold text-sm leading-none">{card.label}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{card.sub}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring', bounce: 0.2 }}
          className="liquid-glass rounded-[2rem] border border-cyan-500/15 overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}
        >
          {/* Card header strip */}
          <div className="border-b border-white/5 px-8 py-5 flex items-center gap-3">
            <div className="flex gap-1.5">
              {['bg-rose-500', 'bg-yellow-500', 'bg-emerald-500'].map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${c} opacity-60`} />
              ))}
            </div>
            <div className="flex-1 text-center">
              <span className="text-slate-500 text-xs font-mono">TB-DETECT · INFERENCE MODULE v2.0</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ready
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <UploadSection
              onFile={handleFile}
              status={status}
              preview={preview}
              fileName={fileName}
              onReset={handleReset}
            />

            {/* Error */}
            <AnimatePresence>
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ type: 'spring', bounce: 0.3 }}
                  className="mt-8"
                >
                  <div className="liquid-glass border border-rose-500/30 rounded-2xl p-6 flex items-start gap-4"
                    style={{ background: 'rgba(244,63,94,0.05)' }}>
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                    </div>
                    <div>
                      <p className="font-bold text-rose-300 mb-1">Diagnostic Pipeline Error</p>
                      <p className="text-rose-400/80 text-sm whitespace-pre-line leading-relaxed">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {status === 'done' && result && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, type: 'spring', bounce: 0.2 }}
                  className="mt-16 border-t border-white/5 pt-16"
                >
                  <ResultPanel result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
