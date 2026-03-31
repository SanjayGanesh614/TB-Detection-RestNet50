import { motion } from 'framer-motion'
import { Microscope, BrainCircuit, Activity } from 'lucide-react'

const features = [
  {
    icon: <BrainCircuit className="w-6 h-6 text-cyan-400" />,
    title: 'Residual Neural Network (ResNet50)',
    desc: 'Bypasses the vanishing gradient problem using skip connections, allowing the network to reliably extract subtle features from dense X-ray tissue.',
  },
  {
    icon: <Activity className="w-6 h-6 text-teal-400" />,
    title: 'Contrast Limited Adaptive Histogram Equalization',
    desc: 'CLAHE dynamically enhances local contrast in clinical images, illuminating hidden shadows often associated with early-stage tuberculosis nodules.',
  },
  {
    icon: <Microscope className="w-6 h-6 text-emerald-400" />,
    title: 'Gradient-weighted Class Activation Mapping',
    desc: 'Grad-CAM opens the AI "black box" by highlighting the specific spatial regions in the radiograph that most strongly influenced the final diagnosis.',
  }
]

export default function EducationalSection() {
  return (
    <section className="py-24 relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-white mb-4"
        >
          Clinical Intelligence <span className="text-cyan-400">Demystified</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 max-w-2xl mx-auto text-lg"
        >
          Our pipeline bridges the physical and mathematical realms, transforming raw pixels into actionable clinical insights.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="glass-card-solid p-8 relative overflow-hidden group hover:-translate-y-2"
          >
            {/* Hover Glow Behind Icon */}
            <div className="absolute top-8 left-8 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors duration-500 z-0" />
            
            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-6 relative z-10 shadow-lg group-hover:border-cyan-500/30 transition-colors">
              {item.icon}
            </div>
            
            <h3 className="text-xl font-semibold text-slate-200 mb-3 relative z-10 group-hover:text-white transition-colors">
              {item.title}
            </h3>
            
            <p className="text-slate-400 leading-relaxed text-sm relative z-10">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
