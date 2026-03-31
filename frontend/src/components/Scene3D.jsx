import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

function DNAHelix({ scrollY = 0 }) {
  const groupRef = useRef()
  const nodes1Ref = useRef([])
  const nodes2Ref = useRef([])
  const rungsRef = useRef([])
  
  const params = useMemo(() => ({
    segments: 40,
    radius: 1.5,
    height: 12,
    turns: 3,
    nodeRadius: 0.15,
    rungRadius: 0.03,
  }), [])
  
  useFrame((state) => {
    if (groupRef.current) {
      // Base rotation
      const time = state.clock.getElapsedTime()
      groupRef.current.rotation.y = time * 0.15
      
      // Scroll-based rotation
      const scrollRotation = scrollY * 0.002
      groupRef.current.rotation.x = scrollRotation
      groupRef.current.rotation.z = Math.sin(scrollRotation * 0.5) * 0.2
      
      // Parallax based on scroll
      groupRef.current.position.y = -scrollY * 0.005
      groupRef.current.position.z = Math.sin(scrollRotation) * 2
    }
    
    // Animate individual nodes
    nodes1Ref.current.forEach((node, i) => {
      if (node) {
        node.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 2 + i * 0.3) * 0.1)
      }
    })
    nodes2Ref.current.forEach((node, i) => {
      if (node) {
        node.scale.setScalar(1 + Math.sin(state.clock.getElapsedTime() * 2 + i * 0.3 + Math.PI) * 0.1)
      }
    })
    
    // Animate rungs
    rungsRef.current.forEach((rung, i) => {
      if (rung) {
        const phase = Math.sin(state.clock.getElapsedTime() * 1.5 + i * 0.2) * 0.1
        rung.scale.set(1 + phase, 1, 1)
      }
    })
  })
  
  const helixPoints1 = useMemo(() => {
    const points = []
    for (let i = 0; i <= params.segments; i++) {
      const t = i / params.segments
      const angle = t * Math.PI * 2 * params.turns
      const x = Math.cos(angle) * params.radius
      const y = (t - 0.5) * params.height
      const z = Math.sin(angle) * params.radius
      points.push(new THREE.Vector3(x, y, z))
    }
    return points
  }, [params])
  
  const helixPoints2 = useMemo(() => {
    const points = []
    for (let i = 0; i <= params.segments; i++) {
      const t = i / params.segments
      const angle = t * Math.PI * 2 * params.turns + Math.PI
      const x = Math.cos(angle) * params.radius
      const y = (t - 0.5) * params.height
      const z = Math.sin(angle) * params.radius
      points.push(new THREE.Vector3(x, y, z))
    }
    return points
  }, [params])
  
  return (
    <group ref={groupRef}>
      {/* Helix Strand 1 */}
      {helixPoints1.map((point, i) => (
        <mesh
          key={`node1-${i}`}
          ref={(el) => (nodes1Ref.current[i] = el)}
          position={point}
        >
          <sphereGeometry args={[params.nodeRadius, 16, 16]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
      
      {/* Helix Strand 2 */}
      {helixPoints2.map((point, i) => (
        <mesh
          key={`node2-${i}`}
          ref={(el) => (nodes2Ref.current[i] = el)}
          position={point}
        >
          <sphereGeometry args={[params.nodeRadius, 16, 16]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={0.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
      
      {/* Rungs connecting the two strands */}
      {helixPoints1.map((point1, i) => {
        const point2 = helixPoints2[i]
        const midPoint = point1.clone().add(point2).multiplyScalar(0.5)
        const direction = point2.clone().sub(point1)
        const length = direction.length()
        
        return (
          <mesh
            key={`rung-${i}`}
            ref={(el) => (rungsRef.current[i] = el)}
            position={midPoint}
            rotation={[0, 0, Math.atan2(direction.z, direction.x) + Math.PI / 2, 'YXZ']}
          >
            <cylinderGeometry args={[params.rungRadius, params.rungRadius, length, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#34d399' : '#fbbf24'}
              emissive={i % 2 === 0 ? '#34d399' : '#fbbf24'}
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        )
      })}
      
      {/* Connection lines */}
      <Line points={helixPoints1} color="#22d3ee" opacity={0.3} />
      <Line points={helixPoints2} color="#a855f7" opacity={0.3} />
    </group>
  )
}

function Line({ points, color, opacity = 0.5 }) {
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [points])
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}

function FloatingParticles() {
  const particlesRef = useRef()
  
  const count = 200
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1
    }
  })
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#67e8f9"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function DNAHelixWithScroll({ scrollY }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#22d3ee" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />
      
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <DNAHelix scrollY={scrollY} />
      </Float>
      
      <FloatingParticles />
      
      <Stars
        radius={100}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      <fog attach="fog" args={['#020617', 10, 30]} />
    </Canvas>
  )
}

export default function Scene3D({ scrollY = 0 }) {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <DNAHelixWithScroll scrollY={scrollY} />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
    </div>
  )
}

export { DNAHelixWithScroll }
