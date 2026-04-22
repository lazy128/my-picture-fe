import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

const ParticleField = ({ count = 2000, size = 0.02, color = '#8b5cf6' }) => {
  const points = useRef()
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorObj = new THREE.Color(color)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 10
      positions[i3 + 1] = (Math.random() - 0.5) * 10
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      colors[i3] = colorObj.r
      colors[i3 + 1] = colorObj.g
      colors[i3 + 2] = colorObj.b
    }

    return [positions, colors]
  }, [count, color])

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.05
      points.current.rotation.x += delta * 0.02
    }
  })

  return (
    <Points
      ref={points}
      positions={positions}
      colors={colors}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        vertexColors
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

const FloatingShape = ({ position, color, size = 1, speed = 1 }) => {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[size, 1]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.3}
        wireframe
      />
    </mesh>
  )
}

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#06b6d4" />

      <ParticleField
        count={1500}
        size={0.015}
        color="#8b5cf6"
      />

      <FloatingShape position={[-4, 2, -2]} color="#ec4899" size={0.8} speed={0.5} />
      <FloatingShape position={[4, -2, -1]} color="#3b82f6" size={1.2} speed={0.7} />
      <FloatingShape position={[2, 3, -3]} color="#06b6d4" size={0.6} speed={0.9} />
      <FloatingShape position={[-3, -1, 2]} color="#8b5cf6" size={0.9} speed={0.6} />
    </>
  )
}

const ThreeBackground = ({ className }) => {
  return (
    <div className={cn('fixed inset-0 -z-10', className)}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#0a0a0f']} />
        <fog attach="fog" args={['#0a0a0f', 5, 15]} />
        <Scene />
      </Canvas>
    </div>
  )
}

export { ThreeBackground, ParticleField, FloatingShape }
