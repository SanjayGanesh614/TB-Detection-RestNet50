import { useState, useCallback } from 'react'
import Header from './components/Header'
import UploadSection from './components/UploadSection'
import ResultPanel from './components/ResultPanel'
import Footer from './components/Footer'

import Hero from './components/Hero'
import Scene3D from './components/Scene3D'
import EducationalSection from './components/EducationalSection'

const API_BASE = '/api'

export default function App() {
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
    <div className="relative w-full min-h-screen flex flex-col font-sans text-slate-100 overflow-x-hidden">
      {/* 3D Background */}
      <Scene3D />

      <Header />

      {/* Parallax Hero Section */}
      <Hero onStart={() => document.getElementById('inference-tool')?.scrollIntoView({ behavior: 'smooth' })} />

      {/* Educational Walkthrough */}
      <EducationalSection />

      {/* Main Inference Tool */}
      <main id="inference-tool" className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        <div className="glass-panel p-6 sm:p-12 rounded-[2rem] border-cyan-500/20 shadow-[-10px_-10px_30px_rgba(255,255,255,0.02),10px_10px_30px_rgba(0,0,0,0.5)]">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">AI Diagnostic Interface</h2>
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
            <div className="mt-8 glass-card border-rose-500/30 bg-rose-500/5 p-5 flex items-start gap-4 animate-slide-up">
              <svg className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-rose-300">Diagnostic Pipeline Error</p>
                <p className="text-rose-400/80 mt-1 whitespace-pre-line leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {status === 'done' && result && (
            <div className="mt-16 border-t border-white/5 pt-16">
              <ResultPanel result={result} />
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  )
}
