import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, Float, Sparkles } from '@react-three/drei';

function Shape({ position, color, edge, scale = 1, kind, speed = 1 }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * 0.12 * speed;
    ref.current.rotation.y += dt * 0.18 * speed;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1.1}>
      <mesh ref={ref} position={position} scale={scale}>
        {kind === 'ico' && <icosahedronGeometry args={[1, 0]} />}
        {kind === 'torus' && <torusGeometry args={[0.9, 0.28, 16, 48]} />}
        {kind === 'octa' && <octahedronGeometry args={[1, 0]} />}
        {kind === 'box' && <boxGeometry args={[1.2, 1.2, 1.2]} />}
        <meshStandardMaterial color={color} metalness={0.55} roughness={0.25} transparent opacity={0.55} />
        <Edges color={edge} threshold={15} />
      </mesh>
    </Float>
  );
}

function Rig({ children }) {
  const group = useRef();
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += (state.pointer.x * 0.25 - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (-state.pointer.y * 0.15 - group.current.rotation.x) * 0.04;
  });
  return <group ref={group}>{children}</group>;
}

export default function Scene3D({ isDark = true, active = true }) {
  const c = isDark
    ? { a: '#22d3ee', b: '#6366f1', c: '#a78bfa', edge: '#67e8f9', spark: '#67e8f9' }
    : { a: '#0891b2', b: '#4338ca', c: '#7c3aed', edge: '#4338ca', spark: '#4f46e5' };
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={isDark ? 0.7 : 1.1} />
      <pointLight position={[6, 5, 6]} intensity={isDark ? 60 : 40} color={c.a} />
      <pointLight position={[-6, -4, 4]} intensity={isDark ? 50 : 30} color={c.c} />
      <Rig>
        <Shape kind="ico" position={[-5.2, 2.4, -1]} scale={0.9} color={c.c} edge={c.edge} />
        <Shape kind="torus" position={[5.6, -2.2, -1]} scale={0.9} color={c.a} edge={c.edge} speed={0.8} />
        <Shape kind="octa" position={[-4.2, -2.6, 0]} scale={0.6} color={c.b} edge={c.edge} speed={1.2} />
        <Shape kind="box" position={[4.6, 3, -2]} scale={0.55} color={c.b} edge={c.edge} speed={0.9} />
        <Sparkles count={45} scale={[14, 8, 6]} size={2.4} speed={0.25} opacity={0.7} color={c.spark} />
      </Rig>
    </Canvas>
  );
}
