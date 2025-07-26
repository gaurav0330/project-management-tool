import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'  // LOCK import removed

function RotatingCube({ position, color, scale = 1 }) {
  const mesh = useRef()
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.3
      mesh.current.rotation.y += delta * 0.5
      mesh.current.rotation.z += delta * 0.2
    }
  })
  return (
    <mesh position={position} ref={mesh} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function FloatingLock() {
  const mesh = useRef()
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.position.y = Math.sin(Date.now() / 1000) * 0.3 + 2
      mesh.current.rotation.y += delta * 0.75
    }
  })
  return (
    <mesh ref={mesh} position={[0, 2, 0]} castShadow>
      <torusGeometry args={[0.3, 0.08, 16, 100, Math.PI]} />
      <meshStandardMaterial color="#f59e0b" />
    </mesh>
  )
}

export default function Login3DIllustration() {
  return (
    <div className="w-full h-[400px] md:h-[500px] rounded-xl shadow-2xl border border-brand-primary-200">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [5, 5, 7], fov: 45 }}
        style={{ borderRadius: '1rem' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          castShadow
          position={[5, 10, 7]}
          intensity={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-radius={10}
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial transparent opacity={0.25} />
        </mesh>
        <RotatingCube position={[-1.5, 0, 0]} color="#3b82f6" />
        <RotatingCube position={[0, 0.8, 0]} color="#a855f7" scale={1.5} />
        <RotatingCube position={[1.5, -0.3, 0]} color="#10b981" />
        <FloatingLock />
        <Text
          position={[0, 3.2, 0]}
          fontSize={0.7}
          color="#0ea5e9"
          // font="/fonts/Poppins-Bold.ttf" // Optional, remove if you don't have font file
          anchorX="center"
          anchorY="middle"
        >
          Login
        </Text>
        <mesh position={[0, 1.2, 1.4]} castShadow>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}
