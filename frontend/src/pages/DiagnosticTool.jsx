import { useState, useCallback } from 'react'
import Header from '../components/Header'
import UploadSection from '../components/UploadSection'
import ResultPanel from '../components/ResultPanel'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const API_BASE = '/api'

export default function DiagnosticTool() {
  const [status, setStatus] = useState('idle') // idle | uploading | loading | done | error
  const [result, setResult] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState(null)

  const handleFile = useCallback(async (file) => {
    if (!file) return

    // Local preview
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
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        let detail = `Server error: ${res.status}`
        try {
          const errData = JSON.parse(text)
          if (errData.detail) detail = errData.detail
        } catch { /* not JSON */ }
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
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-transparent z-[-2]">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/50 to-slate-950" />
      </div>

      <Header />

      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-semibold tracking-wide uppercase">
            <ArrowLeft className="w-4 h-4" /> Back to Overview
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="glass-panel p-6 sm:p-12 rounded-[2rem] border-cyan-500/20 shadow-[-10px_-10px_30px_rgba(255,255,255,0.02),10px_10px_30px_rgba(0,0,0,0.5)]"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Clinical Inference Engine</h2>
            <p className="text-slate-400 text-lg font-light">Upload a posterior-anterior (PA) chest radiograph to initiate the automated screening protocol and Grad-CAM analysis.</p>
          </div>

          <UploadSection
            onFile={handleFile}
            status={status}
            preview={preview}
            fileName={fileName}
            onReset={handleReset}
          />

          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 glass-card border-rose-500/30 bg-rose-500/5 p-5 flex items-start gap-4"
            >
              <svg className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-rose-300">Diagnostic Pipeline Error</p>
                <p className="text-rose-400/80 mt-1 whitespace-pre-line leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}

          {status === 'done' && result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 border-t border-white/5 pt-16"
            >
              <ResultPanel result={result} />
            </motion.div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
