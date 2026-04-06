import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Microscope, BrainCircuit, Activity, BarChart3, ArrowRight, ChevronRight } from 'lucide-react'

const features = [
  {
    icon: BrainCircuit,
    color: 'cyan',
    accentFrom: '#22d3ee',
    accentTo: '#3b82f6',
    tag: 'Deep Learning',
    title: 'Residual Neural Network (ResNet50)',
    shortDesc: 'Skip connections that preserve gradient flow through 50 layers.',
    fullDesc: 'ResNet50 bypasses the vanishing gradient problem using residual skip connections, allowing the network to reliably extract subtle features from dense X-ray tissue. The architecture trains 50 deep convolutional layers without losing gradient signal, enabling it to detect micro-nodule patterns invisible to standard CNNs.',
    steps: ['Input → Conv1', 'Residual Blocks ×4', 'Global Avg Pool', 'Softmax Output'],
  },
  {
    icon: Activity,
    color: 'teal',
    accentFrom: '#2dd4bf',
    accentTo: '#14b8a6',
    tag: 'Preprocessing',
    title: 'Contrast Limited Adaptive Histogram Equalization',
    shortDesc: 'Tile-based local contrast enhancement for radiographs.',
    fullDesc: 'CLAHE divides the image into small contextual tiles and applies histogram equalization locally, preventing over-amplification of noise common in global methods. This technique enhances lung tissue contrast in under-exposed X-ray regions, making early-stage TB infiltrates significantly more visible.',
    steps: ['Tile Grid 8×8', 'Clip Limit 2.0', 'Bilinear Interp', 'Enhanced Output'],
  },
  {
    icon: Microscope,
    color: 'emerald',
    accentFrom: '#34d399',
    accentTo: '#10b981',
    tag: 'Explainability',
    title: 'Gradient-weighted Class Activation Mapping',
    shortDesc: 'Spatial attention maps from the final convolutional layer.',
    fullDesc: 'Grad-CAM computes the gradient of the target class score with respect to the last convolutional feature maps. These gradients are global-average-pooled to form neuron importance weights, which are combined with feature maps to produce a coarse heatmap highlighting discriminative regions that drove the classification decision.',
    steps: ['Forward Pass', 'Backprop Gradients', 'Weighted Avg', 'Heatmap Overlay'],
  },
  {
    icon: BarChart3,
    color: 'violet',
    accentFrom: '#a78bfa',
    accentTo: '#8b5cf6',
    tag: 'Attribution',
    title: 'SHAP Explainability',
    shortDesc: 'Game-theory-based feature attribution for model transparency.',
    fullDesc: 'SHAP (SHapley Additive exPlanations) applies cooperative game theory to AI models, calculating each feature\'s marginal contribution to predictions. For image data, this translates pixel-level Shapley values into contribution maps, showing exactly which regions of the radiograph push the model toward or away from a TB positive prediction.',
    steps: ['Baseline Estimate', 'Feature Masking', 'Shapley Values', 'Attribution Map'],
  },
]

function FeatureCard({ item, isActive, onClick, index }) {
  const Icon = item.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      className={`cursor-pointer group relative overflow-hidden rounded-3xl transition-all duration-500 ${
        isActive
          ? 'lg:col-span-2 row-span-2'
          : ''
      }`}
      style={{
        boxShadow: isActive
          ? `0 0 60px rgba(0,0,0,0.5), 0 0 40px ${item.accentFrom}22`
          : '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div
        className="h-full liquid-glass border border-white/8 p-7 flex flex-col relative"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${item.accentFrom}12, rgba(15,23,42,0.9) 50%, ${item.accentTo}08)`
            : undefined,
        }}
      >
        {/* Animated gradient background on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: `radial-gradient(ellipse at 20% 20%, ${item.accentFrom}15, transparent 60%)`,
          }}
        />

        {/* Tag + Icon row */}
        <div className="flex items-start justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              animate={isActive ? { rotate: [0, -15, 15, 0], scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${item.accentFrom}30, ${item.accentTo}20)`,
                border: `1px solid ${item.accentFrom}35`,
                color: item.accentFrom,
              }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
            <span
              className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                background: `${item.accentFrom}15`,
                border: `1px solid ${item.accentFrom}30`,
                color: item.accentFrom,
              }}
            >
              {item.tag}
            </span>
          </div>

          <motion.div
            animate={{ rotate: isActive ? 90 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-slate-600 group-hover:text-slate-400 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 relative z-10 leading-snug">
          {item.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed relative z-10 mb-4">
          {item.shortDesc}
        </p>

        {/* Expanded content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="relative z-10 overflow-hidden"
            >
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {item.fullDesc}
              </p>

              {/* Pipeline steps */}
              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Pipeline Steps</p>
                <div className="flex flex-wrap gap-2">
                  {item.steps.map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-2"
                    >
                      <span
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                        style={{
                          background: `${item.accentFrom}15`,
                          border: `1px solid ${item.accentFrom}30`,
                          color: item.accentFrom,
                        }}
                      >
                        {i + 1}. {step}
                      </span>
                      {i < item.steps.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{
            background: `linear-gradient(90deg, transparent, ${item.accentFrom}, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )
}

export default function EducationalSection() {
  const [activeCard, setActiveCard] = useState(null)

  return (
    <section className="pt-14 pb-10 relative z-10 w-full bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-transparent to-cyan-500/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full liquid-glass text-cyan-300 text-xs font-bold uppercase tracking-widest"
          >
            <Microscope className="w-3.5 h-3.5 text-cyan-400" />
            Technology Stack
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight"
          >
            Clinical Intelligence{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Demystified
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg font-light"
          >
            Our pipeline bridges the physical and mathematical realms. Click any card to explore the technology.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((item, idx) => (
            <FeatureCard
              key={idx}
              item={item}
              index={idx}
              isActive={activeCard === idx}
              onClick={() => setActiveCard(activeCard === idx ? null : idx)}
            />
          ))}
        </div>

        {/* Hint text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-600 text-xs mt-8 font-medium tracking-wider uppercase"
        >
          Click any card to expand details
        </motion.p>
      </div>
    </section>
  )
}
