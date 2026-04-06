import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ZoomIn, X, Eye, Flame } from 'lucide-react'

export default function GradCamSection({ result }) {
  const [enlarged, setEnlarged] = useState(null)

  const inputSrc = result.preprocessing_steps?.denoised
    ? `data:image/png;base64,${result.preprocessing_steps.denoised}` : null
  const heatmapSrc = result.grad_cam
    ? `data:image/png;base64,${result.grad_cam}` : null
  const overlaySrc = result.overlay
    ? `data:image/png;base64,${result.overlay}` : null

  const panels = [
    {
      id: 'heatmap',
      icon: Flame,
      title: 'Grad-CAM Heatmap',
      sub: 'Raw class activation map from conv5_block3_out layer',
      label: 'A',
      accentFrom: '#fb923c',
      accentTo: '#f59e0b',
      inputSrc,
      outputSrc: heatmapSrc,
      outputLabel: 'Activation Map',
      inputCaption: 'Preprocessed X-ray',
      desc: 'Gradient-weighted activations highlight which spatial regions the model focused on during classification.',
    },
    {
      id: 'overlay',
      icon: Eye,
      title: 'Overlay Visualization',
      sub: 'Heatmap superimposed on the processed radiograph',
      label: 'B',
      accentFrom: '#f87171',
      accentTo: '#e879f9',
      inputSrc,
      outputSrc: overlaySrc,
      outputLabel: 'Superimposed',
      inputCaption: 'Preprocessed X-ray',
      desc: 'Heatmap blended at 40% opacity onto the original image reveals areas of clinical interest the model used for its prediction.',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Color scale legend */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="liquid-glass rounded-2xl border border-white/8 p-4 flex items-center gap-4"
      >
        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          Low activation
        </div>
        <div className="flex-1 h-3 rounded-full overflow-hidden shadow-inner"
          style={{ background: 'linear-gradient(to right, #000080, #0000ff, #00ffff, #00ff00, #ffff00, #ff8000, #ff0000)' }} />
        <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
          High activation
          <div className="w-2 h-2 rounded-full bg-red-500" />
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {panels.map((panel, idx) => {
          const Icon = panel.icon
          return (
            <motion.div
              key={panel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="liquid-glass rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${panel.accentFrom}30` }}
            >
              {/* Header */}
              <div className="px-5 py-4 flex items-center gap-3"
                style={{ background: `${panel.accentFrom}10`, borderBottom: `1px solid ${panel.accentFrom}20` }}>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${panel.accentFrom}, ${panel.accentTo})` }}
                >
                  {panel.label}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: panel.accentFrom }}>{panel.title}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{panel.sub}</p>
                </div>
                <Icon className="ml-auto w-4 h-4 opacity-40" style={{ color: panel.accentFrom }} />
              </div>

              {/* Images */}
              <div className="p-5">
                <div className="flex items-stretch gap-4">
                  {/* Input */}
                  <GradImage
                    src={panel.inputSrc}
                    label="Model Input"
                    caption={panel.inputCaption}
                    dimmed
                    onClick={() => panel.inputSrc && setEnlarged({ src: panel.inputSrc, label: 'Model Input', step: panel.title })}
                  />

                  {/* Arrow */}
                  <div className="flex flex-col items-center justify-center gap-2 shrink-0">
                    <div className="w-px flex-1 rounded-full" style={{ background: `${panel.accentFrom}30` }} />
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: `${panel.accentFrom}15`, border: `1px solid ${panel.accentFrom}35` }}
                    >
                      <ArrowRight className="w-4 h-4" style={{ color: panel.accentFrom }} />
                    </motion.div>
                    <div className="w-px flex-1 rounded-full" style={{ background: `${panel.accentFrom}30` }} />
                  </div>

                  {/* Output */}
                  <GradImage
                    src={panel.outputSrc}
                    label={panel.outputLabel}
                    caption={panel.outputLabel}
                    accentColor={panel.accentFrom}
                    highlighted
                    onClick={() => panel.outputSrc && setEnlarged({ src: panel.outputSrc, label: panel.outputLabel, step: panel.title })}
                  />
                </div>

                <p className="text-slate-500 text-xs mt-4 leading-relaxed border-t pt-3" style={{ borderColor: `${panel.accentFrom}15` }}>
                  {panel.desc}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {enlarged && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setEnlarged(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: 'spring', bounce: 0.3 }}
              className="liquid-glass max-w-2xl w-full overflow-hidden rounded-3xl"
              style={{ boxShadow: '0 20px 80px rgba(0,0,0,0.8)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                <div>
                  <h4 className="text-white font-bold">{enlarged.label}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{enlarged.step}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEnlarged(null)}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center transition-all text-slate-400"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="p-6 bg-black/40">
                <img src={enlarged.src} alt={enlarged.label} className="w-full rounded-2xl shadow-2xl" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GradImage({ src, label, caption, accentColor, dimmed, highlighted, onClick }) {
  return (
    <div className="flex-1 cursor-pointer group" onClick={onClick}>
      <div
        className="text-xs font-semibold mb-2 flex items-center gap-1.5"
        style={highlighted ? { color: accentColor } : { color: '#64748b' }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: highlighted ? accentColor : '#475569' }} />
        {label}
      </div>
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.2 }}
        className="aspect-square bg-black/50 rounded-xl overflow-hidden relative"
        style={highlighted
          ? { boxShadow: `0 0 20px ${accentColor}35`, border: `1px solid ${accentColor}30` }
          : { border: '1px solid rgba(51,65,85,0.4)' }
        }
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
