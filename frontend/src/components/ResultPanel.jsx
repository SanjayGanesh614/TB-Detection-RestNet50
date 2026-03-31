import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PredictionCard from './PredictionCard'
import PreprocessingSteps from './PreprocessingSteps'
import GradCamSection from './GradCamSection'
import { Microscope, Activity, Eye, Image as ImageIcon } from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Diagnostic Overview', icon: Activity },
  { id: 'pipeline', label: 'Processing Pipeline', icon: ImageIcon },
  { id: 'explainability', label: 'AI Explainability', icon: Eye }
]

export default function ResultPanel({ result }) {
  const [activeTab, setActiveTab] = useState('overview')

  const originalSrc = result.preprocessing_steps?.original
    ? `data:image/png;base64,${result.preprocessing_steps.original}`
    : null

  return (
    <div className="w-full glass-panel border border-cyan-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-900/10">
      
      {/* Header & Navigation */}
      <div className="bg-slate-900/80 border-b border-white/10 p-4 sm:px-8">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
          <Microscope className="w-6 h-6 text-cyan-400" />
          Analysis Results
        </h2>
        
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/30 rounded-lg -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative bg-slate-900/40 p-6 sm:p-8 min-h-[500px]">
        <AnimatePresence mode="wait">
          
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-8 items-start"
            >
              {/* Input Image Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                  Source Radiograph
                </div>
                <div className="glass-card-solid overflow-hidden rounded-xl border-white/10 relative group">
                  {originalSrc ? (
                    <>
                      <img src={originalSrc} alt="Uploaded X-ray" className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                    </>
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center text-slate-500 bg-slate-900/80">No image available</div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                     <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Input Sequence 001</p>
                  </div>
                </div>
              </div>

              {/* Prediction Result */}
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Diagnostic Output
                </div>
                <PredictionCard result={result} />
                
                <div className="glass-card bg-cyan-900/10 border-cyan-500/20 p-5 mt-6">
                   <h4 className="text-sm font-semibold text-cyan-300 mb-2">Automated Next Steps</h4>
                   <p className="text-slate-400 text-sm leading-relaxed">
                     Based on the ResNet50 classification, please review the <strong>Processing Pipeline</strong> to verify the image quality, and consult the <strong>AI Explainability (Grad-CAM)</strong> heatmap to understand which precise regions of the lung influenced this prediction.
                   </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pipeline' && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white">Digital Image Processing</h3>
                <p className="text-slate-400 text-sm mt-1">High-fidelity transformations applied prior to tensor input.</p>
              </div>
              <PreprocessingSteps steps={result.preprocessing_steps} />
            </motion.div>
          )}

          {activeTab === 'explainability' && (
            <motion.div
              key="explainability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white">XAI: Gradient-weighted Class Activation Mapping</h3>
                <p className="text-slate-400 text-sm mt-1">Visualizing the spatial attention map from the final convolutional layer.</p>
              </div>
              <GradCamSection result={result} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
