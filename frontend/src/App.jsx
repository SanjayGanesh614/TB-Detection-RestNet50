import { Routes, Route } from 'react-router-dom'
import { Component } from 'react'
import Landing from './pages/Landing'
import DiagnosticTool from './pages/DiagnosticTool'
import Evaluation from './pages/Evaluation'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
          <div className="glass-card-solid p-8 rounded-2xl border border-rose-500/30 max-w-lg text-center">
            <h1 className="text-2xl font-bold text-rose-400 mb-4">Something went wrong</h1>
            <p className="text-slate-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/tool" element={<DiagnosticTool />} />
        <Route path="/evaluate" element={<Evaluation />} />
      </Routes>
    </ErrorBoundary>
  )
}
