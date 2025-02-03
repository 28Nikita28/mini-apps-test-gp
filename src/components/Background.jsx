import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Float } from '@react-three/drei'

const Background = () => (
  <Canvas className="canvas">
    <ambientLight intensity={0.3} />
    <camera position={[0, 0, 5]} />
    <pointLight position={[5, 5, 5]} intensity={1.5} />
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1}>
      <mesh position={[0, 0, -10]} scale={[0.5, 0.5, 0.5]}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial 
          color="#6366f1" 
          wireframe 
          wireframeLinewidth={2}
        />
      </mesh>
    </Float>
    <Stars 
      radius={150}
      depth={70}
      count={3000}
      factor={3}
      saturation={0}
      fade
      speed={1}
    />
    <OrbitControls 
      enableZoom={false}
      autoRotate
      autoRotateSpeed={0.5}
    />
  </Canvas>
)

export default Background