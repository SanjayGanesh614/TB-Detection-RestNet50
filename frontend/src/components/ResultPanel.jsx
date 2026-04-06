import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PredictionCard from './PredictionCard'
import PreprocessingSteps from './PreprocessingSteps'
import GradCamSection from './GradCamSection'
import { Microscope, Activity, Eye, Image as ImageIcon, ChevronRight } from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Diagnostic Overview', icon: Activity, color: 'cyan', desc: 'Prediction & source image' },
  { id: 'pipeline', label: 'Processing Pipeline', icon: ImageIcon, color: 'blue', desc: 'Before/after preprocessing' },
  { id: 'explainability', label: 'AI Explainability', icon: Eye, color: 'violet', desc: 'Grad-CAM heatmaps' },
]

export default function ResultPanel({ result }) {
  const [activeTab, setActiveTab] = useState('overview')

  const originalSrc = result.preprocessing_steps?.original
    ? `data:image/png;base64,${result.preprocessing_steps.original}`
    : null

  const isTB = result.prediction === 'Tuberculosis'

  return (
    <div className="w-full space-y-0">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
          <Microscope className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
          <p className="text-slate-500 text-sm">Inference complete · ResNet50 v2.0</p>
        </div>

        {/* Result badge */}
        <div className="ml-auto">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5, delay: 0.3 }}
            className={`px-5 py-2 rounded-full font-bold text-sm uppercase tracking-wider ${
              isTB
                ? 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
            }`}
            style={{
              boxShadow: isTB
                ? '0 0 20px rgba(244,63,94,0.25), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 0 20px rgba(52,211,153,0.25), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isTB ? 'bg-rose-400' : 'bg-emerald-400'}`}
              style={{ animation: isTB ? 'badge-pulse-red 2s ease-in-out infinite' : 'none' }} />
            {result.prediction}
          </motion.div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="liquid-glass rounded-2xl border border-white/8 overflow-hidden">
        {/* Tab Bar */}
        <div className="border-b border-white/8 px-2 pt-2 flex gap-1 overflow-x-auto scrollbar-hide">
          {TABS.map((tab, i) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -1 }}
                className={`relative flex items-center gap-2 px-5 py-3.5 rounded-t-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap group ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-bg"
                    className={`absolute inset-0 rounded-t-xl ${
                      tab.color === 'cyan' ? 'bg-cyan-500/12 border-t border-x border-cyan-500/25' :
                      tab.color === 'blue' ? 'bg-blue-500/12 border-t border-x border-blue-500/25' :
                      'bg-violet-500/12 border-t border-x border-violet-500/25'
                    }`}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon className={`w-4 h-4 relative z-10 transition-colors ${
                  isActive
                    ? tab.color === 'cyan' ? 'text-cyan-400' :
                      tab.color === 'blue' ? 'text-blue-400' : 'text-violet-400'
                    : 'text-slate-600 group-hover:text-slate-400'
                }`} />
                <span className="relative z-10">{tab.label}</span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="tab-dot"
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-0.5 rounded-full ${
                      tab.color === 'cyan' ? 'bg-cyan-400' :
                      tab.color === 'blue' ? 'bg-blue-400' : 'bg-violet-400'
                    }`}
                  />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Tab description strip */}
        <AnimatePresence mode="wait">
          {TABS.map(tab => tab.id === activeTab && (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-6 py-2 border-b border-white/5 flex items-center gap-2"
            >
              <ChevronRight className="w-3 h-3 text-slate-600" />
              <span className="text-slate-500 text-xs">{tab.desc}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Content Area */}
        <div className="p-6 sm:p-8 min-h-[500px]">
          <AnimatePresence mode="wait">

            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="grid lg:grid-cols-2 gap-8 items-start"
              >
                {/* Source Image */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300 text-sm font-semibold">Source Radiograph</span>
                    <span className="ml-auto text-xs text-slate-600 font-mono">INPUT_SEQ_001</span>
                  </div>
                  <motion.div
                    className="rounded-2xl overflow-hidden relative group"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {originalSrc ? (
                      <>
                        <img
                          src={originalSrc}
                          alt="Uploaded X-ray"
                          className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Scan line on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity scanner-effect pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      </>
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center text-slate-500 bg-slate-900/80 text-sm">
                        No image available
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Input Sequence 001</p>
                    </div>
                  </motion.div>
                </div>

                {/* Prediction Result */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300 text-sm font-semibold">Diagnostic Output</span>
                  </div>
                  <PredictionCard result={result} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="liquid-glass rounded-2xl p-5 border border-cyan-500/15"
                    style={{ background: 'rgba(34,211,238,0.03)' }}
                  >
                    <h4 className="text-sm font-bold text-cyan-300 mb-2 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      Automated Next Steps
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Review the{' '}
                      <button
                        onClick={() => setActiveTab('pipeline')}
                        className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2 transition-colors"
                      >
                        Processing Pipeline
                      </button>
                      {' '}to verify image quality, then consult the{' '}
                      <button
                        onClick={() => setActiveTab('explainability')}
                        className="text-violet-400 hover:text-violet-300 font-semibold underline underline-offset-2 transition-colors"
                      >
                        AI Explainability
                      </button>
                      {' '}heatmap to understand which lung regions influenced this prediction.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pipeline' && (
              <motion.div
                key="pipeline"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Digital Image Processing</h3>
                  <p className="text-slate-400 text-sm">High-fidelity transformations applied prior to tensor input.</p>
                </div>
                <PreprocessingSteps steps={result.preprocessing_steps} />
              </motion.div>
            )}

            {activeTab === 'explainability' && (
              <motion.div
                key="explainability"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    XAI: Gradient-weighted Class Activation Mapping
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Visualizing the spatial attention map from the final convolutional layer.
                  </p>
                </div>
                <GradCamSection result={result} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
