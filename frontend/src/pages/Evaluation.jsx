import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowLeft, Activity, BrainCircuit, BarChart3, Award, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Scene3D from '../components/Scene3D'

const API_BASE = '/api'

function MetricCard({ label, value, icon: Icon, color = 'cyan', delay = 0 }) {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const targetValue = typeof value === 'number' ? value : parseFloat(value) || 0
    const duration = 1500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(targetValue * eased)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, value])

  const colorClasses = {
    cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400',
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
    amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
    rose: 'border-rose-500/30 bg-rose-500/5 text-rose-400',
    violet: 'border-violet-500/30 bg-violet-500/5 text-violet-400',
  }

  const getScoreColor = (val) => {
    if (val >= 0.95) return 'emerald'
    if (val >= 0.90) return 'cyan'
    if (val >= 0.80) return 'amber'
    return 'rose'
  }

  const scoreColor = typeof value === 'number' ? getScoreColor(value) : color

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={`glass-card-solid p-6 rounded-2xl border ${colorClasses[scoreColor]} group hover:scale-105 transition-transform`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          scoreColor === 'emerald' ? 'bg-emerald-500/20' :
          scoreColor === 'cyan' ? 'bg-cyan-500/20' :
          scoreColor === 'amber' ? 'bg-amber-500/20' : 'bg-rose-500/20'
        }`}>
          <Icon className={`w-6 h-6 ${
            scoreColor === 'emerald' ? 'text-emerald-400' :
            scoreColor === 'cyan' ? 'text-cyan-400' :
            scoreColor === 'amber' ? 'text-amber-400' : 'text-rose-400'
          }`} />
        </div>
        <span className={`text-xs font-medium uppercase tracking-wider ${
          scoreColor === 'emerald' ? 'text-emerald-400' :
          scoreColor === 'cyan' ? 'text-cyan-400' :
          scoreColor === 'amber' ? 'text-amber-400' : 'text-rose-400'
        }`}>
          {scoreColor === 'emerald' ? 'Excellent' :
           scoreColor === 'cyan' ? 'Good' :
           scoreColor === 'amber' ? 'Moderate' : 'Needs Work'}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-slate-400 text-sm font-medium">{label}</p>
        <p className={`text-4xl font-bold ${
          scoreColor === 'emerald' ? 'text-emerald-300' :
          scoreColor === 'cyan' ? 'text-cyan-300' :
          scoreColor === 'amber' ? 'text-amber-300' : 'text-rose-300'
        }`}>
          {(displayValue * 100).toFixed(1)}%
        </p>
      </div>
    </motion.div>
  )
}

function ConfusionMatrixCard({ data }) {
  if (!data) return null

  const [tn, fp, fn, tp] = data
  const total = tn + fp + fn + tp

  const cells = [
    { label: 'True Negative', value: tn, color: 'emerald' },
    { label: 'False Positive', value: fp, color: 'rose' },
    { label: 'False Negative', value: fn, color: 'amber' },
    { label: 'True Positive', value: tp, color: 'cyan' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card-solid p-6 rounded-2xl border border-cyan-500/30"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-cyan-400" />
        Confusion Matrix
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Predicted labels */}
        <div className="col-span-2 grid grid-cols-3 gap-2 mb-2">
          <div className="text-center text-xs text-slate-500 font-medium">Predicted →</div>
          <div className="text-center text-xs text-emerald-400 font-medium">Normal</div>
          <div className="text-center text-xs text-rose-400 font-medium">Tuberculosis</div>
        </div>

        {/* Actual labels and values */}
        <div className="col-span-2 space-y-2">
          {[
            { actual: 'Normal', cells: [cells[0], cells[1]], actualColor: 'text-emerald-400' },
            { actual: 'Tuberculosis', cells: [cells[2], cells[3]], actualColor: 'text-rose-400' },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 gap-2 items-center">
              <div className={`text-xs font-medium ${row.actualColor}`}>
                Actual {row.actual}
              </div>
              {row.cells.map((cell, j) => (
                <div
                  key={j}
                  className={`glass-card-solid p-3 rounded-lg text-center border ${
                    cell.color === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/5' :
                    cell.color === 'rose' ? 'border-rose-500/30 bg-rose-500/5' :
                    cell.color === 'amber' ? 'border-amber-500/30 bg-amber-500/5' :
                    'border-cyan-500/30 bg-cyan-500/5'
                  }`}
                >
                  <p className={`text-lg font-bold ${
                    cell.color === 'emerald' ? 'text-emerald-300' :
                    cell.color === 'rose' ? 'text-rose-300' :
                    cell.color === 'amber' ? 'text-amber-300' : 'text-cyan-300'
                  }`}>
                    {cell.value}
                  </p>
                  <p className="text-xs text-slate-500">
                    {((cell.value / total) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-slate-500">
        <span>Total Samples: {total}</span>
        <span>Accuracy: {((tn + tp) / total * 100).toFixed(1)}%</span>
      </div>
    </motion.div>
  )
}

function VisualizationCard({ title, image, icon: Icon }) {
  if (!image) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card-solid p-6 rounded-2xl border border-cyan-500/30 overflow-hidden"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Icon className="w-5 h-5 text-cyan-400" />
        {title}
      </h3>
      <div className="rounded-xl overflow-hidden bg-black/20">
        <img
          src={`${API_BASE}${image}`}
          alt={title}
          className="w-full h-auto"
        />
      </div>
    </motion.div>
  )
}

function SHAPCard({ summaryPlot, samplePredictions, individualSamples }) {
  if (!summaryPlot && !samplePredictions) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card-solid p-6 rounded-2xl border border-violet-500/30"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BrainCircuit className="w-5 h-5 text-violet-400" />
        SHAP Explainability
      </h3>
      <p className="text-slate-400 text-sm mb-4">
        Understanding which features the model focuses on for predictions
      </p>

      {summaryPlot && (
        <div className="mb-6 rounded-xl overflow-hidden bg-black/20">
          <img
            src={`${API_BASE}${summaryPlot}`}
            alt="SHAP Summary"
            className="w-full h-auto"
          />
        </div>
      )}

      {samplePredictions && (
        <div className="rounded-xl overflow-hidden bg-black/20">
          <img
            src={`${API_BASE}${samplePredictions}`}
            alt="SHAP Sample Predictions"
            className="w-full h-auto"
          />
        </div>
      )}
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card-solid p-6 rounded-2xl h-40">
            <div className="w-12 h-12 rounded-xl bg-slate-700 mb-4" />
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-2" />
            <div className="h-8 bg-slate-700 rounded w-3/4" />
          </div>
        ))}
      </div>
      <div className="glass-card-solid p-6 rounded-2xl h-64">
        <div className="h-6 bg-slate-700 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-700 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card-solid p-8 rounded-2xl border border-rose-500/30 text-center"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-rose-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Evaluation Not Available</h3>
      <p className="text-slate-400 mb-4 max-w-md mx-auto">{message}</p>
      <div className="text-left bg-slate-900/50 rounded-xl p-4 text-sm font-mono">
        <p className="text-slate-500 mb-2">To generate evaluation metrics:</p>
        <ol className="text-slate-400 space-y-1 list-decimal list-inside">
          <li>Copy <span className="text-cyan-400">evaluation.py</span> to your Kaggle notebook</li>
          <li>Ensure <span className="text-cyan-400">OGbest_model.keras</span> is available</li>
          <li>Run the script to generate <span className="text-cyan-400">evaluation_results.json</span></li>
          <li>Place the JSON file in the <span className="text-cyan-400">backend</span> folder</li>
        </ol>
      </div>
    </motion.div>
  )
}

export default function Evaluation() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [scrollY, setScrollY] = useState(0)

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  const smoothScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const unsubscribe = smoothScrollY.on('change', (v) => {
      setScrollY(v * 600)
    })
    return () => unsubscribe?.()
  }, [smoothScrollY])

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const res = await fetch(`${API_BASE}/evaluate`)
        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.message || 'Failed to fetch evaluation')
        }
        const evalData = await res.json()
        setData(evalData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <Scene3D scrollY={scrollY} />

      <div className="relative z-10">
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-semibold tracking-wide uppercase">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </motion.div>

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-cyan-500/30 text-cyan-300 text-sm font-semibold mb-6">
              <Award className="w-4 h-4" />
              Model Performance Report
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              ResNet50 <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Evaluation</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
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
              {/* Main Metrics Grid */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-cyan-400" />
                  Performance Metrics
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <MetricCard
                    label="Accuracy"
                    value={data.metrics?.accuracy}
                    icon={Activity}
                    delay={0}
                  />
                  <MetricCard
                    label="Precision"
                    value={data.metrics?.precision}
                    icon={BarChart3}
                    delay={0.1}
                  />
                  <MetricCard
                    label="Recall"
                    value={data.metrics?.recall}
                    icon={Activity}
                    delay={0.2}
                  />
                  <MetricCard
                    label="F1-Score"
                    value={data.metrics?.f1_score}
                    icon={Award}
                    delay={0.3}
                  />
                  <MetricCard
                    label="Specificity (Normal)"
                    value={data.metrics?.specificity_normal}
                    icon={BrainCircuit}
                    delay={0.4}
                  />
                  <MetricCard
                    label="ROC-AUC"
                    value={data.metrics?.roc_auc}
                    icon={BarChart3}
                    delay={0.5}
                  />
                </div>
              </section>

              {/* Confusion Matrix */}
              <section>
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                  Classification Results
                </h2>
                <ConfusionMatrixCard data={data.confusion_matrix} />
              </section>

              {/* Visualizations */}
              <section className="grid lg:grid-cols-2 gap-6">
                <VisualizationCard
                  title="Metrics Comparison"
                  image={data.visualizations?.metrics_chart}
                  icon={BarChart3}
                />
                <VisualizationCard
                  title="ROC Curve"
                  image={data.visualizations?.roc_curve}
                  icon={Activity}
                />
              </section>

              {/* SHAP Explainability */}
              <section>
                <SHAPCard
                  summaryPlot={data.shap_explainability?.summary_plot}
                  samplePredictions={data.shap_explainability?.sample_predictions}
                  individualSamples={data.shap_explainability?.individual_samples}
                />
              </section>

              {/* Dataset Info */}
              {data.dataset_info && (
                <section className="glass-card-solid p-6 rounded-2xl border border-white/10">
                  <h2 className="text-xl font-semibold text-white mb-4">Dataset Information</h2>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                      <p className="text-3xl font-bold text-cyan-400">{data.dataset_info.total}</p>
                      <p className="text-slate-400 text-sm">Total Samples</p>
                    </div>
                    <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                      <p className="text-3xl font-bold text-emerald-400">{data.dataset_info.normal_count}</p>
                      <p className="text-slate-400 text-sm">Normal X-rays</p>
                    </div>
                    <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                      <p className="text-3xl font-bold text-rose-400">{data.dataset_info.tb_count}</p>
                      <p className="text-slate-400 text-sm">TB X-rays</p>
                    </div>
                    <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                      <p className="text-3xl font-bold text-violet-400">{(data.dataset_info.test_split * 100).toFixed(0)}%</p>
                      <p className="text-slate-400 text-sm">Test Split</p>
                    </div>
                  </div>
                </section>
              )}

              {/* Footer Navigation */}
              <div className="flex flex-wrap gap-4 justify-center pt-8">
                <Link
                  to="/tool"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Try the Tool
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          ) : null}
        </main>

        <Footer />
      </div>
    </div>
  )
}
