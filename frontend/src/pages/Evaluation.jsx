import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Activity, BrainCircuit, BarChart3, Award, AlertCircle, TrendingUp, Database, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Scene3D from '../components/Scene3D'

const API_BASE = '/api'

function useCountUp(target, isVisible, duration = 1500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!isVisible) return
    const n = typeof target === 'number' ? target : parseFloat(target) || 0
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(n * eased)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [isVisible, target, duration])
  return value
}

function MetricCard({ label, value, icon: Icon, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const displayValue = useCountUp(value, isVisible)

  const getScoreColor = (val) => {
    const n = typeof val === 'number' ? val : parseFloat(val) || 0
    if (n >= 0.95) return { name: 'emerald', from: '#34d399', to: '#10b981', label: 'Excellent', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.3)' }
    if (n >= 0.90) return { name: 'cyan', from: '#22d3ee', to: '#06b6d4', label: 'Good', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.3)' }
    if (n >= 0.80) return { name: 'amber', from: '#fbbf24', to: '#f59e0b', label: 'Moderate', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.3)' }
    return { name: 'rose', from: '#f87171', to: '#ef4444', label: 'Needs Work', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)' }
  }

  const sc = getScoreColor(value)
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0
  const circumference = 2 * Math.PI * 22
  const offset = circumference - (numValue * circumference)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, type: 'spring', bounce: 0.3 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative overflow-hidden rounded-3xl cursor-default group"
      style={{ background: sc.bg, border: `1px solid ${sc.border}`, boxShadow: `0 4px 20px rgba(0,0,0,0.3)` }}
    >
      {/* Animated glow */}
      <motion.div
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: sc.from }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between mb-5">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: `linear-gradient(135deg, ${sc.from}30, ${sc.to}20)`, border: `1px solid ${sc.from}40` }}
          >
            <Icon className="w-6 h-6" style={{ color: sc.from }} />
          </motion.div>
          <span
            className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{ background: `${sc.from}15`, border: `1px solid ${sc.from}30`, color: sc.from }}
          >
            {sc.label}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
            <motion.p
              className="text-4xl font-black leading-none"
              style={{ color: sc.from }}
            >
              {(displayValue * 100).toFixed(1)}%
            </motion.p>
          </div>

          {/* Mini ring */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="22" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <defs>
                <linearGradient id={`metric-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={sc.from} />
                  <stop offset="100%" stopColor={sc.to} />
                </linearGradient>
              </defs>
              <circle
                cx="25" cy="25" r="22"
                fill="none"
                stroke={`url(#metric-${label})`}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={isVisible ? offset : circumference}
                style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold" style={{ color: sc.from }}>
                {(numValue * 100).toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full bg-slate-800/60 rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${sc.from}80, ${sc.from})` }}
            initial={{ width: 0 }}
            animate={isVisible ? { width: `${numValue * 100}%` } : { width: 0 }}
            transition={{ duration: 1.5, delay: delay + 0.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>
    </motion.div>
  )
}

function ConfusionMatrixCard({ data }) {
  if (!data) return null
  const [tn, fp, fn, tp] = data
  const total = tn + fp + fn + tp

  const cells = [
    { label: 'True Negative', value: tn, from: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.3)', textColor: '#34d399' },
    { label: 'False Positive', value: fp, from: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)', textColor: '#f87171' },
    { label: 'False Negative', value: fn, from: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.3)', textColor: '#fbbf24' },
    { label: 'True Positive', value: tp, from: '#22d3ee', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.3)', textColor: '#22d3ee' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="liquid-glass rounded-3xl border border-cyan-500/20 p-7"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
        </div>
        Confusion Matrix
      </h3>

      <div className="overflow-x-auto">
        <div className="min-w-[320px]">
          {/* Column headers */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="text-slate-600 text-xs font-medium text-center">Predicted →</div>
            <div className="text-emerald-400 text-xs font-bold text-center uppercase tracking-wider">Normal</div>
            <div className="text-rose-400 text-xs font-bold text-center uppercase tracking-wider">Tuberculosis</div>
          </div>

          {/* Rows */}
          {[
            { actual: 'Normal', cells: [cells[0], cells[1]], color: 'text-emerald-400' },
            { actual: 'TB', cells: [cells[2], cells[3]], color: 'text-rose-400' },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 mb-2 items-center">
              <div className={`text-xs font-bold text-right pr-3 ${row.color} uppercase tracking-wide`}>
                {row.actual} →
              </div>
              {row.cells.map((cell, j) => (
                <motion.div
                  key={j}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-2xl text-center"
                  style={{ background: cell.bg, border: `1px solid ${cell.border}` }}
                >
                  <p className="text-2xl font-black leading-none mb-1" style={{ color: cell.textColor }}>
                    {cell.value}
                  </p>
                  <p className="text-slate-500 text-[10px] font-medium">{cell.label}</p>
                  <p className="text-slate-600 text-[10px] mt-0.5">{((cell.value / total) * 100).toFixed(1)}%</p>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-4 justify-between text-xs text-slate-500">
        <span>Total Samples: <span className="text-slate-300 font-bold">{total}</span></span>
        <span>Overall Accuracy: <span className="text-emerald-300 font-bold">{((tn + tp) / total * 100).toFixed(1)}%</span></span>
        <span>Error Rate: <span className="text-rose-300 font-bold">{((fp + fn) / total * 100).toFixed(1)}%</span></span>
      </div>
    </motion.div>
  )
}

function VisualizationCard({ title, image, icon: Icon, color = 'cyan' }) {
  if (!image) return null
  const [enlarged, setEnlarged] = useState(false)
  const accentFrom = color === 'cyan' ? '#22d3ee' : '#a78bfa'

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="liquid-glass rounded-3xl border overflow-hidden group cursor-pointer"
        style={{ borderColor: `${accentFrom}25` }}
        onClick={() => setEnlarged(true)}
      >
        <div className="px-6 py-4 flex items-center gap-3 border-b"
          style={{ background: `${accentFrom}08`, borderColor: `${accentFrom}15` }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${accentFrom}20`, border: `1px solid ${accentFrom}30` }}>
            <Icon className="w-4 h-4" style={{ color: accentFrom }} />
          </div>
          <h3 className="text-base font-bold" style={{ color: accentFrom }}>{title}</h3>
          <span className="ml-auto text-slate-600 text-xs flex items-center gap-1 group-hover:text-slate-400 transition-colors">
            Click to expand
          </span>
        </div>
        <div className="p-4 bg-black/20">
          <div className="rounded-2xl overflow-hidden relative">
            <img src={`${API_BASE}${image}`} alt={title} className="w-full h-auto transition-transform duration-500 group-hover:scale-102" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2 text-white text-sm font-semibold">
                Click to expand
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {enlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setEnlarged(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="liquid-glass max-w-4xl w-full rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: accentFrom }} />
                  <h4 className="text-white font-bold">{title}</h4>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  onClick={() => setEnlarged(false)}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center transition-all text-slate-400"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <div className="p-6 bg-black/40">
                <img src={`${API_BASE}${image}`} alt={title} className="w-full rounded-2xl shadow-2xl" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SHAPCard({ summaryPlot, samplePredictions }) {
  if (!summaryPlot && !samplePredictions) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="liquid-glass rounded-3xl border border-violet-500/20 overflow-hidden p-7"
    >
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
          <BrainCircuit className="w-5 h-5 text-violet-400" />
        </div>
        SHAP Explainability
      </h3>
      <p className="text-slate-400 text-sm mb-6 ml-12">Understanding which features the model focuses on for predictions</p>

      <div className="grid md:grid-cols-2 gap-5">
        {summaryPlot && (
          <div className="rounded-2xl overflow-hidden bg-black/30 border border-violet-500/15">
            <div className="px-4 py-2.5 bg-violet-500/10 border-b border-violet-500/15">
              <p className="text-violet-300 text-xs font-bold uppercase tracking-wider">Summary Plot</p>
            </div>
            <div className="p-3">
              <img src={`${API_BASE}${summaryPlot}`} alt="SHAP Summary" className="w-full rounded-xl" />
            </div>
          </div>
        )}
        {samplePredictions && (
          <div className="rounded-2xl overflow-hidden bg-black/30 border border-violet-500/15">
            <div className="px-4 py-2.5 bg-violet-500/10 border-b border-violet-500/15">
              <p className="text-violet-300 text-xs font-bold uppercase tracking-wider">Sample Predictions</p>
            </div>
            <div className="p-3">
              <img src={`${API_BASE}${samplePredictions}`} alt="SHAP Sample Predictions" className="w-full rounded-xl" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function DatasetCard({ info }) {
  if (!info) return null

  const items = [
    { label: 'Total Samples', value: info.total, color: '#22d3ee' },
    { label: 'Normal X-rays', value: info.normal_count, color: '#34d399' },
    { label: 'TB X-rays', value: info.tb_count, color: '#f87171' },
    { label: 'Test Split', value: `${(info.test_split * 100).toFixed(0)}%`, color: '#a78bfa', raw: true },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="liquid-glass rounded-3xl border border-white/8 p-7"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <Database className="w-5 h-5 text-blue-400" />
        </div>
        Dataset Information
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: 'spring', bounce: 0.4 }}
            whileHover={{ scale: 1.05, y: -3 }}
            className="text-center p-5 rounded-2xl cursor-default"
            style={{ background: `${item.color}08`, border: `1px solid ${item.color}25` }}
          >
            <p className="text-3xl font-black mb-1" style={{ color: item.color }}>{item.value}</p>
            <p className="text-slate-400 text-xs font-medium">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="liquid-glass p-6 rounded-3xl h-44"
          >
            <div className="flex justify-between mb-5">
              <div className="w-12 h-12 rounded-2xl bg-slate-700/60" />
              <div className="w-20 h-7 rounded-full bg-slate-700/60" />
            </div>
            <div className="h-4 bg-slate-700/60 rounded-lg w-1/2 mb-3" />
            <div className="h-10 bg-slate-700/60 rounded-lg w-3/4" />
          </motion.div>
        ))}
      </div>
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="liquid-glass p-6 rounded-3xl h-64"
      >
        <div className="h-6 bg-slate-700/60 rounded-lg w-1/3 mb-6" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-slate-700/60 rounded-2xl" />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="liquid-glass p-10 rounded-3xl border border-rose-500/25 text-center max-w-2xl mx-auto"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-rose-500/15 border border-rose-500/25 flex items-center justify-center"
      >
        <AlertCircle className="w-10 h-10 text-rose-400" />
      </motion.div>
      <h3 className="text-2xl font-bold text-white mb-3">Evaluation Not Available</h3>
      <p className="text-slate-400 mb-8 leading-relaxed">{message}</p>
      <div className="text-left liquid-glass rounded-2xl border border-white/8 p-6 text-sm font-mono">
        <p className="text-slate-500 mb-3 font-sans font-semibold text-sm">To generate evaluation metrics:</p>
        <ol className="text-slate-400 space-y-2 list-decimal list-inside">
          <li>Copy <span className="text-cyan-400">evaluation.py</span> to your Kaggle notebook</li>
          <li>Ensure <span className="text-cyan-400">OGbest_model.keras</span> is available</li>
          <li>Run the script to generate <span className="text-cyan-400">evaluation_results.json</span></li>
          <li>Place the JSON file in the <span className="text-cyan-400">backend</span> folder</li>
        </ol>
      </div>
    </motion.div>
  )
}

const metricDefs = [
  { key: 'accuracy', label: 'Accuracy', icon: Activity },
  { key: 'precision', label: 'Precision', icon: TrendingUp },
  { key: 'recall', label: 'Recall', icon: Activity },
  { key: 'f1_score', label: 'F1-Score', icon: Award },
  { key: 'specificity_normal', label: 'Specificity', icon: BrainCircuit },
  { key: 'roc_auc', label: 'ROC-AUC', icon: BarChart3 },
]

export default function Evaluation() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scrollY, setScrollY] = useState(0)

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const unsub = smoothScrollY.on('change', (v) => setScrollY(v * 600))
    return () => unsub?.()
  }, [smoothScrollY])

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_BASE}/evaluate`)
        if (!res.ok) {
          const e = await res.json()
          throw new Error(e.message || 'Failed to fetch evaluation')
        }
        setData(await res.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch_()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }} />
        <div className="absolute inset-0 grid-pattern opacity-15" />
      </div>

      <Scene3D scrollY={scrollY} />

      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back nav */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/" className="group inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-semibold tracking-wide uppercase">
              <motion.div
                className="w-7 h-7 rounded-lg liquid-glass flex items-center justify-center"
                whileHover={{ x: -3 }}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </motion.div>
              Back to Home
            </Link>
          </motion.div>

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-cyan-300 text-sm font-bold mb-8 uppercase tracking-widest"
            >
              <Award className="w-4 h-4 text-cyan-400" />
              Model Performance Report
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-5 leading-tight">
              ResNet50{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent animate-gradient-shift inline-block">
                Evaluation
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
              Comprehensive analysis of model performance on the TB Chest X-ray dataset
            </p>
          </motion.div>

          {/* Content */}
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState message={error} />
          ) : data ? (
            <div className="space-y-12">
              {/* Metrics */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Performance Metrics</h2>
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {metricDefs.map((m, i) => (
                    <MetricCard
                      key={m.key}
                      label={m.label}
                      value={data.metrics?.[m.key]}
                      icon={m.icon}
                      delay={i * 0.08}
                    />
                  ))}
                </div>
              </section>

              {/* Confusion Matrix */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Classification Results</h2>
                </div>
                <ConfusionMatrixCard data={data.confusion_matrix} />
              </section>

              {/* Visualizations */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Visualizations</h2>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  <VisualizationCard title="Metrics Comparison" image={data.visualizations?.metrics_chart} icon={BarChart3} color="cyan" />
                  <VisualizationCard title="ROC Curve" image={data.visualizations?.roc_curve} icon={Activity} color="violet" />
                </div>
              </section>

              {/* SHAP */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-violet-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Explainability</h2>
                </div>
                <SHAPCard
                  summaryPlot={data.shap_explainability?.summary_plot}
                  samplePredictions={data.shap_explainability?.sample_predictions}
                />
              </section>

              {/* Dataset Info */}
              <DatasetCard info={data.dataset_info} />

              {/* Nav actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-wrap gap-4 justify-center pt-8"
              >
                <Link to="/tool">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-4 btn-primary rounded-2xl text-base"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Try the Diagnostic Tool
                  </motion.button>
                </Link>
                <Link to="/">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 px-8 py-4 btn-glass rounded-2xl text-base"
                  >
                    Back to Home
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          ) : null}
        </main>

        <Footer />
      </div>
    </div>
  )
}
