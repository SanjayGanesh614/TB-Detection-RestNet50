import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BrainCircuit, Activity, BarChart3, FileText,
  Sparkles, Shield, Cpu, Microscope, ChevronRight, Zap, Eye
} from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

/* ── Data ─────────────────────────────────────────── */
const HERO_STATS = [
  { value: '98.2%', label: 'Accuracy',     icon: Shield   },
  { value: '<2s',   label: 'Inference',    icon: Zap      },
  { value: '50L',   label: 'ResNet Depth', icon: BrainCircuit },
  { value: 'XAI',   label: 'Explainable',  icon: Eye      },
]

const TECH_CARDS = [
  {
    icon: BrainCircuit,
    accent: '#22d3ee',
    tag: 'Deep Learning',
    title: 'ResNet50 Architecture',
    desc: 'Skip connections preserve gradient flow through 50 layers, reliably extracting subtle TB nodule features invisible to standard CNNs.',
    steps: ['Input → Conv1', 'Residual Blocks ×4', 'Global Avg Pool', 'Softmax Output'],
  },
  {
    icon: Activity,
    accent: '#2dd4bf',
    tag: 'Preprocessing',
    title: 'CLAHE Normalization',
    desc: 'Tile-based local contrast enhancement illuminates hidden shadows in under-exposed X-ray regions, making early infiltrates visible.',
    steps: ['Tile Grid 8×8', 'Clip Limit 2.0', 'Bilinear Interp', 'Enhanced Output'],
  },
  {
    icon: Microscope,
    accent: '#34d399',
    tag: 'Explainability',
    title: 'Grad-CAM Heatmaps',
    desc: 'Gradient-weighted class activation maps highlight the exact spatial regions that drove the model\'s diagnosis decision.',
    steps: ['Forward Pass', 'Backprop Grads', 'Weighted Avg', 'Heatmap Overlay'],
  },
  {
    icon: BarChart3,
    accent: '#a78bfa',
    tag: 'Attribution',
    title: 'SHAP Explainability',
    desc: 'Game-theory Shapley values translate pixel contributions into attribution maps — full transparency into every prediction.',
    steps: ['Baseline Est.', 'Feature Masking', 'Shapley Values', 'Attribution Map'],
  },
]

const GLOBAL_STATS = [
  { n: '1.6M',   label: 'Lives Lost Annually to TB', color: '#f87171' },
  { n: '98.2%',  label: 'Model Test Accuracy',       color: '#34d399' },
  { n: '<2s',    label: 'Inference Speed',            color: '#22d3ee' },
  { n: '50',     label: 'ResNet Layers',              color: '#a78bfa' },
]

/* ── Tiny helpers ─────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:  { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: [0.4, 0, 0.2, 1] },
})

/* ── Component ────────────────────────────────────── */
export default function Landing() {
  const [openCard, setOpenCard] = useState(null)

  return (
    <div className="relative bg-slate-950 text-slate-100 font-sans overflow-x-hidden">

      {/* Fixed ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full opacity-[0.035]"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <div className="absolute inset-0 grid-pattern opacity-[0.18] pointer-events-none" />
      </div>

      <Header />

      {/* ══════════════════════════════════
          HERO
      ══════════════════════════════════ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center overflow-hidden">

        {/* Hero background image — subtle */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/lab-bg.png"
            alt=""
            className="w-full h-full object-cover opacity-[0.12]"
            style={{ filter: 'blur(2px) saturate(0.6)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'backOut' }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full liquid-glass text-cyan-300 text-xs font-bold uppercase tracking-widest"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            Diagnostic System Online
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white leading-none mb-6"
          >
            Diagnosis,
            <br />
            <span className="relative inline-block mt-1">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-gradient-shift">
                Reimagined.
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-400 opacity-50 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.7 }}
              />
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            High-precision TB detection from chest X-rays using{' '}
            <span className="text-cyan-400 font-medium">ResNet50</span> deep learning,
            CLAHE preprocessing, and Grad-CAM explainability.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="flex flex-wrap gap-4 justify-center mb-14"
          >
            <Link to="/tool">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 btn-primary rounded-2xl text-base font-bold"
              >
                <Activity className="w-5 h-5" />
                Launch Diagnostic Tool
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link to="/evaluate">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 btn-glass rounded-2xl text-base font-bold"
              >
                <BarChart3 className="w-5 h-5" />
                View Evaluation
              </motion.button>
            </Link>
          </motion.div>

          {/* Stat chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {HERO_STATS.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.06, y: -2 }}
                  className="liquid-glass rounded-xl px-4 py-2.5 flex items-center gap-2.5 cursor-default"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-white font-bold text-sm leading-none">{s.value}</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">{s.label}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-10" />
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS  (3-step)
      ══════════════════════════════════ */}
      <section className="relative z-10 bg-slate-950 px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full liquid-glass text-cyan-300 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Pipeline
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">How It Works</h2>
          </motion.div>

          <div className="relative flex flex-col md:flex-row gap-0">
            {[
              { n: '01', icon: Activity,    title: 'Upload X-Ray',       desc: 'Drag & drop a posterior-anterior chest radiograph — PNG, JPG or JPEG.', color: '#22d3ee' },
              { n: '02', icon: BrainCircuit,title: 'AI Processing',      desc: 'CLAHE enhancement then ResNet50 inference runs in under 2 seconds.', color: '#818cf8' },
              { n: '03', icon: Eye,         title: 'Explainable Report', desc: 'Confidence score, Grad-CAM heatmap and preprocessing pipeline — all visualised.', color: '#34d399' },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div key={i} {...fadeUp(i * 0.12)} className="relative flex-1 flex flex-col items-center text-center px-6">
                  {/* Connector line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 left-[calc(50%+44px)] right-0 h-px"
                      style={{ background: `linear-gradient(90deg, ${step.color}50, transparent)` }} />
                  )}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                    style={{ background: `${step.color}18`, border: `1px solid ${step.color}35`, color: step.color }}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: step.color }}>{step.n}</span>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TECH CARDS
      ══════════════════════════════════ */}
      <section className="relative z-10 bg-slate-950 px-6 py-16">
        <div className="max-w-6xl mx-auto">

          <motion.div {...fadeUp()} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full liquid-glass text-cyan-300 text-xs font-bold uppercase tracking-widest">
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" /> Technology
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Clinical Intelligence{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Demystified
              </span>
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto text-base font-light">
              Click any card to explore the technology inside the pipeline.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {TECH_CARDS.map((card, i) => {
              const Icon = card.icon
              const isOpen = openCard === i
              return (
                <motion.div
                  key={i}
                  {...fadeUp(i * 0.08)}
                  onClick={() => setOpenCard(isOpen ? null : i)}
                  whileHover={{ y: isOpen ? 0 : -4 }}
                  className="cursor-pointer liquid-glass rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-300"
                  style={{
                    boxShadow: isOpen ? `0 0 40px ${card.accent}22, 0 8px 30px rgba(0,0,0,0.4)` : '0 4px 20px rgba(0,0,0,0.3)',
                    borderColor: isOpen ? `${card.accent}35` : undefined,
                  }}
                >
                  {/* Card header — always visible */}
                  <div className="p-6 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                      style={{ background: `${card.accent}18`, border: `1px solid ${card.accent}35`, color: card.accent }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: card.accent }}>{card.tag}</span>
                      <h3 className="text-base font-bold text-white mt-0.5 leading-snug">{card.title}</h3>
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">{card.desc}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-slate-600 shrink-0 mt-1"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {/* Expandable pipeline steps */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="steps"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 flex flex-wrap gap-2 border-t border-white/[0.06] pt-4">
                          {card.steps.map((step, si) => (
                            <motion.span
                              key={step}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: si * 0.06 }}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                              style={{ background: `${card.accent}15`, border: `1px solid ${card.accent}30`, color: card.accent }}
                            >
                              {si + 1}. {step}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          GLOBAL STATS STRIP
      ══════════════════════════════════ */}
      <section className="relative z-10 bg-slate-950 px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp()}
            className="liquid-glass rounded-2xl px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {GLOBAL_STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: 'spring', bounce: 0.4 }}
                className="text-center"
              >
                <p className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.n}</p>
                <p className="text-slate-500 text-xs leading-tight">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════
          DISCLAIMER CTA BANNER
      ══════════════════════════════════ */}
      <section className="relative z-10 bg-slate-950 px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <motion.div
            {...fadeUp()}
            className="liquid-glass rounded-2xl px-8 py-7 flex flex-col sm:flex-row items-center gap-6"
          >
            <motion.div
              whileHover={{ rotate: 12, scale: 1.1 }}
              className="w-11 h-11 rounded-xl liquid-glass flex items-center justify-center shrink-0 border border-cyan-500/20"
            >
              <FileText className="w-5 h-5 text-cyan-400" />
            </motion.div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-white mb-1">
                Research &{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Educational
                </span>{' '}
                Use Only
              </h3>
              <p className="text-slate-400 text-sm">
                Not a substitute for professional medical advice or clinical diagnosis.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link to="/tool">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 btn-primary rounded-xl text-sm"
                >
                  Try the Tool <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/evaluate">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 btn-glass rounded-xl text-sm"
                >
                  Evaluate <BarChart3 className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
