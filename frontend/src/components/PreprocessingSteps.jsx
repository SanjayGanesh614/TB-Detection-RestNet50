import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ZoomIn, X } from 'lucide-react'

const PIPELINE = [
  {
    step: '6.2',
    before: 'original',
    after: 'resized',
    label: 'Resize',
    purpose: 'Ensure uniform input size for the model',
    desc: 'Image scaled to 256×256 pixels for consistent neural network input',
    beforeLabel: 'Original',
    afterLabel: 'Resized (256×256)',
    color: 'violet',
    accentFrom: '#a78bfa',
    accentTo: '#8b5cf6',
  },
  {
    step: '6.4',
    before: 'resized',
    after: 'enhanced',
    label: 'Contrast Enhancement (CLAHE)',
    purpose: 'Enhance local contrast in X-ray images',
    desc: 'Adaptive histogram equalization improves visibility of subtle patterns such as lesions',
    beforeLabel: 'Resized',
    afterLabel: 'CLAHE Enhanced',
    color: 'cyan',
    accentFrom: '#22d3ee',
    accentTo: '#06b6d4',
  },
  {
    step: '6.5',
    before: 'enhanced',
    after: 'denoised',
    label: 'Denoising (Optional)',
    purpose: 'Reduce noise while preserving important edges',
    desc: 'Gaussian blur (3×3 kernel) smooths high-frequency noise — useful for DIP demonstration',
    beforeLabel: 'Enhanced',
    afterLabel: 'Denoised',
    color: 'teal',
    accentFrom: '#2dd4bf',
    accentTo: '#14b8a6',
    optional: true,
  },
  {
    step: '6.3',
    before: 'denoised',
    after: 'normalized',
    label: 'Normalization',
    purpose: 'Scale pixel values to a consistent range',
    desc: 'Pixel values converted from [0, 255] to [0, 1] for stable neural network input',
    beforeLabel: 'Denoised',
    afterLabel: 'Normalized [0, 1]',
    color: 'emerald',
    accentFrom: '#34d399',
    accentTo: '#10b981',
  },
]

export default function PreprocessingSteps({ steps }) {
  const [enlarged, setEnlarged] = useState(null)

  return (
    <div className="space-y-6">
      {/* Pipeline flow */}
      <div className="liquid-glass rounded-2xl border border-white/8 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {['Original', 'Resize', 'CLAHE', 'Denoise', 'Normalize', 'Model Input'].map((name, i, arr) => (
            <span key={name} className="flex items-center gap-2">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  i === 0 || i === arr.length - 1
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                }`}
              >
                {name}
              </motion.span>
              {i < arr.length - 1 && (
                <ArrowRight className="w-3 h-3 text-slate-700 shrink-0" />
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Step cards */}
      <div className="grid md:grid-cols-2 gap-5">
        {PIPELINE.map((step, idx) => {
          const beforeSrc = steps[step.before] ? `data:image/png;base64,${steps[step.before]}` : null
          const afterSrc = steps[step.after] ? `data:image/png;base64,${steps[step.after]}` : null

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="liquid-glass rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${step.accentFrom}25` }}
            >
              {/* Step header */}
              <div className="px-5 py-4 flex items-center gap-3"
                style={{ background: `${step.accentFrom}10`, borderBottom: `1px solid ${step.accentFrom}20` }}>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${step.accentFrom}, ${step.accentTo})` }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold" style={{ color: step.accentFrom }}>{step.label}</p>
                    {step.optional && (
                      <span className="text-xs text-slate-500 bg-slate-800/60 border border-slate-700 px-2 py-0.5 rounded-lg">optional</span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">{step.purpose}</p>
                </div>
                <span className="text-slate-600 text-xs font-mono shrink-0">Step {step.step}</span>
              </div>

              {/* Images */}
              <div className="p-5">
                <div className="flex items-stretch gap-4">
                  {/* Before */}
                  <ImagePanel
                    src={beforeSrc}
                    label="Before"
                    caption={step.beforeLabel}
                    accentColor={step.accentFrom}
                    dimmed
                    onClick={() => beforeSrc && setEnlarged({ src: beforeSrc, label: step.beforeLabel, step: step.label })}
                  />

                  {/* Arrow */}
                  <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                    <div className="w-px flex-1 rounded-full" style={{ background: `${step.accentFrom}30` }} />
                    <motion.div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: `${step.accentFrom}15`, border: `1px solid ${step.accentFrom}30` }}
                      whileHover={{ scale: 1.2 }}
                    >
                      <ArrowRight className="w-4 h-4" style={{ color: step.accentFrom }} />
                    </motion.div>
                    <div className="w-px flex-1 rounded-full" style={{ background: `${step.accentFrom}30` }} />
                  </div>

                  {/* After */}
                  <ImagePanel
                    src={afterSrc}
                    label="After"
                    caption={step.afterLabel}
                    accentColor={step.accentFrom}
                    highlighted
                    onClick={() => afterSrc && setEnlarged({ src: afterSrc, label: step.afterLabel, step: step.label })}
                  />
                </div>

                <p className="text-slate-500 text-xs mt-4 leading-relaxed border-t pt-3" style={{ borderColor: `${step.accentFrom}15` }}>
                  {step.desc}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {enlarged && (
          <LightboxModal
            src={enlarged.src}
            label={enlarged.label}
            step={enlarged.step}
            onClose={() => setEnlarged(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ImagePanel({ src, label, caption, accentColor, dimmed, highlighted, onClick }) {
  return (
    <div className="flex-1 cursor-pointer group" onClick={onClick}>
      <div className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${dimmed ? 'text-slate-500' : ''}`}
        style={highlighted ? { color: accentColor } : {}}>
        <span className="w-2 h-2 rounded-full" style={{ background: highlighted ? accentColor : '#475569' }} />
        {label}
      </div>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="aspect-square bg-black/50 rounded-xl overflow-hidden relative"
        style={highlighted ? { boxShadow: `0 0 15px ${accentColor}30`, border: `1px solid ${accentColor}30` } : { border: '1px solid rgba(51,65,85,0.4)' }}
      >
        {src ? (
          <>
            <img src={src} alt={caption} className="w-full h-full object-cover" />
            <motion.div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-2">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-700 text-xs">N/A</div>
        )}
      </motion.div>
      <p className="text-xs mt-1.5 text-center text-slate-600">{caption}</p>
    </div>
  )
}

function LightboxModal({ src, label, step, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 30 }}
        transition={{ type: 'spring', bounce: 0.3 }}
        className="liquid-glass max-w-2xl w-full overflow-hidden rounded-3xl"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 20px 80px rgba(0,0,0,0.8)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <div>
            <h4 className="text-white font-bold">{label}</h4>
            <p className="text-slate-500 text-xs mt-0.5">{step}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center transition-all text-slate-400"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="p-6 bg-black/40">
          <img src={src} alt={label} className="w-full rounded-2xl shadow-2xl" />
        </div>
      </motion.div>
    </motion.div>
  )
}
