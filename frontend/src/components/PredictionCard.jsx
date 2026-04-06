import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, TrendingUp, Info } from 'lucide-react'

export default function PredictionCard({ result }) {
  const isTB = result.prediction === 'Tuberculosis'
  const confidencePct = Math.round(result.confidence * 100)
  const [animatedPct, setAnimatedPct] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

  const circumference = 2 * Math.PI * 44
  const strokeDashoffset = circumference - (animatedPct / 100) * circumference

  const color = isTB ? '#f87171' : '#34d399'
  const colorGlow = isTB ? 'rgba(248,113,113,0.4)' : 'rgba(52,211,153,0.4)'
  const colorBg = isTB ? 'rgba(244,63,94,0.06)' : 'rgba(16,185,129,0.06)'
  const colorBorder = isTB ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.3)'

  useEffect(() => {
    const timer = setTimeout(() => {
      const step = confidencePct / 40
      let current = 0
      const interval = setInterval(() => {
        current = Math.min(current + step, confidencePct)
        setAnimatedPct(Math.round(current))
        if (current >= confidencePct) clearInterval(interval)
      }, 20)
      return () => clearInterval(interval)
    }, 300)
    return () => clearTimeout(timer)
  }, [confidencePct])

  const riskLevel = confidencePct >= 85 ? 'High' : confidencePct >= 60 ? 'Moderate' : 'Low'
  const riskColor = confidencePct >= 85
    ? isTB ? 'text-rose-300' : 'text-emerald-300'
    : 'text-amber-300'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.7 }}
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: colorBg,
        border: `1px solid ${colorBorder}`,
        boxShadow: `0 0 40px ${colorGlow}30, 0 8px 30px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Liquid glass overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)' }} />

      {/* Animated glow blob */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: color }}
        animate={{ scale: [1, 1.3, 1], x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 p-7 space-y-6">
        {/* Status Banner */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={isTB ? {
                scale: [1, 1.1, 1],
                boxShadow: [`0 0 10px ${colorGlow}`, `0 0 25px ${colorGlow}`, `0 0 10px ${colorGlow}`]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: isTB ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)', border: `1px solid ${colorBorder}` }}
            >
              {isTB
                ? <AlertCircle className="w-6 h-6" style={{ color }} />
                : <CheckCircle className="w-6 h-6" style={{ color }} />
              }
            </motion.div>
            <div>
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-black leading-none"
                style={{ color }}
              >
                {result.prediction}
              </motion.p>
              <p className="text-slate-500 text-xs mt-0.5 font-mono uppercase tracking-wider">
                Class {result.class_index} · ResNet50
              </p>
            </div>
          </motion.div>

          {/* Info toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-8 h-8 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors border border-slate-700/50"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Confidence Ring + Stats */}
        <div className="flex items-center gap-6">
          {/* SVG Ring */}
          <div className="relative w-32 h-32 shrink-0">
            {/* Outer pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${color}` }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />

            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Track */}
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              {/* Gradient arc */}
              <defs>
                <linearGradient id={`ring-grad-${isTB ? 'tb' : 'n'}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={isTB ? '#f87171' : '#34d399'} />
                  <stop offset="100%" stopColor={isTB ? '#fb923c' : '#22d3ee'} />
                </linearGradient>
              </defs>
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke={`url(#ring-grad-${isTB ? 'tb' : 'n'})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-3xl font-black leading-none"
                style={{ color }}
              >
                {animatedPct}%
              </motion.span>
              <span className="text-slate-500 text-[10px] mt-0.5 font-medium uppercase tracking-wider">
                Confidence
              </span>
            </div>
          </div>

          {/* Stats column */}
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Confidence Level</span>
                <span style={{ color }} className="font-bold">{animatedPct}%</span>
              </div>
              <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${confidencePct}%` }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/40">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">Risk Level</p>
                <p className={`font-bold text-sm ${riskColor}`}>{riskLevel}</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/40">
                <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">Status</p>
                <p className="font-bold text-sm" style={{ color }}>
                  {isTB ? 'Positive' : 'Negative'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-500 text-xs">Model: ResNet50 · TF 2.15</span>
            </div>
          </div>
        </div>

        {/* Interpretation - expandable */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t pt-5" style={{ borderColor: colorBorder }}>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Clinical Interpretation</p>
                <p className="text-sm leading-relaxed" style={{ color: isTB ? 'rgba(248,113,113,0.8)' : 'rgba(52,211,153,0.8)' }}>
                  {isTB
                    ? 'The model detects radiological patterns consistent with Tuberculosis infection. Clinical correlation, sputum analysis, and further testing are strongly recommended. This is an AI-assisted screening tool — not a definitive diagnosis.'
                    : 'No significant TB-associated patterns detected in this radiograph. The lung fields appear within normal radiological parameters for this AI model. Routine clinical follow-up as indicated by the treating physician.'
                  }
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
