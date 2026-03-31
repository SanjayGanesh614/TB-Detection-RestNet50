import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import gsap from 'gsap'

export default function Hero({ onStart }) {
  const containerRef = useRef(null)
  
  // Parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })
  
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden flex items-center justify-center pt-16"
    >
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/hero-bg.png)',
          y: yBg
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-slate-950/60 transition-all" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl px-4"
        style={{ opacity: opacityText, y: yText }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full glass-card border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.2)]"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          ResNet50 Architecture
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-6 leading-tight drop-shadow-2xl"
        >
          Tuberculosis Detection <br />
          <span className="text-glow-cyan text-cyan-400">Reimagined by AI</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-12 font-light leading-relaxed text-shadow"
        >
          High-precision clinical diagnostics powered by deep learning.
          Upload a chest radiograph to activate the inference pipeline and
          explore the neural network's visual decision-making process.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button 
            onClick={onStart}
            className="btn-primary flex items-center gap-3 text-lg group"
          >
            Initialize Scan 
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative High-tech frames */}
      <div className="absolute top-24 left-8 text-cyan-500/30 font-mono text-xs hidden md:block">
        SYS.REQ: RUNNING <br/>
        MEM.ALC: 4.2GB <br/>
        NET.STA: OPTIMAL <br/>
      </div>
      <div className="absolute bottom-12 right-8 text-cyan-500/30 font-mono text-xs hidden md:block text-right">
        [TENSOR_FLOW_ACTIVE] <br/>
        RESNET.50.WEIGHTS_L <br/>
        v2.4.0 <br/>
      </div>
    </section>
  )
}
