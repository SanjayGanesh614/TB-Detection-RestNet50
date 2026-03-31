export default function Scene3D() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40 mix-blend-screen bg-transparent">
      {/* Fallback gradient if 3D context fails */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/50 to-slate-950 z-[-2]" />
    </div>
  )
}
