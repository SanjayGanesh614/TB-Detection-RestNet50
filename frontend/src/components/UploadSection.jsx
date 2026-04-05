import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, RotateCcw, Image as ImageIcon, Zap, Eye, FileCheck } from 'lucide-react'

export default function UploadSection({ onFile, status, preview, fileName, onReset }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) onFile(file)
  }, [onFile])

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragging(true) }, [])
  const handleDragLeave = useCallback(() => setDragging(false), [])
  const handleChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) onFile(file)
    e.target.value = ''
  }, [onFile])

  const isLoading = status === 'loading'

  return (
    <section className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
            Chest X-Ray Analysis
          </h2>
          <p className="text-slate-400 text-sm">
            Upload a radiograph to detect Tuberculosis using ResNet50 deep learning
          </p>
        </div>
        <AnimatePresence>
          {status === 'done' && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onReset}
              className="sm:ml-auto flex items-center gap-2 text-sm font-semibold px-5 py-2.5 liquid-glass rounded-xl text-slate-300 hover:text-white border border-white/10 hover:border-white/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Analyze Another
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Zone */}
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isLoading && !preview && inputRef.current?.click()}
          animate={{
            borderColor: dragging ? 'rgba(34,211,238,0.6)' : 'rgba(51,65,85,0.7)',
            boxShadow: dragging
              ? '0 0 40px rgba(34,211,238,0.15), inset 0 0 30px rgba(34,211,238,0.05)'
              : '0 4px 20px rgba(0,0,0,0.3)',
          }}
          transition={{ duration: 0.2 }}
          className={`
            relative border-2 border-dashed rounded-3xl overflow-hidden
            min-h-[320px] flex items-center justify-center
            ${!preview && !isLoading ? 'cursor-pointer' : ''}
            bg-slate-900/50 backdrop-blur-lg
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            disabled={isLoading}
          />

          {/* Animated corner accents */}
          {!preview && !isLoading && (
            <>
              {[['top-3 left-3 border-t border-l', 'w-6 h-6'],
                ['top-3 right-3 border-t border-r', 'w-6 h-6'],
                ['bottom-3 left-3 border-b border-l', 'w-6 h-6'],
                ['bottom-3 right-3 border-b border-r', 'w-6 h-6']].map(([pos], i) => (
                <div
                  key={i}
                  className={`absolute ${pos} border-cyan-500/40 w-6 h-6 rounded-sm transition-all duration-300 ${
                    dragging ? 'border-cyan-400 scale-110' : ''
                  }`}
                />
              ))}
            </>
          )}

          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingState key="loading" />
            ) : preview ? (
              <PreviewState key="preview" preview={preview} fileName={fileName} onReset={onReset} />
            ) : (
              <EmptyState key="empty" dragging={dragging} />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Instructions Card */}
        <div className="liquid-glass rounded-3xl border border-white/8 p-7 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
              How It Works
            </h3>
          </div>

          <ol className="space-y-5">
            {[
              {
                step: '01',
                icon: ImageIcon,
                title: 'Upload X-Ray',
                desc: 'Drag & drop or click to upload a chest radiograph (PNG, JPG, JPEG)',
                color: 'cyan',
              },
              {
                step: '02',
                icon: Zap,
                title: 'AI Processing',
                desc: 'Image undergoes CLAHE enhancement, denoising, and ResNet50 inference',
                color: 'blue',
              },
              {
                step: '03',
                icon: Eye,
                title: 'Grad-CAM Visualization',
                desc: "See exactly which regions influenced the AI's decision via heatmaps",
                color: 'violet',
              },
              {
                step: '04',
                icon: FileCheck,
                title: 'Clinical Report',
                desc: 'Get prediction (Normal / Tuberculosis) with confidence score',
                color: 'emerald',
              },
            ].map(({ step, icon: Icon, title, desc, color }, i) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 group"
              >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 ${
                    color === 'cyan' ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-400' :
                    color === 'blue' ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400' :
                    color === 'violet' ? 'bg-violet-500/15 border border-violet-500/30 text-violet-400' :
                    'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {i < 3 && (
                    <div className="absolute left-1/2 top-full w-px h-5 bg-gradient-to-b from-slate-700 to-transparent -translate-x-1/2" />
                  )}
                </div>
                <div className="pt-1.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-600 font-mono">{step}</span>
                    <p className="text-white text-sm font-semibold">{title}</p>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>

          <div className="border-t border-white/5 pt-5">
            <div className="liquid-glass rounded-xl p-4 border border-amber-500/15">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-amber-400 font-bold">Disclaimer:</span>{' '}
                This tool is for research and educational purposes only. Not a substitute for professional medical diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EmptyState({ dragging }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center p-10 space-y-5 w-full"
    >
      {/* Icon with ripple rings */}
      <div className="relative w-20 h-20 mx-auto">
        {dragging && (
          <>
            <div className="absolute inset-0 rounded-full border border-cyan-500/40 scale-150 animate-ping" />
            <div className="absolute inset-0 rounded-full border border-cyan-500/20 scale-175" style={{ animation: 'pulse-ring 1.5s ease-out infinite 0.3s' }} />
          </>
        )}
        <motion.div
          animate={dragging ? { scale: 1.15, rotate: -5 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
            dragging
              ? 'bg-cyan-500/20 border-2 border-cyan-400/60 shadow-[0_0_30px_rgba(34,211,238,0.3)]'
              : 'bg-slate-800/80 border-2 border-dashed border-slate-600'
          }`}
        >
          <Upload className={`w-9 h-9 transition-colors ${dragging ? 'text-cyan-400' : 'text-slate-500'}`} />
        </motion.div>
      </div>

      <div>
        <p className={`text-lg font-bold transition-colors ${dragging ? 'text-cyan-300' : 'text-white'}`}>
          {dragging ? 'Release to Upload' : 'Drop your X-ray here'}
        </p>
        <p className="text-slate-500 text-sm mt-1">
          or{' '}
          <span className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium underline underline-offset-2 cursor-pointer">
            click to browse files
          </span>
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        {['PNG', 'JPG', 'JPEG'].map((fmt) => (
          <span key={fmt} className="text-xs text-slate-600 bg-slate-800/60 border border-slate-700/50 px-2.5 py-1 rounded-lg font-mono">
            {fmt}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function PreviewState({ preview, fileName, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-full min-h-[320px]"
    >
      {/* Scanner effect overlay */}
      <div className="scanner-effect absolute inset-0 z-10 pointer-events-none" />
      <img
        src={preview}
        alt="X-ray preview"
        className="absolute inset-0 w-full h-full object-contain p-4"
      />
      {/* Corner markers */}
      <div className="absolute inset-4 pointer-events-none">
        {[['top-0 left-0 border-t-2 border-l-2', ''],
          ['top-0 right-0 border-t-2 border-r-2', ''],
          ['bottom-0 left-0 border-b-2 border-l-2', ''],
          ['bottom-0 right-0 border-b-2 border-r-2', '']].map(([pos], i) => (
          <div key={i} className={`absolute ${pos} border-cyan-500/60 w-5 h-5 rounded-sm`} />
        ))}
      </div>
      <div className="absolute bottom-3 left-3 right-3 liquid-glass rounded-xl px-4 py-2.5 flex items-center gap-2 z-20">
        <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="text-slate-200 text-xs font-medium truncate">{fileName}</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onReset() }}
          className="ml-auto text-slate-500 hover:text-rose-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  )
}

function LoadingState() {
  const steps = [
    { label: 'Reading image...', color: '#22d3ee' },
    { label: 'Applying CLAHE enhancement...', color: '#3b82f6' },
    { label: 'Running ResNet50 inference...', color: '#8b5cf6' },
    { label: 'Generating Grad-CAM heatmap...', color: '#34d399' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="text-center p-10 space-y-7 w-full"
    >
      {/* Multi-ring spinner */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-slate-700/50" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 animate-spin" style={{ animationDuration: '1s' }} />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
        <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-cyan-400"
            style={{ boxShadow: '0 0 10px rgba(34,211,238,0.8)' }}
          />
        </div>
      </div>

      <div>
        <p className="text-white font-bold text-base mb-1">Analyzing radiograph</p>
        <p className="text-slate-500 text-xs">AI pipeline active</p>
      </div>

      {/* Step indicators */}
      <div className="space-y-3 w-full max-w-xs mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
            className="flex items-center gap-3"
          >
            <motion.div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: step.color }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
            />
            <div className="flex-1 bg-slate-800/60 rounded-full h-1 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${step.color}80, ${step.color})` }}
                initial={{ width: '0%' }}
                animate={{ width: ['0%', '100%', '0%'] }}
                transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <span className="text-slate-500 text-xs shrink-0 w-28 text-left">{step.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
