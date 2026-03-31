import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Microscope, BrainCircuit, Activity, BarChart3, FileText } from 'lucide-react'
import Header from '../components/Header'
import Scene3D from '../components/Scene3D'
import EducationalSection from '../components/EducationalSection'

const features = [
  {
    icon: <BrainCircuit className="w-8 h-8 text-cyan-400" />,
    title: 'Residual Neural Network',
    desc: 'Bypasses the vanishing gradient problem using deep skip connections, ensuring subtle TB nodule features are retained.'
  },
  {
    icon: <Activity className="w-8 h-8 text-emerald-400" />,
    title: 'CLAHE Normalization',
    desc: 'Dynamically enhances local contrast in clinical images, illuminating hidden shadows often associated with early-stage tuberculosis.'
  },
  {
    icon: <Microscope className="w-8 h-8 text-blue-400" />,
    title: 'Grad-CAM Intelligence',
    desc: 'Opens the AI "black box" by generating a heatmap highlighting the exact spatial regions that influenced the diagnosis.'
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-violet-400" />,
    title: 'SHAP Explainability',
    desc: 'Understand which features the model focuses on with SHAP values, providing transparent feature attribution.'
  },
]

const navigation = [
  { name: 'Diagnostic Tool', href: '/tool', icon: Activity },
  { name: 'Model Evaluation', href: '/evaluate', icon: BarChart3 },
]

export default function Landing() {
  const containerRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (v) => {
      setScrollY(v * 600)
    })
    return () => unsubscribe?.()
  }, [smoothProgress])
  
  // Image animations
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1.8, 1])
  const imageBlur = useTransform(scrollYProgress, [0, 0.2], ['16px', '0px'])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.4, 0.7, 0.7, 0])
  
  // Hero fade out
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -100])
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95])
  
  // Text layers with continuous visibility
  const text1Opacity = useTransform(scrollYProgress, [0.12, 0.18, 0.32, 0.38], [0, 1, 1, 0])
  const text1Y = useTransform(scrollYProgress, [0.12, 0.18, 0.32, 0.38], [80, 0, 0, -80])
  
  const text2Opacity = useTransform(scrollYProgress, [0.35, 0.42, 0.58, 0.65], [0, 1, 1, 0])
  const text2Y = useTransform(scrollYProgress, [0.35, 0.42, 0.58, 0.65], [80, 0, 0, -80])
  
  const ctaOpacity = useTransform(scrollYProgress, [0.62, 0.70, 0.90, 0.98], [0, 1, 1, 0])
  const ctaY = useTransform(scrollYProgress, [0.62, 0.70, 0.90, 0.98], [80, 0, 0, -80])
  
  // Section 2 visibility
  const section2Opacity = useTransform(scrollYProgress, [0.85, 0.92], [0, 1])
  const section2Y = useTransform(scrollYProgress, [0.85, 0.92], [50, 0])

  return (
    <div className="relative bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 3D Background */}
      <Scene3D scrollY={scrollY} />
      
      <Header />
      
      {/* Hero Section with Scroll Animation */}
      <section ref={containerRef} className="relative h-[600vh] w-full z-10">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Background Image */}
          <motion.div 
            style={{ 
              scale: imageScale,
              opacity: imageOpacity,
            }}
            className="absolute inset-0 origin-center z-0 pointer-events-none"
          >
            <img 
              src="/lab-bg.png" 
              alt="Medical Lab" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/80" />
          </motion.div>

          {/* Text Content */}
          <div className="relative z-20 w-full max-w-5xl mx-auto px-6 h-full flex items-center justify-center text-center pointer-events-none">
            
            {/* HERO */}
            <motion.div 
              style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
              className="absolute w-full px-4 flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full glass-card border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                System Online
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6">
                Diagnosis, <br/>
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent inline-block pb-2">
                  Reimagined.
                </span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-300 font-light max-w-2xl mx-auto drop-shadow-lg mb-8">
                High-precision clinical diagnostics powered by ResNet50 deep learning. Scroll down to discover the unseen.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pointer-events-auto">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-all hover:scale-105"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* WHAT IS TB */}
            <motion.div 
              style={{ opacity: text1Opacity, y: text1Y }}
              className="absolute w-full px-4 max-w-3xl flex flex-col items-center"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-xl">
                The Tuberculosis <span className="text-cyan-400">Threat.</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed shadow-slate-900/50 drop-shadow-lg">
                Tuberculosis remains one of the world's deadliest infectious diseases. Early and accurate detection from chest radiographs is critical, but subtle early-stage pulmonary nodules are incredibly elusive to the human eye.
              </p>
            </motion.div>

            {/* HOW WE DETECT IT */}
            <motion.div 
              style={{ opacity: text2Opacity, y: text2Y }}
              className="absolute w-full px-4 max-w-3xl flex flex-col items-center"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-emerald-400 mb-6 drop-shadow-xl">
                Beyond Human Vision.
              </h2>
              <p className="text-lg md:text-xl text-slate-200 font-light leading-relaxed shadow-slate-900/50 drop-shadow-lg">
                Our bespoke AI pipeline utilizes <span className="text-white font-medium">CLAHE normalization</span> to illuminate hidden shadows, and a deep <span className="text-white font-medium">ResNet50 architecture</span> that analyzes millions of microscopic pixel derivations to identify diagnosis anomalies instantly.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div 
              style={{ opacity: ctaOpacity, y: ctaY }}
              className="absolute w-full px-4 max-w-3xl flex flex-col items-center pointer-events-auto"
            >
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-xl">
                Ready to initiate scanning?
              </h2>
              <p className="text-lg md:text-xl text-slate-300 font-light mb-12">
                Step into the future of automated diagnostics. Upload radiograph data to begin inference immediately.
              </p>
              <Link 
                to="/tool" 
                className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-slate-950 bg-cyan-400 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(34,211,238,0.4)] hover:shadow-[0_0_60px_rgba(34,211,238,0.6)]"
              >
                <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                Launch Inference Engine
                <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Educational Section */}
      <EducationalSection />

      {/* Features Grid */}
      <motion.section 
        style={{ opacity: section2Opacity, y: section2Y }}
        className="relative z-30 bg-slate-950 py-32 px-6 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] z-0" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent mb-6">
              Clinical Intelligence Demystified
            </h2>
            <p className="text-xl text-slate-400 font-light max-w-3xl mx-auto">
              Behind the sleek interface is a robust pipeline transforming raw radiographic data into actionable clinical insights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <section className="relative z-30 bg-slate-950 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <FileText className="w-12 h-12 text-cyan-400 mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Research & Educational Use Only
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
              This tool is designed for demonstration and educational purposes. It is not intended for clinical diagnosis or as a substitute for professional medical advice. Always consult with qualified healthcare providers for medical decisions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link
                to="/tool"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors"
              >
                Try the Tool
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/evaluate"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
              >
                View Evaluation
                <BarChart3 className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
